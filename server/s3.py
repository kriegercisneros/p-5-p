# import os
# import boto3
# import hashlib
import random
import string
import boto3
import os
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timedelta

# Load environment variables from a .env file
# from dotenv import load_dotenv
# load_dotenv()

# Set up S3 client
# s3 = boto3.client('s3', region_name='us-west-2', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
)
S3_BUCKET_NAME = 'phase-4-bucket-2'
S3_REGION = 'us-west-2'

def generate_upload_url():
    # Generate a unique image name
    image_name = generate_random_string(16)

    # Set S3 bucket and object key
    bucket_name = 'phase-4-bucket-2'
    object_key = image_name

    # Set the pre-signed URL expiration time
    expiration = datetime.now() + timedelta(minutes=1)

    # Generate a pre-signed URL for uploading to S3
    presigned_url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': bucket_name,
            'Key': object_key,
            'Expires': expiration
        },
        HttpMethod='PUT'
    )

    return presigned_url

def generate_random_string(length):
    # Generate a random string of alphanumeric characters
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
