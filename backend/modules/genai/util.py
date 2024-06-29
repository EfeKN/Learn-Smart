def generate_response(model, prompt="explain your capabilities"):
    """
    Generates a response using the specified model and prompt.

    Args:
        model: The model used to generate the response.
        prompt (str): The prompt to use for generating the response. Defaults to "explain your capabilities".

    Yields:
        str: Each chunk of the generated response.

    """
    # Generate the response
    response = model.generate_content(prompt, stream=True)

    # Yield each chunk of the response
    for chunk in response:
        print(chunk.text)  # print the chunk

        yield chunk.text