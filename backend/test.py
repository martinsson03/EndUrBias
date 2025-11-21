import base64
import requests

# --- Configuration ---
URL = "http://localhost:8000/anonymize"  # FastAPI URL
PDF_FILE = "/Users/emanuelpeterson/School/CV/Jesper Wärn CV.pdf"  # path to your PDF

# --- Read and encode PDF ---
with open(PDF_FILE, "rb") as f:
    pdf_bytes = f.read()

cv_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

# --- Prepare payload ---
payload = {
    "jobId": 1,
    "cvBase64": cv_base64,
}

# --- Send POST request ---
response = requests.post(URL, json=payload)

print("Status:", response.status_code)
try:
    print("Raw response JSON:", response.json())
except Exception:
    print("Response text:", response.text)

if response.status_code == 200:
    data = response.json()
    decoded_bytes = base64.b64decode(data["cvBase64"])
    
    # Save decoded PDF
    out_path = "decoded_cv.pdf"
    with open(out_path, "wb") as f:
        f.write(decoded_bytes)
    
    print(f"Decoded CV saved to {out_path}")
    #print("First 200 bytes of decoded CV:")
    #print(decoded_bytes[:200])
else:
    print(f"Error: {response.status_code}")
    print(response.text)
