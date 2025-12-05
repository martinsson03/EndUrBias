import os
import json
import pymupdf
from dotenv import load_dotenv
from openai import OpenAI

# our server takes a base64 PDF → this code turns it into words → GPT marks which word IDs are sensitive 
# → PyMuPDF draws black boxes over those IDs + all images → you send back the new PDF as base64.

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise RuntimeError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=openai_key)

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


SYSTEM_PROMPT = """
You are an expert CV anonymizer. The CV text is usually in Swedish.
You receive ALL words of a CV as JSON, one page at a time.

Your task: return ONLY the IDs of words that clearly contain personal identifiers.

REDACT (only if clearly personal to the candidate):
- the candidate's full name or initials that identify the person
- phone numbers (e.g. 070-123 45 67, +46 70 123 45 67)
- email addresses
- picture of the candidate
- birthdates or explicit age (e.g. "1998-05-17", "25 years old")
- personal URLs that belong to the candidate (LinkedIn, GitHub, portfolio, personal website)
- social media usernames / handles that belong to the candidate
- home street adresses and postal codes that belong to the candidate
- Refrences

DO NOT redact:
- job titles, roles
- names of companies, organizations, associations, universities or schools
- names of cities, regions or countries
- degree names, study programs, courses, education information
- volunteer work and the organizations it is connected to
- descriptions of responsibilities, tasks, achievements, projects
- skills 
- technologies, programming languages, platforms
- dates, date ranges, seasons, or years related to work or education
- bullet points, paragraphs and general CV content that are not direct personal identifiers

If you are unsure whether something is personal information, DO NOT redact it.

On a typical CV page, personal identifiers are a very small fraction of the words (often less than 5% of all words on the page). 
If you find yourself wanting to redact a large portion of the page, you have misunderstood the task: in that case, return an empty list.

Very important:
1) Output ONLY a single JSON object.
2) No explanations, no markdown, no code fences.
3) Use exactly this structure:
   { "redact_ids": ["p0w0", "p0w5", ...] }
4) If there is no personal information on the page, return:
   { "redact_ids": [] }
"""




def ask_llm_for_redactions(pages):
    """
    pages: output from extract_words_with_positions
    returns: list of word IDs to redact across ALL pages
    """
    all_redact_ids = []

    for page in pages:
        simple_page = {
            "page": page["page"],
            "words": [
                {"id": w["id"], "text": w["text"]}
                for w in page["words"]
            ],
        }

        user_content = json.dumps(simple_page, ensure_ascii=False)

        completion = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
        )

        raw = completion.choices[0].message.content or ""
        print(f"GPT raw response for page {page['page']}:", repr(raw))

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
                    print(f"Failed to parse JSON for page {page['page']}. Skipping.")
                    continue
            else:
                print(f"No JSON object found in LLM output for page {page['page']}. Skipping.")
                continue

        redact_ids = data.get("redact_ids", [])
        if isinstance(redact_ids, list):
            all_redact_ids.extend(str(rid) for rid in redact_ids)
        else:
            print(f"redact_ids is not a list on page {page['page']}. Skipping.")

    return all_redact_ids


def anonymize_pdf_with_llm(pdf_bytes: bytes) -> bytes:
    """
    Main entry point used by server.py
    Takes raw PDF bytes, returns anonymized PDF bytes.
    """
    # extract all words/positions from PDF
    pages = extract_words_with_positions(pdf_bytes)

    # ask LLM which word IDs to redact (across all pages)
    redact_ids = set(ask_llm_for_redactions(pages))

    # re-open the PDF and apply redactions
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
            xref = img[0]
            for rect in page.get_image_rects(xref):
                page.add_redact_annot(rect, fill=(0, 0, 0))

        page.apply_redactions()

    return doc.write()
