"""
Centralized Pydantic/response schemas for Course and Document to avoid circular imports.
"""
import uuid
from datetime import datetime
from enum import StrEnum

from sqlmodel import SQLModel


class DocumentPublic(SQLModel):
    id: uuid.UUID
    filename: str
    description: str | None = None
    course_id: uuid.UUID
    updated_at: datetime
    created_at: datetime
    status: str  # Use str for status to avoid Enum import cycles


class CoursePublic(SQLModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime
    documents: list["DocumentPublic"]


class CoursesPublic(SQLModel):
    data: list["CoursePublic"]
    count: int

class DifficultyLevel(StrEnum):
    # Quiz difficulty levels
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"
    ALL = "all"

class QuestionChoice(SQLModel):
    id: str
    text: str

class QuestionPublic(SQLModel):
    id: uuid.UUID
    question_text: str
    choices: list[QuestionChoice]

class QuestionsPublic(SQLModel):
    data: list["QuestionPublic"]
    count: int
