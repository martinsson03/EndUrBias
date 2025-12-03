import os
import json
import pymupdf
from dotenv import load_dotenv
from ollama import chat
from ollama import ChatResponse

# our server takes a base64 PDF → this code turns it into words → LLM marks which word IDs are sensitive 
# → PyMuPDF draws black boxes over those IDs + all images → you send back the new PDF as base64.

# To run, start the server, then -> python test.py

load_dotenv()  # keep if you use .env for other config

def extract_words_with_positions(pdf_bytes: bytes):
    # Return list of pages with word positions and IDs, x y cords
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    pages = []

    for page_index, page in enumerate(doc):
        word_infos = []
        for idx, (x0, y0, x1, y1, text, *_rest) in enumerate(page.get_text("words")):
            word_infos.append(
                {
                    "id": f"p{page_index}w{idx}",
                    "text": text,
                    "x0": x0,
                    "y0": y0,
                    "x1": x1,
                    "y1": y1,
                }
            )
        pages.append({"page": page_index, "words": word_infos})

    return pages


SYSTEM_PROMPT = """
You are a STRICT JSON generator. 
You MUST output ONLY a JSON object with EXACTLY this structure:

{ "redact_ids": ["p0w1", "p0w5", "p1w3", ...] }

### INPUT FORMAT
You receive:
{ "pages": [
    { "page": 0, "words": [ {"id": "p0w0", "text": "John"}, {"id": "p0w1", "text": "Doe"}, ... ] },
    { "page": 1, "words": [ ... ] }
]}

Each item contains:
- id: unique token ID ("p0w42")
- text: the visible token

## YOUR TASK
Return ALL token IDs that contain PERSONAL INFORMATION.

Redact a token if the token text is part of:
- a name (first name, last name, partial name)
- phone number (+46, 07*, digits, formatted numbers)
- email (tokens containing @ or domain pieces)
- street name or street number
- postal code (e.g. 421 73, 12345)
- address-related words (e.g. "Gatan", "Vägen", "Street", "Göteborg" *only* if part of an address)
- personal URLs (github.com, linkedin.com, portfolios)
- usernames or handles (@something)
- birthday or birth year (1998, 2000-xx-xx)
- reference names
- reference phone or email

If no personal info is found:
{ "redact_ids": [] }
"""


def ask_llm_for_redactions(pages):
    """
    pages: list of page dicts from extract_words_with_positions
    returns: list of word IDs to redact across ALL pages
    """

    simple_pages = []
    for page in pages:
        simple_pages.append({
            "page": page["page"],
            "words": [
                {"id": w["id"], "text": w["text"]}
                for w in page["words"]
            ],
        })

    # Send ALL pages in one single message
    user_content = json.dumps({"pages": simple_pages}, ensure_ascii=False)

    response: ChatResponse = chat(
    model="qwen2.5",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ],
    options={
        "temperature": 0,
        "num_predict":  -1,
    },
    format="json",
    
    )


    raw = response.message.content or ""
    print("LLM raw response:", repr(raw))

    # Try to parse JSON
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                data = json.loads(raw[start : end + 1])
            except json.JSONDecodeError:
                print("Failed to parse JSON. Skipping.")
                return []
        else:
            print("No JSON object found in LLM output.")
            return []

    # Extract list of IDs
    redact_ids = data.get("redact_ids", [])
    if not isinstance(redact_ids, list):
        print("redact_ids is not a list.")
        return []

    return [str(rid) for rid in redact_ids]



def anonymize_pdf_with_llm(pdf_bytes: bytes) -> bytes:
    """
    Main entry point used by server.py
    Takes raw PDF bytes, returns anonymized PDF bytes.
    """
    print(">> anonymize_pdf_with_llm: extracting words")
    # extract all words/positions from PDF
    pages = extract_words_with_positions(pdf_bytes)
    print(f">> anonymize_pdf_with_llm: extracted {len(pages)} pages")

    print(">> anonymize_pdf_with_llm: asking LLM for redactions")
    # ask LLM which word IDs to redact
    redact_ids = set(ask_llm_for_redactions(pages))
    print(f">> anonymize_pdf_with_llm: LLM returned {len(redact_ids)} ids")

    # re-open the PDF and apply redactions
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    print(">> anonymize_pdf_with_llm: applying redactions")
    for page_info in pages:
        page_index = page_info["page"]
        page = doc[page_index]
        
        # Redact text tokens selected by LLM
        for w in page_info["words"]:
            if w["id"] in redact_ids:
                rect = pymupdf.Rect(w["x0"], w["y0"], w["x1"], w["y1"])
                page.add_redact_annot(rect, fill=(0, 0, 0))

        # Redact ALL images on this page
        for img in page.get_images(full=True):
            xref = img[0]
            for rect in page.get_image_rects(xref):
                page.add_redact_annot(rect, fill=(0, 0, 0))
        print(">> anonymize_pdf_with_llm: writing final PDF")

        page.apply_redactions()

    return doc.write()
