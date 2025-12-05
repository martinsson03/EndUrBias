"""Turn short CV PDFs into structured Markdown."""
from __future__ import annotations
import json
import os
from typing import Sequence
from dotenv import load_dotenv
from openai import OpenAI
import pdf_extract

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise RuntimeError("OPENAI_API_KEY is not set in .env")

client = OpenAI(api_key=openai_key)

DEFAULT_SECTIONS: Sequence[str] = (
    "Personal information",
    "Experience",
    "Education",
    "Skills",
    "Other",
)

MAX_SECTIONS = 8

SECTIONED_MD_SYSTEM_PROMPT = """You are a detail-oriented CV parser.
You receive OCR-style text extracted from a PDF CV (Swedish or English), together
with a list of generic CV section names and a maximum number of sections.

Your tasks:

1. Decide a small, ordered list of logical sections for this CV.
   - Reuse section headings that clearly appear in the text when possible.
   - When the CV does not have clear headings, fall back to generic CV sections suggested in 'default_sections'.
   - Use at most 'max_sections' sections in total.

2. Output ONLY Markdown:
   - For each section, start with a level-three heading: `### Section name`
   - For each paragraf in a section, make a clear distinction between what text belongs togheter
   - Keep date intervalls above the corresponding text
   - Do NOT paraphrase, summarize, or otherwise change the wording of the lines.
   - Do NOT repeat the same line in multiple sections.
   - Prefer bullet lists for education, and skills.

Important rules:
- Never invent facts that are not present in the original text.
- Preserve the original language and spelling of the lines.
"""


def extract_text_to_markdown(pdf_input: bytes | str) -> str:
    raw_text = pdf_extract.extract_text(pdf_input)
    raw_text = _clean_raw_text(raw_text)
    return _format_markdown_with_llm(raw_text)


def _clean_raw_text(text: str) -> str:
    cleaned_lines: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped in {"•", "-", "·", ".", "–", "—"}:
            continue
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines)


def _format_markdown_with_llm(text: str) -> str:
    payload = {
        "text": text,
        "default_sections": list(DEFAULT_SECTIONS),
        "max_sections": MAX_SECTIONS,
    }

    completion = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": SECTIONED_MD_SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
        ],
    )

    content = completion.choices[0].message.content or ""
    return content.strip()
