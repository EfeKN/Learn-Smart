import platform
import subprocess
import pymupdf
import os
from PIL import Image

from tools import generate_hash, splitext
from middleware import FILES_DIR

def slide_generator(path: str):
    """Generator to yield slides one by one.

    Args:
        path (str): The path to the presentation file.

    Yields:
        PIL.Image.Image: The image of each slide.
    """

    def convert_pptx_to_pdf(input_path, output_path):
        system = platform.system()
        if system == "Windows":
            import comtypes.client
            powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
            powerpoint.Visible = 1
            deck = powerpoint.Presentations.Open(input_path)
            deck.SaveAs(output_path, 32)
            deck.Close()
            powerpoint.Quit()
        elif system == "Linux" or system == "Darwin":
            subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", os.path.dirname(input_path), input_path])
        else:
            raise Exception(f"Unsupported operating system: {system}")

    name, extension = splitext(path)
    if extension == "pptx":
        convert_pptx_to_pdf(path, f"{name}.pdf")
        path = f"{name}.pdf"

    doc = pymupdf.open(path)
    base_dirname = os.path.dirname(path)

    for page in doc:
        pix = page.get_pixmap()
        unique_filename = f"{generate_hash(name, strategy="uuid")}.png"
        img_path = os.path.join(base_dirname, unique_filename)
        pix.save(img_path, "png")
        with Image.open(img_path) as img:
            yield img_path, img

    doc.close()


def generate_chat_fnames(user_id: int, course_id: int, chat_id: int):
    fname_prefix = f"user_{user_id}_course_{course_id}_chat_{chat_id}"
    fname = generate_hash(fname_prefix)

    # return chat history file name, metadata file name
    return f"{fname}.txt", f"{fname}_metadata.json"


def get_generator_path(slides_path: str):
    return splitext(slides_path)[0] + "_generator.txt"


def get_chat_metadata_path(history_path: str):
    return splitext(history_path)[0] + "_metadata.json"
 

def get_chat_folder_path(chat_id: int):
    return os.path.join(FILES_DIR, f"chat_{chat_id}") # construct the storage directory
