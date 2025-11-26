FROM ghcr.io/astral-sh/uv:debian-slim

RUN apt-get update && apt-get install -y build-essential python3-dev curl

ADD . /backend
WORKDIR /backend
RUN uv sync --locked

CMD ["uv", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
