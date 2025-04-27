import bcrypt

from flask import jsonify, request, session, g
from flask_cors import cross_origin
from database import Comment, Post, Thread, User, db
from functools import wraps

def register_routes(app):

    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'uuid' not in session:
                return jsonify({"error": "Authentication required"}), 401
            g.current_user = db.session.query(User).filter_by(uuid=session['uuid']).first()

            if not g.current_user:
                session.pop('uuid', None)
                session.pop('username', None)
                return jsonify({"error": "Invalid session"}), 401
            return f(*args, **kwargs)
        return decorated_function
    
    @app.route('/api/posts')
    @cross_origin(supports_credentials=True)
    @login_required
    def list_posts():
        posts = Post.query.all()
        posts_list = [{'message': post.message} for post in posts]
        return jsonify(posts_list)
    
    @app.route('/api/users')
    @login_required
    @cross_origin(supports_credentials=True)
    def list_users():
        users = User.query.all()
        users_list = [{'username': user.username} for user in users]
        return jsonify(users_list)
    
    @app.route('/api/create-thread')
    @cross_origin(supports_credentials=True)
    @login_required
    def create_thread():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'title' not in data or 'description' not in data:
            return jsonify({'error': 'Missing one or more required fields (title, description)'}), 400
        
        title = data['title']
        thread = db.session.query(Thread).filter_by(title=title).one_or_none()
        if thread:
            return jsonify({'error': f'Thread already exists with name {title}'}), 403
        try:
            description = data['description']
            new_thread = Thread(title=title, description=description)
            db.session.add(new_thread)
            db.session.commit()
            return jsonify({'data': new_thread, 'message': 'Thread created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create post: {str(e)}'}), 500

    @app.route('/api/create-post', methods=['POST'])
    @cross_origin(supports_credentials=True)
    @login_required
    def create_post():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'message' not in data:
            return jsonify({'error': 'Missing one or more required fields (message)'}), 400

        content = data.get('message')

        try:
            new_post = Post(message=content)
            db.session.add(new_post)
            db.session.commit()
            return jsonify({'data': new_post, 'message': 'Post created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create post: {str(e)}'}), 500
        
    @app.route('/api/create-comment', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def create_comment():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'message' not in data or 'post_id' not in data or 'user_id' not in data:
            return jsonify({'error': 'Missing one or more required fields (message, post_id, user_id)'}), 400
        
        try:
            new_comment = Comment(
                message=data['message'],
                post_id=data['post_id'],
                user_id=data['user_id']
            )
            db.session.add(new_comment)
            db.session.commit()
            return jsonify({'data': new_comment, 'message': 'Comment created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create comment: {str(e)}'}), 500

    @app.route('/api/create-user', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def create_user():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Missing one or more required fields (message)'}), 400

        users_by_username = db.session.query(User).filter_by(username=data['username']).all()
        if users_by_username:
            return jsonify({'error': 'Users with username already exists'}), 409
        if 'email' in data:
            users_by_email = db.session.query(User).filter_by(email=data['email']).all()
            if users_by_email:
                return jsonify({'error': 'Users with email already exists'}), 409

        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            new_user = User(
                username=data['username'],
                password_hash=password_hash,
            )
            if 'email' in data:
                new_user.email = data['email']
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'data': new_user, 'message': 'Users created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create user: {str(e)}'}), 500

    @app.route('/api/login', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def login():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Missing one or more required fields (message)'}), 400

        user = db.session.query(User).filter_by(username=data['username']).one_or_none()
        if not user:
            return jsonify({'error': 'User does not exist'}), 404

        password_check = bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8'))
        if not password_check:
            return jsonify({'error': 'Incorrect password'}), 401

        try: 
            session['uuid'] = str(user.uuid)  # Store the user UUID in the session as a string
            session['username'] = user.username
            return jsonify({'username': user.username}, 200)
        except Exception as e:
            return jsonify({'error': 'Login successful, but error setting session'}), 500
        

    @app.route('/api/logout', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def logout():
        session.pop('uuid', None)  # Remove user UUID from the session
        session.pop('username', None) # Remove other session data if needed
        return jsonify({"message": "Logout successful"}), 200