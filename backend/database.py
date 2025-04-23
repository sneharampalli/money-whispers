from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Define your models here (Post, Users, Session)
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import DateTime, String, Integer, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Post(db.Model):
    __tablename__ = 'post'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Post "{self.message[:20]}...">'

class Users(db.Model):
    __tablename__ = 'users'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=True)
    created_at = db.Column(DateTime, default=func.now())
    updated_at = db.Column(DateTime, onupdate=func.now())

    # Fully qualify the path to the Session model
    sessions = relationship("database.Session", back_populates="user")

class Session(db.Model):
    __tablename__ = 'sessions'
    __table_args__ = {'extend_existing': True}

    session_id = db.Column(String(80), primary_key=True)
    user_uuid = db.Column(UUID(as_uuid=True), ForeignKey('users.uuid'), nullable=False)
    data = db.Column(JSON)
    expiry = db.Column(DateTime(timezone=True), nullable=False)

    # Fully qualify the path to the Users model
    user = relationship("database.Users", back_populates="sessions")