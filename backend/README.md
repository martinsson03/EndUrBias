To use this service, UV is needed. Install UV using pip:

´´´
pip install uv
´´´

Or installing directly from Astral (Windows):

´´´
irm https://astral.sh/uv/install.ps1 | powershell
´´´

(Linux)
´´´
curl -fsSL https://astral.sh/uv/install.sh | sh
´´´

To get all dependencies:
´´´
uv sync
´´´


------

To run the server:
´´´
uv run uvicorn server:app
´´´

------
*To install the NLP-module, you can enter the following command into the terminal:*

```uv run python -m spacy download en_core_web_sm```

#### *Please note that for each time you run ```uv sync```, the model needs to be reinstalled.*
------

