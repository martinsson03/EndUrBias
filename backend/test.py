import os
import base64
import requests
from dotenv import load_dotenv
# build and start
# docker compose up -d --build backend 

# cd backend
# uv run uvicorn server:app --reload --port 8001
# python backend/test.py

# CV path in .env
load_dotenv()

# Build base URL from env
python_port = os.getenv("PYTHON_PORT", "8000")
BASE_URL = f"http://localhost:{python_port}"
URL = BASE_URL.rstrip("/") + "/anonymize"
PDF_FILE_PATH = os.getenv("PDF_FILE_PATH")

print("Using backend URL:", URL)

# Read and encode PDF 
with open(PDF_FILE_PATH, "rb") as f:
    pdf_bytes = f.read()

cv_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

payload = {
    "jobId": 1,
    "cvBase64": cv_base64,
}

# Send POST request
response = requests.post(URL, json=payload, timeout=60)

print("Status:", response.status_code)

try:
    data = response.json()
except Exception:
    print("Response text (not JSON):")
    print(response.text)
    raise

if response.status_code == 200:
    decoded_bytes = base64.b64decode(data["cvBase64"])
    out_path = "decoded_cv.pdf"
    with open(out_path, "wb") as f:
        f.write(decoded_bytes)
    print(f"Decoded CV saved to {out_path}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
