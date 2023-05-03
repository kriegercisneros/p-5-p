import os
import boto3
import hashlib
from flask import Flask, request, jsonify
from datetime import datetime, timedelta


s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
)

S3_BUCKET_NAME = 'direct-upload-s3-bucket-thing'
S3_REGION = 'us-west-2'


@app.route('/api/generate-upload-url', methods=['POST'])
def generate_upload_url():
    try:
        data = request.get_json()
        file_name = data.get('file_name')
        file_type = data.get('file_type')

        if not file_name or not file_type:
            return jsonify({'error': 'File name and type are required'}), 400

        file_name_hash = hashlib.md5(file_name.encode()).hexdigest()

        # Generate a presigned URL for the S3 upload
        presigned_post = s3.generate_presigned_post(
            Bucket=S3_BUCKET_NAME,
            Key=file_name_hash,
            Fields={"Content-Type": file_type},
            Conditions=[
                {"Content-Type": file_type},
                {"bucket": S3_BUCKET_NAME},
                {"acl": "public-read"},
                ["content-length-range", 0, 10 * 1024 * 1024],
            ],
            ExpiresIn=3600
        )

        # Return the S3 upload URL and form fields
        return jsonify({
            'url': presigned_post['url'],
            'fields': presigned_post['fields']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
