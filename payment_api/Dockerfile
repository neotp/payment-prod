# Use an appropriate base image
FROM python:3.8

# Set working directory inside the container
WORKDIR /app

# Copy application files
COPY . /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Expose port
EXPOSE 7000

# Start the application
CMD ["uvicorn", "mysap:app", "--host", "0.0.0.0", "--port", "7000"]
