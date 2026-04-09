# FROM python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8001

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]


FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install minimal system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY requirements.txt .

# Install CPU-only torch before sentence-transformers pulls GPU libs
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install rest of dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]