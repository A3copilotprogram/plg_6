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
