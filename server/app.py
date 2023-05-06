#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request, session, send_file
# from flask_migrate import Migrate
from model import db, Sketch
from werkzeug.utils import secure_filename
# from io import BytesIO
import io
import boto3
import datetime
import uuid
# from apifetch import new_file_name
# from dotenv import load_dotenv
# import os

from services import app, os, db, requests
from model import User, Image, Sketch, Instance
import base64

engine_id='stable-diffusion-xl-beta-v2-2-2'
api_host = 'https://api.stability.ai'
api_key = os.environ.get("api_key")

if api_key is None:
    raise Exception("Missing Stability API key.")

@app.route('/generate-ai', methods=['POST'])
def generate_ai():
    #request.data is used to access raw http data from a post request
    img=session.get('image_filename')
    if(img):
        session.pop('image_filename')
    init_image = request.files['name'].read()
    imf=io.BytesIO(init_image)
    # print(imf)
    # print(init_image.read())
#this is posting to the api through my requests library
    # init_image_file=BytesIO(init_image)
    response = requests.post(
        f"{api_host}/v1/generation/{engine_id}/image-to-image",
        headers={
            #is it v1 or v2?
            "Accept": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        files={
            # "init_image": open(init_image, 'r')
            "init_image":imf
        },
        data={
            "image_strength": 0.001,
            "init_image_mode": "IMAGE_STRENGTH",
            "text_prompts[0][text]":"galatic space monkeys",
            "cfg_scale": 20,
            "clip_guidance_preset": "FAST_BLUE",
            "style_preset":"origami",
            "samples": 1,
            "steps": 15,
        }
    )
    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()

    for i, image in enumerate(data["artifacts"]):
        with open(f"./ai_images_download/trial_1.png", "wb") as f:
            f.write(base64.b64decode(image["base64"]))

    upload_asw()
    return send_file('./ai_images_download/trial_1.png', mimetype='image/png')

def upload_asw(): 
    s3=boto3.client('s3')
    uniqueimagename=f"{uuid.uuid4().hex}.png"
    print(uniqueimagename)  
    session['image_filename']=uniqueimagename
    s3.upload_file(
        Filename="./ai_images_download/trial_1.png",
        Bucket="phase-5-images",
        Key=uniqueimagename,
    )

@app.route('/imagesession')
def imagesession():
    image_sesh=session.get('image_filename')
    print(session)
    if not image_sesh:
        return jsonify({"error":"unauthorized"}), 401
    return jsonify({
        "message":image_sesh
    })

@app.route('/saveimage', methods=['POST'])
def saveimage():
    print('image saved')
    # filename=request.json['filename']
    # file_exist = Image.query.filter(Image.filename==filename).first()
    # if file_exist is not None:
    #     return jsonify({'error':'image already exists'}), 409
    data=request.get_json()
    # print(data)
    try:
        image = Image(
            filename=data['filename'],
            user_id=data['user_id'],
            original_filename=data['original_filename'],
            bucket=data['bucket'],
            region=data['region'],
            # filename=filename
            )
        print(image)
        db.session.add(image)
        db.session.commit()
        image_id=image.id
        return make_response({"image_id":image_id}, 201)
    except Exception as e:
        return make_response({"errors": str(e)}, 422)



# @app.route('/fetchsketchid')
# def fetchsketchid():
#     filename=request.json['filename']
#     right_sketch = Sketch.query.filter(Sketch.filename==filename).first()
#     sketch_id=right_sketch.id
#     return make_response(jsonify(sketch_id), 200)

@app.route('/saveinstance', methods=['POST'])
def saveinstance():
    data=request.get_json()
    print(data)
    try:
        inst=Instance(
            users_id=data['user_id'],
            sketches_id=data['sketches_id'],
            images_id=data['images_id']
        )
        db.session.add(inst)
        db.session.commit()
        return make_response({"message":"instance post success"}, 201)
    except Exception as e:
        return make_response({"errors": str(e)}, 422)

@app.route('/instances/<int:users_id>')
def get_instances_by_user_id(users_id):
    instances = Instance.query.filter_by(users_id=users_id).all()
    instances_list = []
    for i in instances:
        # print(f"thisit{i.images.to_dict()}")
        instance_dict = {
            'id': i.id,
            'user_id': i.users_id,
            'sketch_id': i.sketches_id,
            'image_id': i.images_id, 
            'images':i.images.to_dict(), 
            'sketches':i.sketches.to_dict()
        }
        instances_list.append(instance_dict)
    return jsonify(instances=instances_list)

@app.route('/images/<int:image_id>')
def get_image(image_id):
    image = Image.query.get(image_id)
    if image:
        filename = image.filename
        print(filename)
        # Do something with the filename, such as displaying the sketch image on a web page
        return make_response({"filename": filename})
    else:
        return make_response({"message": "Sketch not found"}, 404)

@app.route('/sketches/<int:sketch_id>')
def get_sketch(sketch_id):
    sketch = Sketch.query.get(sketch_id)
    if sketch:
        filename = sketch.filename
        print(filename)
        # Do something with the filename, such as displaying the sketch image on a web page
        return make_response({"filename": filename})
    else:
        return make_response({"message": "Sketch not found"}, 404)





###################################################################################
# from s3 import generate_upload_url, createConfig
# import hashlib
# import random
# import string
# import boto3
# # import os
# from dotenv import load_dotenv
# load_dotenv()

# from datetime import datetime, timedelta

# s3 = boto3.client(
#     's3',
#     aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
#     aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
# )
# S3_BUCKET_NAME = 'phase-4-bucket-2'
# S3_REGION = 'us-west-2'

# def url():
#     # Generate a unique image name
#     image_name = generate_random_string(16)

#     # Set S3 bucket and object key
#     bucket_name = 'phase-4-bucket-2'
#     object_key = image_name

#     # Set the pre-signed URL expiration time
#     expiration = datetime.now() + timedelta(minutes=1)

#     # Generate a pre-signed URL for uploading to S3
#     presigned_url = s3.generate_presigned_url(
#         ClientMethod='put_object',
#         Params={
#             'Bucket': bucket_name,
#             'Key': object_key,
#             'Expires': expiration
#         },
#         HttpMethod='PUT'
#     )

#     return presigned_url

# def generate_random_string(length):
#     # Generate a random string of alphanumeric characters
#     return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# @app.route('/generate-upload-url', methods=['PUT'])
# def generate_upload_url():
#     try:
#         data = request.get_json()
#         file_name = data['filename']
#         file_type = data['type']

#         if not file_name or not file_type:
#             return jsonify({'error': 'File name and type are required'}), 400

#         # file_name_hash = hashlib.md5(file_name.encode()).hexdigest()

#         # Generate a presigned URL for the S3 upload
#         presigned_post = s3.generate_presigned_post(
#             Bucket=S3_BUCKET_NAME,
#             Key=file_name,
#             Fields={"Content-Type": file_type},
#             Conditions=[
#                 {"Content-Type": file_type},
#                 {"bucket": S3_BUCKET_NAME},
#                 {"acl": "public-read"},
#                 ["content-length-range", 0, 10 * 1024 * 1024],
#             ],
#             ExpiresIn=3600
#         )

#         # Return the S3 upload URL and form fields
#         return jsonify({
#             'url': presigned_post['url'],
#             'fields': presigned_post['fields']
#         }), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/s3Url')
# def get_s3_url():
#     response = url()
#     return jsonify({'url': response}),200
    
###################################################################################

#this prints the current buckets in AWS
# s3=boto3.resource('s3')
# for bucket in s3.buckets.all():
#     print(bucket.name)


@app.route('/')
def hello_world():
    return 'hello world'


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
        sketch_id=sketch.id
        print(sketch_id)

        return jsonify({'success': True, 'sketch_id':sketch_id})
    except:
        return jsonify({'success': False})
    


#######################################################################################################
###########                         fetching access keys for aws                            ###########
#######################################################################################################


@app.route('/aws-keys')
def get_aws_keys():
    access_key = os.environ.get('AWS_ACCESS_KEY_ID')
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