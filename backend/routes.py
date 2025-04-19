from flask import jsonify, request
from database import Post, db

def register_routes(app):
    @app.route('/posts')
    def list_posts():
        posts = Post.query.all()
        posts_list = [{'uuid': str(post.uuid), 'message': post.message} for post in posts]
        return jsonify(posts_list)

    @app.route('/create-post', methods=['POST'])
    def create_post():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'message' not in data:
            return jsonify({'error': 'Missing required fields (message)'}), 400

        content = data.get('message')

        try:
            new_post = Post(message=content)
            db.session.add(new_post)
            db.session.commit()
            return jsonify({'message': 'Post created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create post: {str(e)}'}), 500
        finally:
            db.session.close()

    # Add other routes here within this register_routes function