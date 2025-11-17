from fastapi import FastAPI, HTTPException, Query, Path, Body
from pydantic import BaseModel
from typing import Optional, List
    
# Create the FastAPI instance
app = FastAPI()

class AnonymizeRequest(BaseModel):
    name: str
    data: str

@app.get("/")
def read_root():
    return HTTPException(code=400, detail="API up and running!")

@app.post("/anonym")
def anonymise(request: AnonymizeRequest):
    return HTTPException(code=400, detail="wrong")