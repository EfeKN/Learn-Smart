from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from modules.genai.util import generate_response
from modules.genai import model

router = APIRouter(prefix="/genai", tags=["GenAI"])

@router.post("/generate_response")
async def generate(request: Request):
    """
    Generate a (streaming) response based on the given prompt.

    Args:
        request (Request): The HTTP request object.

    Returns:
        StreamingResponse: A streaming response with the generated response.
    """

    # Get the prompt from the request data
    data = await request.json()
    prompt = data.get("prompt")

    # Return a streaming response with the generated response chunks based on the prompt
    return StreamingResponse(generate_response(model, prompt), media_type="text/event-stream")