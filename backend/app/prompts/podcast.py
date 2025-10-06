"""Prompt templates for podcast generation."""

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


def dialogue_prompt(context: str, title: str | None = None) -> str:
    """Format the dialogue prompt with optional title metadata."""
    prefix = f"Title: {title}\n\n" if title else ""
    return f"{prefix}{PROMPT_TEMPLATE.format(context=context)}"


def presentation_prompt(context: str, title: str | None = None) -> str:
    """Format the monologue prompt with optional title metadata."""
    prefix = f"Title: {title}\n\n" if title else ""
    return f"{prefix}{PROMPT_MONO_TEMPLATE.format(context=context)}"


# TTS Instructions for different roles and modes
TTS_TEACHER_INSTRUCTIONS = """Accent/Affect: Warm, knowledgeable, and patient, like an experienced teacher explaining concepts.

Tone: Encouraging, clear, and supportive, making learning feel accessible and enjoyable.

Pacing: Moderate with thoughtful pauses, allowing students to process information.

Emotion: Patient and enthusiastic, conveying genuine care for student understanding.

Pronunciation: Clearly articulate educational terms and concepts with gentle emphasis.

Personality Affect: Friendly and authoritative, speaking with confidence while remaining approachable and supportive."""

TTS_STUDENT_INSTRUCTIONS = """Accent/Affect: Curious, engaged, and slightly uncertain, like an eager learner asking questions.

Tone: Inquisitive, sometimes hesitant, but genuinely interested in understanding.

Pacing: Slightly faster when excited, with natural pauses when thinking.

Emotion: Enthusiastic about learning, occasionally confused but always willing to engage.

Pronunciation: Natural speech patterns with occasional uncertainty or excitement.

Personality Affect: Genuine curiosity and eagerness to learn, speaking authentically as someone discovering new concepts."""

TTS_PRESENTATION_INSTRUCTIONS = """Accent/Affect: Professional, clear, and engaging, like an experienced educator presenting complex topics.

Tone: Confident, articulate, and well-paced, making content accessible and interesting.

Pacing: Moderate and deliberate, with natural pauses for emphasis and comprehension.

Emotion: Enthusiastic about the subject matter, conveying genuine interest and expertise.

Pronunciation: Clearly articulate technical terms and concepts with appropriate emphasis.

Personality Affect: Knowledgeable and approachable, speaking with authority while remaining engaging and easy to follow."""

TTS_DEFAULT_INSTRUCTIONS = """Accent/Affect: Clear, natural, and conversational.

Tone: Friendly and engaging, maintaining listener interest.

Pacing: Natural conversational rhythm with appropriate pauses.

Emotion: Warm and approachable, conveying genuine interest in the topic.

Pronunciation: Clear articulation with natural emphasis.

Personality Affect: Conversational and relatable, speaking in an authentic and engaging manner."""


def get_tts_instructions(role: str, mode: str) -> str:
    """Get TTS instructions based on role and mode for better audio quality."""
    if mode == "presentation":
        return TTS_PRESENTATION_INSTRUCTIONS
    elif role == "teacher":
        return TTS_TEACHER_INSTRUCTIONS
    elif role == "student":
        return TTS_STUDENT_INSTRUCTIONS
    else:
        return TTS_DEFAULT_INSTRUCTIONS
