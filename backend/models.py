from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, default="Unknown Company")
    role = Column(String, default="Unknown Role")
    job_description = Column(Text)
    match_score = Column(Integer)
    resume_title = Column(String)
    status = Column(String, default="Saved")
    applied_date = Column(DateTime, nullable=True)
    follow_up_date = Column(DateTime, nullable=True)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class ApplicationPackage(Base):
    __tablename__ = "application_packages"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)
    role = Column(String)

    job_analysis = Column(Text)
    resume_tailor = Column(Text)
    cover_letter = Column(Text)
    recruiter_message = Column(Text)
    application_answers = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, default="")
    email = Column(String, default="", unique=True, index=True)
    hashed_password = Column(String, default="")
    title = Column(String, default="")
    skills = Column(Text, default="")          # comma-separated
    resume_text = Column(Text, default="")
    visa_status = Column(String, default="")
    location = Column(String, default="")
    linkedin_url = Column(String, default="")
    github_url = Column(String, default="")
    years_of_experience = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReminderAlert(Base):
    __tablename__ = "reminder_alerts"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer)
    company = Column(String)
    role = Column(String)
    reminder_type = Column(String)   # "follow_up", "interview", "offer_deadline"
    reminder_date = Column(DateTime)
    message = Column(Text, default="")
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
