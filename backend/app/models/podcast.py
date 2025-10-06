import uuid
from datetime import datetime, timezone

from sqlalchemy import func
from sqlmodel import Field, Relationship, SQLModel, text


class Podcast(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(foreign_key="course.id")
    title: str
    transcript: str
    audio_path: str  # local path or S3 key/URL depending on storage backend
    storage_backend: str = Field(default="local")
    duration_seconds: float | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={
            "server_default": text("CURRENT_TIMESTAMP"),
            "onupdate": func.now(),
        },
    )

    course: "Course" = Relationship(back_populates="podcasts")  # noqa: F821

