import base64
import os
import pymupdf 

def extract_text(pdf_input: bytes | str) -> str:
    """Extract text from a PDF given bytes or a base64-encoded string."""
    if isinstance(pdf_input, str):
        pdf_bytes = base64.b64decode(pdf_input)
    else:
        pdf_bytes = pdf_input

    # ensure we always close the document
    with pymupdf.open(stream=pdf_bytes, filetype="pdf") as doc:
        return "\n".join(page.get_text() for page in doc)


def test(folder_path: str) -> None:
    """Quick-and-dirty manual test over all PDFs in folder_path."""
    results: dict[str, str] = {}

    for filename in os.listdir(folder_path):
        if not filename.lower().endswith(".pdf"):
            continue

        full_path = os.path.join(folder_path, filename)
        if not os.path.isfile(full_path):
            continue

        with open(full_path, "rb") as f:
            pdf_bytes = f.read()

        results[filename] = extract_text(pdf_bytes)

    for filename, text in results.items():
        print(f"File {filename}:\n{text}\n{'-' * 80}")