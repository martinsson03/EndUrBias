from fastapi import FastAPI, HTTPException, Query, Path, Body
from pydantic import BaseModel
from typing import Optional, List
import base64
from pdf_extract import extract_text

# Create the FastAPI instance
app = FastAPI()

class AnonymizeRequest(BaseModel):
    name: str
    data: str

@app.get("/")
def read_root():
    return HTTPException(status_code=400, detail="API up and running!")

@app.post("/anonym")
def anonymise(request: AnonymizeRequest):
    try:
        decoded_bytes = base64.b64decode(request.data)
        text = extract_text(decoded_bytes)
    except Exception as e:
        return HTTPException(status_code=400, detail=f"An error occured: {str(e)}")
