# phase-5-project
Hello, thanks for checking out my phase 5 project.  This app allows a user to sketch in the browser then submit the sketch for Stable Diffusions Models to process and create a new AI generated image based on the sketch.  The app can also accept an image as a PNG an generate another image in it's likeness based on user generated inputs (the image bust be in a 512x512 format for the API to accept it).  Also, the user can type in text and generate an image based upon the text input.  

To open the project, you will need access to multiple API keys.  If you are interested in obtaining them, send me an email at krieger.jacqueline@gmail.com and we can chat. 

From the command line in the root directory for the project, cd into server, then cd into .venv.  From here type in source bin/activate to fire up the pip environment.  Make sure to exit out of any other venvs you might be in.  To start the server, cd up a level, back to the server directory and type flask run.  To get the cleint side up and running, cd into phase-5-project/client/phase-5-project and type npm run dev.  This is a Vite Development server.  

Here, with the API keys for Stability AI and also AWS S3, you can use the app!  It is alot of fun, hope you enjoy :) 
