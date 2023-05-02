#!/usr/bin/env python3

# from app import app
from services import db,app
from model import Img, User

# from faker import Faker
# from random import randint
# faker = Faker()

with app.app_context():
    print("Deleting Images...")
    # Img.query.delete()
    
    # print("Creating Images...")
    # new_img_1 = Img(original_filename="Mountain Ski Lodge",filename="user", bucket='imagetrail', region='us-west-2')
    # images = [new_img_1]
    # db.session.add_all(images)
    # db.session.commit()

    new_user_1=User(password_hash="123", email="test@test.com", username="test")
    users=[new_user_1]
    db.session.add_all(users)
    db.session.commit()