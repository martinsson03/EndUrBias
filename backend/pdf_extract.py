import base64
import pymupdf  # PyMuPDF
import os

def extract_text(pdf_input):
    # If input is base64 string, decode it
    if isinstance(pdf_input, str):
        pdf_bytes = base64.b64decode(pdf_input)
    else:
        # Assume input is already bytes
        pdf_bytes = pdf_input

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc)
    return text

def test():
    results = {}
    folder_path = ""
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            full_path = os.path.join(folder_path, filename)

            with open(full_path, "rb") as f:
                pdf_bytes = f.read()

            text = extract_text(pdf_bytes)
            results[filename] = text

    for file in results.keys():
        print(f"File {file}: {results[file]}")