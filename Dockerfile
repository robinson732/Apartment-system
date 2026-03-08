# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install Node.js for building the frontend
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set the working directory in the container
WORKDIR /app

# Copy the backend requirements and install Python dependencies
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the frontend and build it
COPY frontend/ frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Go back to root
WORKDIR /app

# Copy the backend code
COPY backend/ backend/

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python", "backend/app.py"]