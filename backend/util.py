from dotenv import load_dotenv
import google.generativeai as genai

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

async def generate_response(prompt="hello how can you assist me"):

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150,
        stream=True
    )

    async for chunk in response:
        text = chunk['choices'][0].get('text', '')
        yield text
