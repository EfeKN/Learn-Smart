from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, func
from sqlalchemy.orm import relationship

from database.connection import db_connection

Base = db_connection.Base

class Chat(Base):
    """
    Represents a chat in the system.
    """

    __tablename__ = 'chats'
    chat_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.course_id'))
    history_url = Column(String(255))
    started_at = Column(DateTime(timezone=True), server_default=func.now())

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
            "title": self.title,
            "course_id": self.course_id,
            "history_url": self.history_url,
            "started_at": self.started_at
        }