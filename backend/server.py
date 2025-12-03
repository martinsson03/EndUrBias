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

class CVTextRequest(BaseModel):
    cvBase64: str
@app.post("/anonymize")
def anonymise(request: CVTextRequest):
    try:
        # TODO ANON
        return CVTextRequest(cvBase64=request.cvBase64)
    except Exception as e:
        return HTTPException(status_code=400, detail=f"An error occured: {str(e)}")
