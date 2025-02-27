# Use an appropriate base image
FROM python:3.8

# Set working directory inside the container
WORKDIR /app

# Copy your application files into the container (if needed)
COPY . /app

# # Copy the nwrfcsdk folder into the container
# COPY nwrfcsdk /app/nwrfcsdk

# # Set environment variables for the SAP NetWeaver RFC SDK
# ENV SAPNWRFC_HOME="/app/nwrfcsdk"
# ENV LD_LIBRARY_PATH="/app/nwrfcsdk/lib"
# ENV PATH="/app/nwrfcsdk/bin:$PATH"

# # Clone the PyRFC repository and install it
# RUN git clone https://github.com/SAP/PyRFC.git && \
#     cd PyRFC && \
#     python -m pip install . && \
#     cd ..

# Install Python dependencies from requirements.txt
COPY requirements.txt /app/requirements.txt
RUN pip install requests
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7000
EXPOSE 7000

# Start the application
CMD ["uvicorn", "mysap:app", "--host", "0.0.0.0", "--port", "7000"]
