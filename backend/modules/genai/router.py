from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from modules.user.model import User
from controllers import authentication as auth
from modules.genai.util import generate_response
from modules.genai import model

router = APIRouter(prefix="/genai", tags=["GenAI"])

@router.post("/generate_response")
async def generate(request: Request, current_user: User = Depends(auth.get_current_user)):
    """
    Generate a response based on the given prompt.

    Args:
        request (Request): The incoming request object.
        current_user (User): The current authenticated user (used for authentication).

    Returns:
        StreamingResponse: A streaming response with the generated response chunks based on the prompt.
    """
    # Get the prompt from the request data
    data = await request.json()
    prompt = data.get("prompt")

    # Return a streaming response with the generated response chunks based on the prompt
    return StreamingResponse(generate_response(model, prompt), media_type="text/event-stream")