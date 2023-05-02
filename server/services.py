from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask import Flask 
import os
from dotenv import load_dotenv
import requests
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_`%(constraint_name)s`",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
    })
db = SQLAlchemy(metadata=metadata)

app = Flask(__name__)

load_dotenv()
app.secret_key = os.environ.get("secretkey")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
db.init_app(app)
migrate = Migrate(app, db)
bcrypted = Bcrypt(app)
os=os
requests=requests
