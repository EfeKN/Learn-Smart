from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

from database.connection import db_connection

Base = db_connection.Base

class Course(Base):
    """
    Represents a course in the system.
    """

    __tablename__ = 'courses'

    course_id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String(255), nullable=False) # e.g. Operating Systems
    course_code = Column(String(16), unique=True) # e.g. CS 342
    description = Column(String(1024), nullable=True)
    syllabus_url = Column(String(255), nullable=True)
    img_url = Column(String(255), nullable=True) # nullable for now (generate an image for the course in the future)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="courses")
    chats = relationship("Chat", back_populates="course")

    def to_dict(self):
        """
        Converts the Course object to a dictionary.

        Returns:
            dict: A dictionary representation of the Course object.
        """
        return {
            "course_id": self.course_id,
            "course_name": self.course_name,
            "description": self.description,
            "course_code": self.course_code,
            "user_id": self.user_id,
            "syllabus_url": self.syllabus_url,
            "img_url": self.img_url
        }