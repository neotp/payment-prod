# Use an appropriate base image
FROM python:3.8

# Set working directory inside the container
WORKDIR /app

# Copy your application files into the container (if needed)
COPY . /app

COPY requirements.txt /app/requirements.txt


RUN pip install requests
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7000
EXPOSE 7000

# Start the application
CMD ["uvicorn", "mysap:app", "--host", "0.0.0.0", "--port", "7000"]
