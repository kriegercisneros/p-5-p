# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import MetaData
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from services import bcrypted, db

# from sqlalchemy.orm import validates
# from sqlalchemy.ext.associationproxy import association_proxy
# from sqlalchemy_serializer import SerializerMixin


# db = SQLAlchemy(metadata=metadata)


class User(db.Model, SerializerMixin):
    __tablename__='users'

    serialize_rules=('-sketches.users_backref', '-images.users_backref',)

    id = db.Column(db.Integer, primary_key=True)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String, unique = True, nullable = False)
    username=db.Column(db.String)

    sketches=db.relationship("Sketch", backref='users_backref')
    images=db.relationship("Image", backref='users_backref')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    #this is the setter function 
    @password_hash.setter
    def password_hash(self, password):
        #note we need the encode and decode in python 3 due to special characters
        password_hash = bcrypted.generate_password_hash(password.encode('utf-8'))
        self._password_hash=password_hash.decode('utf-8')

    #create an auth route using bcrypted
    def authenticate(self, password):
        return bcrypted.check_password_hash(self.password_hash, password.encode('utf-8'))
    
class Image(db.Model, SerializerMixin):
    __tablename__='images'

    serialize_rules=('-users_backref','-instance_backref.images',)

    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    original_filename=db.Column(db.String(100))
    filename=db.Column(db.String(100))
    bucket=db.Column(db.String(100))
    region=db.Column(db.String(100))
    text=db.Column(db.String(250))
    negtext=db.Column(db.String(250))
    style=db.Column(db.String(250))
    clip=db.Column(db.String(250))
    start=db.Column(db.Float)
    end=db.Column(db.Float)
    steps=db.Column(db.Integer)
    cfg=db.Column(db.Integer)


class Sketch(db.Model, SerializerMixin):
    __tablename__='sketches'

    serialize_rules=('-users_backref','-instance_backref.sketches',)

    id = db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    original_filename=db.Column(db.String(100))
    filename=db.Column(db.String(100))
    bucket=db.Column(db.String(100))
    region=db.Column(db.String(100))

class Instance(db.Model, SerializerMixin):
    __tablename__='instances'

    serialize_rules=('-users_backref','-images.instance_backref','-sketches.instance_backref',)

    id = db.Column(db.Integer, primary_key=True)
    images_id=db.Column(db.Integer, db.ForeignKey('images.id'))
    sketches_id=db.Column(db.Integer, db.ForeignKey('sketches.id'))
    users_id= db.Column(db.Integer, db.ForeignKey('users.id'))

    sketches=db.Relationship("Sketch", backref='instance_backref')
    images=db.Relationship("Image", backref='instance_backref')


