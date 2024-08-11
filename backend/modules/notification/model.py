from sqlalchemy import (
    Column,
    Boolean,
    String,
    Integer,
    DateTime,
)
from datetime import datetime
from database.connection import db_connection

Base = db_connection.Base


class Notification(Base):
    """
    Notification model
    """

    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    notification_title = Column(String(255), index=True)
    notification_content = Column(String(255))
    notification_date = Column(DateTime, default=datetime.utcnow)
    notification_is_new = Column(Boolean, default=True)
    notification_sender_id = Column(Integer)
    notification_receiver_id = Column(Integer)

    def to_dict(self):
        return {
            "notification_id": self.notification_id,
            "notification_title": self.notification_title,
            "notification_content": self.notification_content,
            "notification_date": self.notification_date,
            "notification_is_new": self.notification_is_new,
            "notification_sender_id": self.notification_sender_id,
            "notification_receiver_id": self.notification_receiver_id,
        }
