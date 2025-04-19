# your_main_app.py (replace with your actual filename)
import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from database import db  # Import the db instance
import routes

# Configure the PostgreSQL database connection
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress a warning

db.init_app(app) # Initialize the db with the Flask app
routes.register_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)