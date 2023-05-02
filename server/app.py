#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request, session
# from flask_migrate import Migrate
from model import db, Sketch
from werkzeug.utils import secure_filename

# from apifetch import new_file_name
from dotenv import load_dotenv
# import os
from services import app, os, db
from model import User


#this prints the current buckets in AWS
# s3=boto3.resource('s3')
# for bucket in s3.buckets.all():
#     print(bucket.name)


@app.route('/')
def hello_world():
    return 'hello world'

@app.route('/upload', methods=['POST'])
def upload_db():
    original_fn = "./ai_images_upload/testing0.png"
    #new_file_name is from apifetch that takes the first ten letters of the prompt
    fname = secure_filename(f'{new_file_name}.png')
    img=Img(original_filename=original_fn, filename=fname, bucket='phase-5-images', region='us-west-2')
    db.session.add(img)
    db.session.commit()
    return 'image has been uploaded', 200


#######################################################################################################
###########                         Begin of loggin authorization                           ###########
#######################################################################################################

#route to check if a user is logged in and stored in sessions
@app.route('/info')
def get_curr_user():
    user_id=session.get('user_id')
    print(session)
    if not user_id:
        return jsonify({"error":"unauthorized"}), 401
    user=User.query.filter(User.id==user_id).first()
    return jsonify({
        "id":user.id, 
        "email":user.email, 
        "username":user.username
    })
#Creates a login route that checks if the user exists
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        jsoned_request = request.get_json()
        user = User.query.filter(User.email == jsoned_request['email']).first()
        if user and user.authenticate(jsoned_request["password_hash"]):
            #this is saying "user_id" in sessions is equal to the user
            #id we have found in the user table
            session["user_id"] = user.id
            print(session)
            return make_response(jsonify(user.to_dict(), {"message":"You are successfully logged in."}), 200)
        else:
            return make_response(jsonify({"login":"Unauthorized"}), 401)
#gets all user information and creates a new user
@app.route('/users', methods=['GET', 'POST'])
def users():
    if request.method=='GET':
        u=User.query.all()
        user_dict_list=[users.to_dict() for users in u]
        return make_response(jsonify(user_dict_list), 200)
    if request.method =='POST':
        email=request.json['email']
        password=request.json['password_hash']
        user_exist = User.query.filter(User.email==email).first()
        if user_exist is not None:
            return jsonify({'error':'user already exists'}), 409
        data=request.get_json()
        try:
            user = User(
                email=email,
                username=data['username']
            )
            #my password hash is in model
            user.password_hash = password
            db.session.add(user)
            db.session.commit()
            # print(user.id)
            #setting sessions id here to equal the new user_id that we JUST CREATED!
            session['user_id'] = user.id
            print(session)
            return make_response(jsonify(user.to_dict(), {"message":"registered successfully"}), 201)
        except Exception as e:
            return make_response({"errors": [e.__str__()]}, 422)

@app.route('/logout', methods=['POST'])
def User_Logout():
    print(session)
    session.pop('user_id')
    print(session)
    return '200'


@app.route('/fetch')
def get_image_db():
    #gets a specific image from the db based upon the logged in user and what not, then proceeds to call the download_aws() function to pull the image down from s3
    pass

@app.route('/posting_sketches', methods=['POST'])
def posting_sketches():
    #the unique key will be the name of the sketch 
    data=request.get_json()
    try:
        sketch=Sketch(
            original_filename='ofn',
            filename=data['filename'],
            bucket='phase-5-images',
            region='us-west-2',
            user_id=data['user_id']
        )
        db.session.add(sketch)
        db.session.commit()
        return jsonify({'success': True})
    except:
        return jsonify({'success': False})

#######################################################################################################
###########                         fetching access keys for aws                            ###########
#######################################################################################################

@app.route('/aws-keys')
def get_aws_keys():
    access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    print(access_key)
    secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    return jsonify({'access_key': access_key, 'secret_access_key': secret_key})


#wtf is this for???????? this was my original testing method that put the text to image data into postgres

# @app.route('/upload', methods=['POST'])
# def upload_db():
#     original_fn = "./ai_images_upload/testing0.png"
#     #new_file_name is from apifetch that takes the first ten letters of the prompt
#     fname = secure_filename(f'{new_file_name}.png')
#     img=Img(original_filename=original_fn, filename=fname, bucket='phase-5-images', region='us-west-2')
#     db.session.add(img)
#     db.session.commit()
#     return 'image has been uploaded', 200