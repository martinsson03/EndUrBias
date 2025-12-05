from __future__ import annotations

import argparse
import sys
from pathlib import Path
from dotenv import load_dotenv
from extract_text import extract_text_to_markdown

# python test_extract_text.py "/Users/emanuelpeterson/Code/CV/Jesper Wärn CV.pdf"


def main() -> int:
    load_dotenv()

    parser = argparse.ArgumentParser(
        description="Render Markdown output for a CV PDF using extract_text_to_markdown",
    )
    parser.add_argument(
        "pdf_path",
        help="Path to the PDF file to process",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional path to save the Markdown result",
    )

    args = parser.parse_args()

    pdf_path = Path(args.pdf_path).expanduser()
    if not pdf_path.is_file():
        parser.error(f"PDF not found: {pdf_path}")

    pdf_bytes = pdf_path.read_bytes()
    markdown = extract_text_to_markdown(pdf_bytes)

    default_name = f"{pdf_path.stem}.md"
    output_path = args.output or (Path.cwd() / default_name)
    output_path.write_text(markdown, encoding="utf-8")
    print(f"Markdown saved to {output_path}")

    return 0


if __name__ == "__main__": 
    raise SystemExit(main())
