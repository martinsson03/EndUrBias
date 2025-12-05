from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from extract_text import extract_text_to_markdown
from pii_redactor import redact_text
from llm_anonymizer import anonymize_pdf_with_llm

app = FastAPI()

class CVTextRequest(BaseModel):
    cvBase64: str
    FirstName: str
    LastName: str

class AnonymizeResponse(BaseModel):
    cvBase64: str
    markdown: str  # Optional: include the markdown in response if needed

@app.get("/")
def root():
    return {"status": "API running", "endpoint": "/anonymize"}

@app.post("/anonymize")
def anonymize(request: CVTextRequest):
    try:
        # Step 1: Decode the base64 PDF
        decoded_bytes = base64.b64decode(request.cvBase64)
        
        # Step 2: Emmanuel's Pipeline - Extract text to Markdown
        markdown = extract_text_to_markdown(decoded_bytes)
        
        # Step 3: Albin's Pipeline - Redact PII from markdown
        redacted_markdown, pii_matches = redact_text(
            markdown, 
            use_presidio=False,  # Set to True if you want Presidio
            applicant_name= (request.FirstName + " " + request.LastName),
            use_spacy_names=False  # Set to True if you want spaCy NER
        )
        
        # Step 4: Use LLM anonymizer to redact the original PDF
        anonymized_pdf_bytes = anonymize_pdf_with_llm(decoded_bytes)
        
        # Step 5: Encode the anonymized PDF back to base64
        encoded = base64.b64encode(anonymized_pdf_bytes).decode("utf-8")
        
        return AnonymizeResponse(
            cvBase64=encoded,
            markdown=redacted_markdown  # Send back redacted markdown
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")