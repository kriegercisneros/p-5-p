# import os
# import requests
import boto3
import base64
import json
# from app import upload_db
from services import os, requests


api_host = 'https://api.stability.ai'
api_key = os.environ.get('api_key')
engine_id='stable-diffusion-xl-beta-v2-2-2'

if api_key is None:
    raise Exception("Missing Stability API key.")

def getModelList():
    url = f"{api_host}/v1/engines/list"
    response = requests.get(url, headers={
        "Authorization": f"Bearer {api_key}"
    })
    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))
    # Do something with the payload...
    payload = response.json()
    print(payload)


prompt="A beautiful and serene beach scene with clear blue skies and a calm ocean. On the soft, golden sand, a group of people is enjoying a tea party. They are sitting around a table with a vintage tea set, fancy teacups, and a variety of delicious treats like scones, pastries, and sandwiches. The table is decorated with a colorful tablecloth and flowers. Nearby, a few seagulls are watching the scene, and gentle waves are lapping at the shore."
new_file_name = prompt.replace(" ", "")[:10]
height = 512
width = 512 
steps = 35
def generateStableDiffusionImage(prompt, height, width, steps):
    url= f"{api_host}/v1/generation/{engine_id}/text-to-image"
    headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {api_key}"
    }
    payload={}
    payload['text_prompts'] = [{"text": f"{prompt}"}]
    payload['cfg_scale'] = 7
    payload['clip_guidance_preset'] = 'SLOWER'
    payload['height'] = height
    payload['width'] = width
    payload['samples'] = 1
    payload['steps'] = steps
    response = requests.post(url,headers=headers,json=payload)

    #processing the response
    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()
    # print(data)
    #here the image (data at this point) is coming in as a giant string.  the code below takes that string and decodes
    #it down to a series of a few numbers : 264637

    for i, image in enumerate(data["artifacts"]):
        with open(f"./ai_images_upload/testing{i}.png", "wb") as f:
            f.write(base64.b64decode(image["base64"]))
    
    #then, send the file to aws.  then send the file to the database (using the app.py code i already have)
    #code to fetch from buckets and get a very specific image
def download_aws():
    s3=boto3.client('s3')
    downloaded_image=s3.download_file(
        #the key needs to be interpolated to grab the specific key, the same as original_filename in the database
        Bucket='phase-5-images', Key="v1_txt2img_0-1.png", Filename="./ai_images_download/trial_1.png"
    )
#post to s3 bucket   
def upload_asw(): 
    s3=boto3.client('s3')   
    s3.upload_file(
        Filename="./ai_images_upload/testing0.png",
        Bucket="phase-5-images",
        Key="new_test_upload_1.png",
    )
upload_asw()
# upload_db()

generateStableDiffusionImage(prompt, height, width, steps)
# "v1_txt2img_{i}.png"