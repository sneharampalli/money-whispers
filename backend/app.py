import os
import uuid 

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

# Configure the PostgreSQL database connection
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress a warning

db = SQLAlchemy(app)

# Define your database models (tables) as Python classes
class Post(db.Model):
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'{self.message}'

# Example route to interact with the database
@app.route('/posts')
def list_posts():
    posts = Post.query.all()
    posts_list = [{'uuid': post.uuid, 'message': post.message} for post in posts]
    return jsonify(posts_list)

@app.route('/create-post', methods=['POST'])
def create_post():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    if 'message' not in data:
        return jsonify({'error': 'Missing required fields (message)'}), 400

    
    content = data.get('message')

    # Check if the user exists

    try:
        new_post = Post(uuid=uuid.uuid4(), message=content) # corrected
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Post created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create post: {str(e)}'}), 500
    finally:
        db.session.close()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)
