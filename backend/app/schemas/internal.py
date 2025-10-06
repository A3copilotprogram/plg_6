from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.public import DifficultyLevel
import uuid
from enum import Enum
from typing import Optional



class ModeEnum(str, Enum):
    dialogue = "dialogue"
    presentation = "presentation"


class GeneratePodcastRequest(BaseModel):
    """Request body for generating a podcast for a course.
    """
    title: str
    mode: ModeEnum = ModeEnum.dialogue
    topics: str | None = None
    teacher_voice: str | None = None
    student_voice: str | None = None
    narrator_voice: str | None = None
    document_ids: list[uuid.UUID] | None = None


class PaginationParams(BaseModel):
    limit: int = Field(5, gt=0, le=50)
    offset: int = Field(0, ge=0)
    order_by: Literal["created_at", "difficulty_level", "quiz_text"] = "created_at"


class QuizFilterParams(PaginationParams):
    difficulty: DifficultyLevel = DifficultyLevel.EASY
    order_direction: Literal["asc", "desc"] = "desc"
