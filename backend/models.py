from sqlalchemy import Column, Integer, String, Text, DateTime
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