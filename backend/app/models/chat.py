import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, event, text
from sqlmodel import Field, Relationship, SQLModel
from pgvector.sqlalchemy import Vector 


class ChatBase(SQLModel):
  message: str | None = Field(default=None, max_length=8192)  # Increased for longer responses
  is_system: bool
  created_at: datetime = Field(
    sa_column=Column(DateTime(timezone=True), server_default=text("now()"), nullable=False)
  )
  updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
  embedding: Optional[list] = Field(default=None, sa_type=Vector(1536))

# Properties to receive on chat creation
class ChatCreate(SQLModel):  # Don't inherit from ChatBase to avoid conflicts
  message: str = Field(max_length=8192)  # Increased for longer responses
  course_id: uuid.UUID
  is_system: bool

# Properties to receive on chat update
class ChatUpdate(SQLModel):
  message: str | None = Field(default=None, max_length=8192)

class Chat(ChatBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(foreign_key="course.id", ondelete="CASCADE")
    course: "Course" = Relationship(back_populates="chats")  # noqa: F821


# Automatically update the updated_at field before update
@event.listens_for(Chat, "before_update", propagate=True)
def set_updated_at(mapper, connection, target):
    target.updated_at = datetime.utcnow()
