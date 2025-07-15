from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import DateTime, String, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Thread(db.Model):
    __tablename__ = 'threads'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, onupdate=func.now())
    whispers = relationship("Whisper", back_populates="thread", cascade="all, delete-orphan")

class Whisper(db.Model):
    __tablename__ = 'whispers'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text(), nullable=False)
    thread_id = db.Column(UUID(as_uuid=True), ForeignKey('threads.uuid'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), ForeignKey('users.uuid'), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, onupdate=func.now())
    # Relationships
    comments = relationship("Comment", back_populates="whisper", cascade="all, delete-orphan")
    thread = relationship("Thread", back_populates="whispers")
    user = relationship("User", back_populates="whispers")
    likes = relationship("WhisperLike", back_populates="whisper", cascade="all, delete-orphan")

class Comment(db.Model):
    __tablename__ = 'comments'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message = db.Column(db.Text(), nullable=False)
    whisper_id = db.Column(UUID(as_uuid=True), ForeignKey('whispers.uuid'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), ForeignKey('users.uuid'), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, onupdate=func.now())
    # Relationships
    whisper = relationship("Whisper", back_populates="comments")
    user = relationship("User", back_populates="comment")

class WhisperLike(db.Model):
    __tablename__ = 'whisperlikes'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), ForeignKey('users.uuid'), nullable=False)
    whisper_id = db.Column(UUID(as_uuid=True), ForeignKey('whispers.uuid'), nullable=False)
    # Relationships
    user = relationship("User", back_populates="likes")
    whisper = relationship("Whisper", back_populates="likes")


class User(db.Model):
    __tablename__ = 'users'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, onupdate=func.now())

    # Relationships
    whispers = relationship("Whisper", back_populates="user")
    comment = relationship("Comment", back_populates="user")
    likes = relationship("WhisperLike", back_populates="user")

    # Fully qualify the path to the Session model
    sessions = relationship("database.Session", back_populates="user")

class Session(db.Model):
    __tablename__ = 'sessions'
    __table_args__ = {'extend_existing': True}

    session_id = db.Column(String(80), primary_key=True)
    user_uuid = db.Column(UUID(as_uuid=True), ForeignKey('users.uuid'), nullable=False)
    data = db.Column(JSON)
    expiry = db.Column(DateTime(timezone=True), nullable=False)

    # Fully qualify the path to the User model
    user = relationship("User", back_populates="sessions")