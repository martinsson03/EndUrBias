from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from llm_anonymizer import anonymize_pdf_with_llm

app = FastAPI()

class AnonymizeRequest(BaseModel):
    jobId: int
    cvBase64: str

class AnonymizeResponse(BaseModel):
    jobId: int
    cvBase64: str

@app.get("/")
def root():
    return {"status": "API running", "endpoint": "/anonymize"}

class CVTextRequest(BaseModel):
    cvBase64: str
@app.post("/anonymize")
def anonymise(request: CVTextRequest):
    try:
        decoded_bytes = base64.b64decode(request.cvBase64)
        anonymized_bytes = anonymize_pdf_with_llm(decoded_bytes)
        encoded = base64.b64encode(anonymized_bytes).decode("utf-8")
        return AnonymizeResponse(jobId=request.jobId, cvBase64=encoded)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occured: {str(e)}")
