import bcrypt

from flask import jsonify, request, session, g
from flask_cors import cross_origin
from database import Comment, Whisper, Thread, User, db
from functools import wraps

def register_routes(app):

    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'uuid' not in session:
                return jsonify({"error": "Authentication required"}), 401
            
            try:
                g.current_user = db.session.query(User).filter_by(uuid=session['uuid']).first()
                if not g.current_user:
                    # Clear invalid session
                    session.clear()
                    return jsonify({"error": "Invalid session"}), 401
                return f(*args, **kwargs)
            except Exception as e:
                # Clear session on any error
                session.clear()
                return jsonify({"error": "Session error"}), 401
        return decorated_function
    
    @app.route('/api/whispers')
    @cross_origin(supports_credentials=True)
    @login_required
    def list_whispers():
        try:
            whispers = Whisper.query.all()
            whispers_list = [{'uuid': whisper.uuid, 'title': whisper.title, 'message': whisper.message, 'thread_title': whisper.thread.title, 'author': whisper.user.username } for whisper in whispers]
            return jsonify(whispers_list)
        except Exception as e:
            return jsonify({"error": "Failed to fetch whispers"}), 500
    
    @app.route('/api/threads')
    @cross_origin(supports_credentials=True)
    @login_required
    def list_threads():
        threads = Thread.query.all()
        threads_list = [{'thread_id': thread.uuid, 'title': thread.title, 'description': thread.description} for thread in threads]
        return jsonify(threads_list)
    
    @app.route('/api/users')
    @login_required
    @cross_origin(supports_credentials=True)
    def list_users():
        users = User.query.all()
        users_list = [{'username': user.username} for user in users]
        return jsonify(users_list)
    
    @app.route('/api/create-thread', methods=['POST'])
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
            return jsonify({'data': {title: title, description: description}, 'message': 'Thread created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create whisper: {str(e)}'}), 500

    @app.route('/api/create-whisper', methods=['POST'])
    @cross_origin(supports_credentials=True)
    @login_required
    def create_whisper():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if 'message' not in data or 'title' not in data or 'thread_id' not in data:
            return jsonify({'error': 'Missing one or more required fields (message, title, user_id, thread_id)'}), 400
        
        message = data.get('message')
        title = data.get('title')
        thread_id = data.get('thread_id')
        user_id = session.get('uuid')
        print('user_id')
        print(user_id)

        try:
            new_whisper = Whisper(
                message=message,
                title=title,
                thread_id=thread_id,
                user_id=user_id,
            )
            db.session.add(new_whisper)
            db.session.commit()
            return jsonify({'data': {message: message, title: title, thread_id: thread_id, user_id: user_id}, 'message': 'Whisper created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create whisper: {str(e)}'}), 500
        
    @app.route('/api/whispers/<whisper_id>')
    @cross_origin(supports_credentials=True)
    @login_required
    def get_whisper(whisper_id):
        whisper = Whisper.query.filter_by(uuid=whisper_id).first()
        comments = Comment.query.filter_by(whisper_id=whisper_id).all()
        comments_list = [{'message': comment.message, 'created_at': comment.created_at, 'author': comment.user.username} for comment in comments]
        return jsonify({'uuid': whisper.uuid, 'title': whisper.title, 'thread_id': whisper.thread_id, 'author': whisper.user.username, 'message': whisper.message, 'user_id': whisper.user_id, 'comments': comments_list})
        
    @app.route('/api/whispers/<whisper_id>/comments', methods=['POST'])
    @cross_origin(supports_credentials=True)
    @login_required
    def create_comment(whisper_id):
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'message' not in data:
            return jsonify({'error': 'Missing one or more required fields (message, whisper_id, user_id)'}), 400
        
        message = data.get('message')
        user_id = session.get('uuid')
        try:
            new_comment = Comment(
                message=message,
                whisper_id=whisper_id,
                user_id=user_id
            )
            db.session.add(new_comment)
            db.session.commit()
            return jsonify({'data': {message: message, whisper_id: whisper_id, user_id: user_id}, 'message': 'Comment created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create comment: {str(e)}'}), 500

    @app.route('/api/create-user', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def create_user():
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'username' not in data or 'password' not in data or 'email' not in data:
            return jsonify({'error': 'Missing one or more required fields (username, password, email)'}), 400

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
                email=data['email']
            )
            db.session.add(new_user)
            db.session.commit()
            
            # Automatically log in the user after registration
            session['uuid'] = str(new_user.uuid)
            session['username'] = new_user.username
            
            return jsonify({
                'username': new_user.username,
                'message': 'Registration successful'
            }), 201
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
            return jsonify({'username': user.username}), 200
        except Exception as e:
            return jsonify({'error': 'Login successful, but error setting session'}), 500
        

    @app.route('/api/logout', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def logout():
        session.pop('uuid', None)  # Remove user UUID from the session
        session.pop('username', None) # Remove other session data if needed
        return jsonify({"message": "Logout successful"}), 200