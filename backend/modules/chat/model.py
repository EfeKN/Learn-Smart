from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, func,  Boolean
from sqlalchemy.orm import relationship

from database.connection import db_connection

Base = db_connection.Base

class Chat(Base):
    """
    Represents a chat in the system.
    """

    __tablename__ = 'chats'
    chat_id = Column(Integer, primary_key=True, index=True)
    chat_title = Column(String(150), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.course_id'), nullable=False)
    history_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    slides_mode = Column(Boolean, default=False)
    slides_fname = Column(String(255), nullable=True) # slides' original file name, e.g. Lecture_1.pptx
    slides_furl = Column(String(255), nullable=True) # slides file URL, e.g. ./.../<ffb1e29cc1...>.pptx

    # quiz relationships, quiz URLs, might be added here

    course = relationship("Course", back_populates="chats") # many-to-one relationship with Course

    def to_dict(self):
        """
        Converts the Chat object to a dictionary.

        Returns:
            dict: A dictionary representation of the Chat object.
        """
        
        return {
            "chat_id": self.chat_id,
            "chat_title": self.chat_title,
            "course_id": self.course_id,
            "history_url": self.history_url,
            "slides_mode": self.slides_mode,
            "slides_fname": self.slides_fname,
            "slides_furl": self.slides_furl,
            "created_at": self.created_at
        }