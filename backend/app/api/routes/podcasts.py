import os
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models.podcast import Podcast
from app.schemas.internal import GeneratePodcastRequest
from app.schemas.public import PodcastPublic, PodcastsPublic
from app.services.podcast_service import generate_podcast_for_course

router = APIRouter(prefix="/podcasts", tags=["podcasts"])


@router.get("/course/{course_id}", response_model=PodcastsPublic)
def list_podcasts(course_id: uuid.UUID, session: SessionDep, _current_user: CurrentUser, skip: int = 0, limit: int = 50) -> PodcastsPublic:
    pods = session.exec(select(Podcast).where(Podcast.course_id == course_id).order_by(Podcast.created_at.desc()).offset(skip).limit(limit)).all()
    return PodcastsPublic(data=[PodcastPublic.model_validate(p) for p in pods])



@router.post("/course/{course_id}/generate", response_model=PodcastPublic)
async def generate_podcast(
    course_id: uuid.UUID,
    session: SessionDep,
    _current_user: CurrentUser,
    body: GeneratePodcastRequest,
) -> PodcastPublic:
    title = body.title.strip()
    mode = body.mode
    topics = body.topics
    teacher_voice = body.teacher_voice or settings.PODCAST_TEACHER_VOICE
    student_voice = body.student_voice or settings.PODCAST_STUDENT_VOICE
    narrator_voice = body.narrator_voice or settings.PODCAST_TEACHER_VOICE
    doc_ids = body.document_ids
    podcast = await generate_podcast_for_course(
        session,
        course_id,
        title,
        teacher_voice,
        student_voice,
        narrator_voice,
        mode,
        topics,
        doc_ids,
    )
    return PodcastPublic.model_validate(podcast)


@router.get("/{podcast_id}", response_model=PodcastPublic)
def get_podcast(podcast_id: uuid.UUID, session: SessionDep, _current_user: CurrentUser) -> PodcastPublic:
    pod = session.get(Podcast, podcast_id)
    if not pod:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return PodcastPublic.model_validate(pod)


@router.get("/{podcast_id}/audio")
def stream_audio(podcast_id: uuid.UUID, session: SessionDep, _current_user: CurrentUser):
    pod = session.get(Podcast, podcast_id)
    if not pod:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if pod.storage_backend == "local":
        file_path = pod.audio_path
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Audio file missing")
        def iterfile():
            with open(file_path, "rb") as f:
                while chunk := f.read(8192):
                    yield chunk
        return StreamingResponse(iterfile(), media_type="audio/mpeg")
    else:
        # For S3, return a presigned URL to let client fetch directly
        try:
            import boto3
            s3 = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
            bucket = settings.S3_BUCKET_NAME
            if not bucket:
                raise ValueError("S3 bucket not configured")
            key = pod.audio_path.replace(f"s3://{bucket}/", "") if pod.audio_path.startswith("s3://") else pod.audio_path
            url = s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': bucket, 'Key': key},
                ExpiresIn=3600,
            )
            return JSONResponse({"url": url})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate S3 URL: {e}")


@router.delete("/{podcast_id}")
def delete_podcast(podcast_id: uuid.UUID, session: SessionDep, current_user: CurrentUser) -> dict[str, str]:
    pod = session.exec(
        select(Podcast).where(Podcast.id == podcast_id).options(selectinload(Podcast.course))  # type: ignore
    ).first()

    if not pod:
        raise HTTPException(status_code=404, detail="Podcast not found")

    # Permission: owner or superuser
    if not current_user.is_superuser and getattr(pod, "course", None) and pod.course.owner_id != current_user.id:  # type: ignore
        raise HTTPException(status_code=403, detail="Not enough permissions to delete this podcast")

    # Best-effort delete of underlying media
    try:
        if pod.storage_backend == "local" and pod.audio_path and os.path.exists(pod.audio_path):
            try:
                os.remove(pod.audio_path)
            except Exception:
                pass
        elif pod.storage_backend == "s3" and pod.audio_path:
            try:
                import boto3
                bucket = settings.S3_BUCKET_NAME
                if bucket:
                    key = pod.audio_path.replace(f"s3://{bucket}/", "") if pod.audio_path.startswith("s3://") else pod.audio_path
                    s3 = boto3.client(
                        "s3",
                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                        region_name=settings.AWS_REGION,
                    )
                    s3.delete_object(Bucket=bucket, Key=key)
            except Exception:
                # ignore media delete failures
                pass
    finally:
        session.delete(pod)
        session.commit()
    return {"message": "Podcast deleted successfully"}
