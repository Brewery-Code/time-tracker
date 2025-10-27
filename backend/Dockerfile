FROM python:3.14-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt update && apt install -y --no-install-recommends curl

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY requirements.txt .
RUN uv pip install -r requirements.txt --system

COPY . .

EXPOSE 8000

CMD ["python", "-m", "src.main"]