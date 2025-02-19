# Use an appropriate base image
FROM python:3.8

# Set working directory inside the container
WORKDIR /app

# Copy application files
COPY . /app

# Copy SAP NW RFC SDK
COPY nwrfcsdk /usr/local/sap/nwrfcsdk

# Set environment variables for pyrfc
ENV SAPNWRFC_HOME="/usr/local/sap/nwrfcsdk"
ENV LD_LIBRARY_PATH="/usr/local/sap/nwrfcsdk/lib"
ENV PATH="/usr/local/sap/nwrfcsdk/bin:$PATH"

# Install required system libraries
RUN apt-get update && apt-get install -y \
    libaio1 \
    && rm -rf /var/lib/apt/lists/*

COPY pyrfc-2.0.0-cp38-cp38-win_amd64.whl /app/
RUN pip install --no-cache-dir /app/pyrfc-2.0.0-cp38-cp38-win_amd64.whl
# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Expose port
EXPOSE 7000

# Start the application
CMD ["uvicorn", "mysap:app", "--host", "0.0.0.0", "--port", "7000"]
