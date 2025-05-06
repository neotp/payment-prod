# Use a Python 3.12.7 base image (Debian-based)
FROM python:3.12
# Set working directory
WORKDIR /app

# Copy application code
COPY . /app

# Copy SAP NW RFC SDK (Linux version only!)
COPY nwrfcsdk /opt/sap/nwrfcsdk

# Set environment variables for pyrfc to find the SDK
ENV LD_LIBRARY_PATH=/opt/sap/nwrfcsdk/lib
ENV SAPNWRFC_HOME=/opt/sap/nwrfcsdk
ENV PATH=/opt/sap/nwrfcsdk/bin:$PATH
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

# Copy requirements
COPY requirements.txt /app/requirements.txt
# COPY pyrfc-3.3.1-cp312-cp312-win_amd64.whl .
COPY pyrfc-3.3.1-cp312-cp312-linux_x86_64.whl .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pyrfc-3.3.1-cp312-cp312-linux_x86_64.whl

# Install pyrfc from PyPI (will build using SAPNWRFC_HOME)
# RUN pip install pyrfc-3.3.1-cp312-cp312-win_amd64.whl

# Expose port for FastAPI
EXPOSE 7000

# Start FastAPI app
CMD ["uvicorn", "mysap:app", "--host", "0.0.0.0", "--port", "7000"]
