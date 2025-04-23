import os
from dotenv import load_dotenv
from flask import Flask
from flask_session.sqlalchemy import SqlAlchemySessionInterface
from flask_cors import CORS
from datetime import timedelta

from database import db, Session as SessionModel  # Import your Session model
import routes

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'sqlalchemy'
db.init_app(app)
app.config['SESSION_SQLALCHEMY_TABLE'] = SessionModel.__tablename__
app.config['SESSION_SQLALCHEMY_ENGINE'] = f"postgresql://..."
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your_secret_key_here')

# Initialize Flask-Session with your existing SQLAlchemy instance and model
app.session_interface = SqlAlchemySessionInterface(app, db, table=SessionModel.__table__)

routes.register_routes(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)