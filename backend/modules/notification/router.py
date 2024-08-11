from fastapi import APIRouter, Depends, Form, HTTPException

from middleware import authentication as auth
from database.dbmanager import NotificationDB
from modules.notification.schemas import (
    NotificationCreationRequest,
    NotificationUpdateRequest,
)

router = APIRouter(prefix="/notification", tags=["Notification"])


@router.get("/{notification_id}")
async def get_notification(
    notification_id: int, current_user: dict = Depends(auth.get_current_user)
):
    """
    Get notification details by notification ID.

    Args:
        notification_id (int): The ID of the notification to retrieve.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        dict: A dictionary containing the notification details.
    """

    notification = NotificationDB.fetch(notification_id=notification_id)

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")

    # Check if the user is authorized to view the notification
    # This can happen if the user tries to view a notification they don't own
    if (
        notification["notification_receiver_id"] != current_user["user_id"]
        and notification["notification_sender_id"] != current_user["user_id"]
    ):
        raise HTTPException(status_code=403, detail="Forbidden.")

    return notification


@router.get("/all/{notification_receiver_id}")
async def get_all_notifications(notification_receiver_id: int, current_user: dict = Depends(auth.get_current_user)):
    """
    Get all notifications.

    Args:
        current_user (dict): The current authenticated user.

    Returns:
        list: A list of dictionaries containing the notification details.
    """
    
    if int(notification_receiver_id) != int(current_user["user_id"]):
        raise HTTPException(status_code=403, detail="Forbidden to view notifications of other users.")  

    notifications = NotificationDB.fetch(notification_receiver_id=notification_receiver_id, all=True)
    return notifications
    


@router.post("/create")
async def create_notification(
    notification_title: str = Form(...),
    notification_content: str = Form(...),
    notification_is_new: bool = Form(...),
    notification_receiver_id: int = Form(...),
    current_user: dict = Depends(auth.get_current_user),
):
    """
    Create a new notification.

    Args:
        notification (NotificationCreationRequest): The notification details.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        The created notification.

    Raises:
        HTTPException: If there is an error creating the notification.
    """

    notification_receiver_id = int(notification_receiver_id)
    notification_sender_id = int(current_user["user_id"])

    _ = NotificationCreationRequest(
        notification_title=notification_title,
        notification_content=notification_content,
        notification_is_new=notification_is_new,
        notification_sender_id=notification_sender_id,
        notification_receiver_id=notification_receiver_id,
    )

    notification = None
    try:

        notification = NotificationDB.create(
            notification_title=notification_title,
            notification_content=notification_content,
            notification_is_new=notification_is_new,
            notification_sender_id=notification_sender_id,
            notification_receiver_id=notification_receiver_id,
        )

        return notification
    except Exception as e:
        if notification:
            NotificationDB.delete(notification_id=notification["notification_id"])

        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int, current_user: dict = Depends(auth.get_current_user)
):
    """
    Delete a notification.

    Args:
        notification_id (int): The ID of the notification to delete.
        current_user (dict, optional): The current user. Defaults to Depends(auth.get_current_user).

    Returns:
        Success message.

    Raises:
        HTTPException: If there is an error deleting the notification.
    """

    notification = NotificationDB.fetch(notification_id=notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")

    if notification["notification_sender_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden. You are not authorized to delete this notification.",
        )

    NotificationDB.delete(notification_id=notification_id)

    return {"message": "Notification deleted successfully."}


@router.put("/{notification_id}")
async def update_notification(
    notification_id: int,
    notification_title: str = Form(None),
    notification_content: str = Form(None),
    notification_is_new: bool = Form(None),
    notification_receiver_id: str = Form(None),
    current_user: dict = Depends(auth.get_current_user),
):
    """
    Update a notification with the given notification_id.

    Parameters:
    - notification_id (int): The ID of the notification to update.
    - notification_title (str): The title of the notification.
    - notification_content (str): The content of the notification.
    - notification_is_new (bool): Whether the notification is new.
    - notification_receiver_id (str): The ID of the receiver of the notification.
    - current_user (dict): The current authenticated user.

    Returns:
    - Updated notification information.

    Raises:
    - HTTPException(404): If the notification is not found.
    - HTTPException(403): If the user is not authorized to update the notification.
    - HTTPException(400): If there is a value error during the update process.

    """

    _ = NotificationUpdateRequest(
        notification_title=notification_title,
        notification_content=notification_content,
        notification_is_new=notification_is_new,
        notification_receiver_id=notification_receiver_id,
    )

    notification = NotificationDB.fetch(notification_id=notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")
    if notification["notification_sender_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    try:
        notification = NotificationDB.update(
            notification_id=notification_id,
            notification_title=notification_title,
            notification_content=notification_content,
            notification_is_new=notification_is_new,
            notification_receiver_id=notification_receiver_id,
        )
        return notification
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
