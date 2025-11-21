from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from pdf_extract import extract_text

# Create the FastAPI instance
app = FastAPI()

class AnonymizeRequest(BaseModel):
    jobId: int
    firstName: str
    lastName: str
    gender: str
    email: str
    phone: str
    cvBase64: str
    

class AnonymizeResponse(BaseModel):
    jobId: int
    cvBase64: str

@app.get("/")
def read_root():
    return HTTPException(status_code=400, detail="Faulty endpoint")

@app.post("/anonymize")
def anonymise(request: AnonymizeRequest):
    try:
        decoded_bytes = base64.b64decode(request.cvBase64)
        text = extract_text(decoded_bytes)

        return AnonymizeResponse(jobId=request.jobId, cvBase64=base64.encode(text))
    except Exception as e:
        return HTTPException(status_code=400, detail=f"An error occured: {str(e)}")
