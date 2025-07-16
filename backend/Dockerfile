# Use an official Python runtime as a parent image.
# We choose a slim version to keep the image size smaller.
# 'python:3.9-slim-buster' is a good choice for Python 3.9 on Debian Buster.
# Adjust the Python version (e.g., 3.10-slim-buster) to match your requirements.
FROM python:3.9-slim-buster

# Set the working directory in the container.
# All subsequent commands will run from this directory.
WORKDIR /app

# Copy the requirements.txt file into the container at /app.
# This step is done separately to leverage Docker's layer caching.
# If only requirements.txt changes, this layer and subsequent layers are rebuilt.
# If only application code changes, this layer and previous layers are cached.
COPY requirements.txt .

# Install any needed packages specified in requirements.txt.
# We use --no-cache-dir to prevent pip from storing cached wheels,
# which helps keep the image size down.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend application code into the container at /app.
# The '.' at the end means copy everything from the current context directory
# (which should be your 'backend/' directory when building).
COPY . .

# Expose the port that your Flask/Gunicorn application will listen on.
# Common ports for web apps are 5000 (Flask default) or 8000 (Gunicorn default).
# Adjust this if your application uses a different port.
EXPOSE 8000

# Define the command to run your application when the container starts.
# Assuming you're using Gunicorn to serve your Flask app.
# Replace 'your_app_module:app' with the actual entry point of your Flask app.
# For example, if your Flask app instance is named 'app' in 'main.py', it would be 'main:app'.
# If your app is in 'app.py' and the Flask instance is 'create_app()', you might need a different command.
# This example assumes a typical Flask app served by Gunicorn.
# The --bind 0.0.0.0:8000 makes the app accessible from outside the container.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
