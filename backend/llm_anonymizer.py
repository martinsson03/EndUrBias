import os
import json
import pymupdf
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")
if not groq_key:
    raise RuntimeError("GROQ_API_KEY is not set in .env")

client = Groq(api_key=groq_key)

def extract_words_with_positions(pdf_bytes: bytes):
    """Return list of pages with word positions and IDs."""
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


def ask_llm_for_redactions(pages):
    """
    pages: output from extract_words_with_positions
    returns: list of word IDs to redact
    """
    # Strip coords for the LLM call
    simple_pages = [
        {
            "page": p["page"],
            "words": [{"id": w["id"], "text": w["text"]} for w in p["words"]],
        }
        for p in pages
    ]

    system_prompt = (
        "You are an expert CV anonymizer. "
        "You receive all words in a CV as JSON. "
        "Identify ONLY personal information:"
        "- picuture"
        "- candidate's name"
        "- phone numbers"
        "- emails"
        "- physical addresses"
        "- personal URLs (LinkedIn, GitHub, portfolio, etc.)"
        "- usernames / handles"
        "- social media identifiers"
        "- birthdates or other unique identifiers"
        "DO NOT censor:"
        "- skills"
        "- job titles"
        "- education info"
        "- time spent at a company/school etc"
        "- company names"
        "- technologies"
        "- generic descriptions"
        "Very important rules:"
        "1) Output ONLY a single JSON object."
        "2) No explanations, no markdown, no code fences."
        "3) The JSON must have exactly this structure:"
        "{ \"redact_ids\": [\"p0w0\", \"p0w5\", ...] }"
    )

    user_content = json.dumps(simple_pages)

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0,
    )

    raw = completion.choices[0].message.content or ""
    print("Groq raw response:", repr(raw))

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
                print("Failed to parse JSON even after trimming. Returning no redactions.")
                return []
        else:
            print("No JSON object found in LLM output. Returning no redactions.")
            return []

    redact_ids = data.get("redact_ids", [])
    if not isinstance(redact_ids, list):
        print("redact_ids is not a list. Returning no redactions.")
        return []

    return [str(rid) for rid in redact_ids]


def anonymize_pdf_with_llm(pdf_bytes: bytes) -> bytes:
    """
    Main entry point used by server.py
    Takes raw PDF bytes, returns anonymized PDF bytes.
    """
    # Extract all words/positions from PDF
    pages = extract_words_with_positions(pdf_bytes)

    # pages = pages #[:1] first page

    # Ask LLM which word IDs to redact
    redact_ids = set(ask_llm_for_redactions(pages))

    # Re-open the PDF and apply redactions
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

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
            xref = img[0]  # image reference
            for rect in page.get_image_rects(xref):
                page.add_redact_annot(rect, fill=(0, 0, 0))

        page.apply_redactions()

    return doc.write()

