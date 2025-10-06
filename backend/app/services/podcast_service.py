"""
Podcast generation service: builds a conversational transcript from course materials
and generates audio using OpenAI TTS. Stores audio locally or in S3 based on config.
"""
import io
import tempfile
import os
import uuid
import logging
from typing import Optional, List, Tuple

import boto3
from fastapi import HTTPException

from app.api.routes.documents import async_openai_client
from app.core.config import settings
from app.models.podcast import Podcast
from app.api.deps import SessionDep
from app.services.rag_service import get_question_embedding, retrieve_relevant_context
import json

logger = logging.getLogger(__name__)

ALLOWED_VOICES = {
    "alloy", "echo", "fable", "onyx", "nova", "shimmer",
    "coral", "verse", "ballad", "ash", "sage", "marin", "cedar",
}

def _sanitize_voice(voice: str, fallback: str) -> str:
    v = (voice or "").strip().lower()
    if v in ALLOWED_VOICES:
        return v
    fb = (fallback or settings.PODCAST_TEACHER_VOICE).strip().lower()
    logger.warning("[PODCAST] Unsupported voice '%s'. Using fallback '%s'", voice, fb)
    return fb if fb in ALLOWED_VOICES else "alloy"


PROMPT_TEMPLATE = (
    "You are producing a short conversational podcast between a Teacher and a Student.\n"
    "Use the following course context to guide the conversation. The Teacher should explain core ideas clearly,\n"
    "and the Student should ask natural, helpful questions someone might have.\n\n"
    "Constraints:\n"
    "- Keep it concise (2-4 minutes when spoken).\n"
    "- Alternate turns: start with 'Teacher:' then 'Student:', etc.\n"
    "- Do not reference that you are an AI.\n"
    "- Stay grounded strictly in the provided context; avoid speculation.\n\n"
    "Context:\n{context}\n\n"
    "Output format:\n"
    "Teacher: <first line>\n"
    "Student: <question>\n"
    "Teacher: <answer>\n"
    "... (2-6 exchanges total)\n"
)

# Monologue (presentation) prompt: no speaker tags
PROMPT_MONO_TEMPLATE = (
    "You are producing a concise educational presentation (single narrator).\n"
    "Use the following course context to deliver a clear, coherent explanation,\n"
    "highlighting key ideas, definitions, examples, and takeaways.\n\n"
    "Constraints:\n"
    "- Keep it to ~2-4 minutes when spoken.\n"
    "- No speaker labels or dialogue.\n"
    "- Maintain an engaging, instructive, academic tone.\n"
    "- Stay strictly grounded in the provided context; no speculation.\n\n"
    "Context:\n{context}\n\n"
    "Output: A single continuous narrative (no role tags).\n"
)


async def generate_transcript_from_context(context: str, title: str) -> str:
    system = (
        "You create engaging, accurate educational dialog scripts suitable for audio narration."
    )
    user = PROMPT_TEMPLATE.format(context=context)
    resp = await async_openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Title: {title}\n\n{user}"},
        ],
        temperature=0.6,
        max_tokens=1200,
    )
    content = resp.choices[0].message.content or ""
    return content.strip()


async def generate_presentation_transcript(context: str, title: str) -> str:
    system = (
        "You create concise, accurate educational presentations suitable for audio narration."
    )
    user = PROMPT_MONO_TEMPLATE.format(context=context)
    resp = await async_openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Title: {title}\n\n{user}"},
        ],
        temperature=0.6,
        max_tokens=1200,
    )
    content = resp.choices[0].message.content or ""
    return content.strip()


async def generate_dialog_turns_from_context(context: str, title: str) -> list[dict]:
    """Ask LLM to produce structured dialog JSON: {"turns": [{"role":"teacher"|"student","text":"..."}, ...]}"""
    system = (
        "You create concise, accurate educational dialogues grounded in provided context."
        " Return ONLY strict JSON with the following structure and nothing else:"
        " {\n  \"turns\": [ { \"role\": \"teacher\", \"text\": \"...\" }, { \"role\": \"student\", \"text\": \"...\" } ]\n }"
    )
    user = (
        "Create a 2-4 minute dialogue alternating roles 'teacher' and 'student'.\n"
        "Rules:\n- No extra commentary, return pure JSON.\n- Alternate roles.\n- 4 to 10 total turns.\n- Stay within the context.\n\n"
        f"Title: {title}\nContext:\n{context}"
    )
    resp = await async_openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.6,
        max_tokens=1200,
    )
    content = resp.choices[0].message.content or ""
    try:
        data = json.loads(content)
        turns = data.get("turns", [])
        # Strict: accept only teacher/student roles
        cleaned = []
        for t in turns:
            role = (t.get("role") or "").lower()
            text = (t.get("text") or "").strip()
            if role in ("teacher", "student") and text:
                cleaned.append({"role": role, "text": text})
        if cleaned:
            return cleaned
        # If JSON parsed but roles invalid/empty, fall back to text parsing
        logger.warning("[PODCAST] Dialog JSON contained no teacher/student roles; falling back to text parsing")
        txt = await generate_transcript_from_context(context, title)
        segs = _parse_dialog_segments(txt)
        return [{"role": r, "text": t} for r, t in segs]
    except Exception:
        logger.warning("[PODCAST] JSON dialog parse failed; falling back to text parsing")
        # fallback to text-based transcript and parsing
        txt = await generate_transcript_from_context(context, title)
        segs = _parse_dialog_segments(txt)
        return [{"role": r, "text": t} for r, t in segs]


async def tts_generate_audio(transcript: str) -> bytes:
    """Generate TTS audio bytes from transcript using OpenAI TTS."""
    try:
        # Prefer streaming API to avoid response shape issues across SDK versions
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            tmp_path = tmp.name
        try:
            safe_voice = _sanitize_voice(settings.PODCAST_TEACHER_VOICE, settings.PODCAST_TEACHER_VOICE)
            async with async_openai_client.audio.speech.with_streaming_response.create(
                model="gpt-4o-mini-tts",
                voice=safe_voice,
                input=transcript,
            ) as response:
                await response.stream_to_file(tmp_path)
            with open(tmp_path, "rb") as f:
                return f.read()
        finally:
            try:
                os.remove(tmp_path)
            except Exception:
                pass
    except Exception as e:
        logger.exception("[PODCAST] TTS generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {e}")


def ensure_local_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def store_audio_local(audio_bytes: bytes, filename: str) -> str:
    ensure_local_dir(settings.PODCAST_LOCAL_DIR)
    dest_path = os.path.join(settings.PODCAST_LOCAL_DIR, filename)
    with open(dest_path, "wb") as f:
        f.write(audio_bytes)
    return dest_path


def store_audio_s3(audio_bytes: bytes, key: str) -> str:
    if not settings.S3_BUCKET_NAME or not settings.AWS_REGION:
        raise HTTPException(status_code=500, detail="S3 configuration is missing")
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
    bucket = settings.S3_BUCKET_NAME
    s3.put_object(Bucket=bucket, Key=key, Body=audio_bytes, ContentType="audio/mpeg")
    # Return an s3:// URL; clients should hit our audio endpoint or a presigned URL
    return f"s3://{bucket}/{key}"


async def generate_podcast_for_course(
    session: SessionDep,
    course_id: uuid.UUID,
    title: str,
    teacher_voice: str,
    student_voice: str,
    narrator_voice: str,
    mode: str = "dialogue",
    topics: Optional[str] = None,
    document_ids: Optional[list[uuid.UUID]] = None,
) -> Podcast:
    # Retrieve broad context for the course by embedding a generic request and pulling top content
    focus = f" Provide an overview for course {course_id}." + (f" Focus on: {topics}." if topics else "")
    question_embedding = await get_question_embedding(focus)
    context = await retrieve_relevant_context(question_embedding, course_id, top_k=8, document_ids=document_ids)
    if not context:
        raise HTTPException(status_code=400, detail="No relevant content available for podcast")

    if mode == "presentation":
        # Single narrator monologue (no role tags)
        monologue = await generate_presentation_transcript(context, f"{title} (Presentation Mode)")
        audio_bytes = await _tts_to_bytes(monologue, narrator_voice)
        transcript = monologue
    else:
        # Build alternating-speaker audio with different voices using structured turns
        turns = await generate_dialog_turns_from_context(context, title)
        # Add a blank line between turns for better readability
        transcript = "\n\n".join([
            (f"Teacher: {t['text']}" if t['role'] == "teacher" else f"Student: {t['text']}")
            for t in turns
        ])
        if turns:
            temp_files: List[str] = []
            try:
                for t in turns:
                    voice = teacher_voice if t["role"] == "teacher" else student_voice
                    path = await _tts_to_temp_file(t["text"], voice)
                    temp_files.append(path)
                audio_bytes = _concat_files(temp_files)
            finally:
                for p in temp_files:
                    try:
                        os.remove(p)
                    except Exception:
                        pass
        else:
            audio_bytes = await tts_generate_audio(transcript)
    pod_id = uuid.uuid4()

    storage = settings.PODCAST_STORAGE
    if storage == "s3":
        key = f"{settings.S3_PREFIX}{pod_id}.mp3"
        audio_path = store_audio_s3(audio_bytes, key)
    else:
        filename = f"{pod_id}.mp3"
        audio_path = store_audio_local(audio_bytes, filename)
        storage = "local"

    podcast = Podcast(
        id=pod_id,
        course_id=course_id,
        title=title,
        transcript=transcript,
        audio_path=audio_path,
        storage_backend=storage,
    )
    session.add(podcast)
    session.commit()
    session.refresh(podcast)
    logger.info(
        "[PODCAST] Generated | id=%s | storage=%s | audio_path=%s",
        str(podcast.id),
        storage,
        audio_path,
    )
    return podcast


def _parse_dialog_segments(transcript: str) -> List[Tuple[str, str]]:
    segments: List[Tuple[str, str]] = []
    current_speaker: Optional[str] = None
    current_text: List[str] = []
    for raw in transcript.splitlines():
        line = raw.strip()
        if not line:
            continue
        lower = line.lower()
        spk = None
        if lower.startswith("teacher:"):
            spk = "teacher"
            content = line.split(":", 1)[1].strip()
        elif lower.startswith("student:"):
            spk = "student"
            content = line.split(":", 1)[1].strip()
        else:
            content = line
        if spk is not None:
            if current_speaker is not None and current_text:
                segments.append((current_speaker, " ".join(current_text).strip()))
            current_speaker = spk
            current_text = [content]
        else:
            if current_speaker is None:
                current_speaker = "teacher"
            current_text.append(content)
    if current_speaker is not None and current_text:
        segments.append((current_speaker, " ".join(current_text).strip()))
    return [(s, t) for s, t in segments if t]


async def _tts_to_temp_file(text: str, voice: str) -> str:
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        safe_voice = _sanitize_voice(voice, settings.PODCAST_TEACHER_VOICE)
        async with async_openai_client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice=safe_voice,
            input=text,
        ) as response:
            await response.stream_to_file(tmp_path)
        return tmp_path
    except Exception as e:
        logger.exception("[PODCAST] TTS segment failed (voice=%s): %s", voice, e)
        try:
            os.remove(tmp_path)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"TTS segment failed: {e}")


async def _tts_to_bytes(text: str, voice: str) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        safe_voice = _sanitize_voice(voice, settings.PODCAST_TEACHER_VOICE)
        async with async_openai_client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice=safe_voice,
            input=text,
        ) as response:
            await response.stream_to_file(tmp_path)
        with open(tmp_path, 'rb') as f:
            return f.read()
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass


def _concat_files(paths: List[str]) -> bytes:
    if not paths:
        return b""
    # Naive byte concatenation works for many MP3 players and is acceptable for MVP
    chunks: List[bytes] = []
    for p in paths:
        try:
            with open(p, 'rb') as f:
                chunks.append(f.read())
        except Exception as e:
            logger.exception("[PODCAST] Failed reading segment %s: %s", p, e)
    return b"".join(chunks)
