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
def read_root():
    return {"Hello": "World"}
    # return HTTPException(status_code=400, detail="Faulty endpoint")

@app.get("/demo")
def demo():
    return {"message": "This is a demo endpoint"}

@app.post("/anonymize", response_model=AnonymizeResponse)
def anonymise(request: AnonymizeRequest):
    try:
        decoded_bytes = base64.b64decode(request.cvBase64)
        anonymized_bytes = anonymize_pdf_with_llm(decoded_bytes)
        encoded = base64.b64encode(anonymized_bytes).decode("utf-8")
        return AnonymizeResponse(jobId=request.jobId, cvBase64=encoded)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occured: {str(e)}")
