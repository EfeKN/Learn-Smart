import platform
import subprocess
import pymupdf
import os
from PIL import Image

from tools import generate_hash

def slide_generator(path: str):
    """Generator to yield slides one by one.

    Args:
        path (str): The path to the presentation file.

    Yields:
        PIL.Image.Image: The image of each slide.
    """

    # the uploaded file is first converted to pdf, then each slide is extracted as an image
    name, extension = path.rsplit(".", 1)

    if extension == "pptx": # we are going to convert the pptx file to pdf

        if platform.system() == "Windows": # for Windows
            import comtypes.client

            def PPTtoPDF(inputFileName, outputFileName, formatType = 32):
                powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
                powerpoint.Visible = 1

                if outputFileName[-3:] != 'pdf':
                    outputFileName = outputFileName + ".pdf"

                deck = powerpoint.Presentations.Open(inputFileName)
                deck.SaveAs(outputFileName, formatType) # formatType = 32 for ppt to pdf
                deck.Close()
                powerpoint.Quit()

            PPTtoPDF(path, f"{name}.pdf")

        elif platform.system() == "Linux": # for Linux (and possibly macOS -- you need libreoffice installed)
            libreoffice_path = "/usr/bin/soffice"

            # create "name".pdf from "name".pptx
            outdir = os.path.dirname(path)
            subprocess.run([libreoffice_path, "--headless", "--convert-to", "pdf", "--outdir", outdir, path])
        else:
            raise Exception("Unsupported platform")

    path = f"{name}.pdf"
    doc = pymupdf.open(path)


    base_filename = os.path.splitext(os.path.basename(path))[0]
    base_dirname = os.path.dirname(path)

    for page in doc:
        pix = page.get_pixmap()
        
        fname = f"{generate_hash(base_filename, strategy="uuid")}.png" # generate a unique name for the temporary image file
        fname = os.path.join(base_dirname, fname)
        pix.save(fname, "png") # save the slide as an image, temporarily
        img = Image.open(fname)

        yield fname, img
