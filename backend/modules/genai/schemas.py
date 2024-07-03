from pydantic import BaseModel


class MessageCreationRequest(BaseModel):
    """
    Represents a request to create a new message.

    Attributes:
        chat_id (int): The ID of the chat
        text (str): The text of the message
    """
    chat_id: int
    text: str