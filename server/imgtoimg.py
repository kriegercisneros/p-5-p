import base64
import os
# import requests
from services import os, requests
# import boto3


engine_id='stable-diffusion-xl-beta-v2-2-2'
api_host = 'https://api.stability.ai'
api_key = os.environ.get("api_key")

if api_key is None:
    raise Exception("Missing Stability API key.")

response = requests.post(
    f"{api_host}/v1/generation/{engine_id}/image-to-image",
    headers={
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    },
    files={
        "init_image": open("../client/phase-5-project/src/files/undefined.png", "rb")
    },
    data={
        "image_strength": 0.1,
        "init_image_mode": "IMAGE_STRENGTH",
        "text_prompts[0][text]":"Transform a simple sketch of a Franciscan Tau cross into an iconic image that evokes the essence of Gothic Italy. Use contrasting dark colors to create a visually striking and inspiring image. The final artwork should blend the intricate aesthetics of Gothic architecture with visual representation of analog film, resulting in a unique and captivating visual experience.",
        #heart prompt 
        # "text_prompts[0][text]": "Create a realistic, full-color rendering of a heart that appears to be floating in space, generate a stunning, space-themed background and coloring for the heart, the final output should be a high-resolution image that showcases the heart in all its glory, with vibrant colors and intricate details that make it seem like it's part of the universe.",
        #controls the resolution of the generated image
        "cfg_scale": 20,
        "clip_guidance_preset": "SLOWEST",
        #this could be an option to try 
        # "sampler":"DDPM",
        #seed parameter: allows you to control the randomness of the image generation process, and can be useful for debugging
        "style_preset":"analog-film",
        "samples": 1,
        "steps": 150,
    }
)

if response.status_code != 200:
    raise Exception("Non-200 response: " + str(response.text))

data = response.json()

for i, image in enumerate(data["artifacts"]):
    with open(f"./ai_images_download/trial_1.png", "wb") as f:
        f.write(base64.b64decode(image["base64"]))
