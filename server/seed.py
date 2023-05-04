#!/usr/bin/env python3

# from app import app
from services import db,app
from model import Image, User, Sketch

# from faker import Faker
# from random import randint
# faker = Faker()

with app.app_context():
    print("Deleting Images...")
    Sketch.query.delete()
    Image.query.delete()
    User.query.delete()
    
    # print("Creating Images...")
    # new_img_1 = Image(original_filename="Mountain Ski Lodge",filename="user", bucket='imagetrail', region='us-west-2')
    # images = [new_img_1]
    # db.session.add_all(images)
    # db.session.commit()

    new_user_1=User(password_hash="test", email="test@test.com", username="test")
    users=[new_user_1]
    db.session.add_all(users)
    db.session.commit()