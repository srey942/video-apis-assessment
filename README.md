# video-apis-assessment
### Technical Assessment Montra ###
This application is video manipulation service built using Node.js, Express.js, Supabase, and FFmpeg. The application mainly four APIs:
* Upload API - API that is can be used upload a video file to Supabase storage.
* Metadata API -  API returns the metadata of the video of that is present in Supabase storage.
* Merge API - API that can be used to merge two corresponding videos from Supabase.
* Download API - API that provides a link to download the merged video.

## Project Structure
```
├── src
│   ├── controllers
|   |   └── videoController.ts
│   ├── routes
│   │   └── videos.routes.ts
│   ├── services
│   │   ├── videosService.ts
│   ├── app.ts
│   └── server.ts
├── converted (the folder from which videos are uploaded to supabase storage)
├── downloaded (the folder where the videos from supabase are downloaded and later used to extract metadata)
├── .env (environment variables)
├── .gitignore
├── package.json
└── README.md
```

- src/controllers: Contains controller files responsible for handling API endpoints and processing requests.
- src/routes: Contains route files defining the API endpoints and their associated controllers.
- src/services: Contains service files responsible for implementing the business logic and interacting with external services.
- src/app.ts: Entry point of the application where Express.js server is initialized.
- src/server.ts: Starts the Express.js server and listens for incoming requests.
- uploads: Directory where uploaded files are stored (you can choose a different location if desired).
- .env: File for storing environment variables such as Supabase URL, Supabase key, and other configuration settings.
- .gitignore: Specifies files and directories to be ignored by Git version control.
- package.json: Contains project dependencies and scripts.
- README.md: Documentation file explaining the project and how to use it.

## Installation and Setup
Note : Please have a minimum version of node v16.16.0, docker installed
* Start by cloning the repo :
* Set and up run docker with following commands to install the required dependencies and setup.
  ``` docker build -t test .``` and 
  ``` docker run -p 3000:3000 -v .:/usr/src/app test:latest ```
* Please create a supabase account and create new project. From the project settings->API-> Get your Project URL and Project Key. This key and url needs to be  
  entered in your environment variables.
* Please a create a storage bucket named `videos` and set it to public.
* Please create `.env` and provide the necessary environment variables (e.g., Supabase URL, Supabase key, PORT).
* Please create two folders named `converted` and `downloaded` on the top-level directory.
* Start the server by giving `npm run dev`.

## API Documentation

### Video Upload API ###

- URL: `POST localhost:3000/video`
- Description: Uploads a video file to Supabase storage.
- Request body: `file` param Form-data with file field containing the video file.
- Response: JSON response indicating the success or failure of the upload.

### Video Merge API ###

- URL: `POST localhost:3000/video/merge`
- Description: Merge two videos from the supabase.
- Request body: Request body parameters with two video ids. {viodeoId1:'aaaaadd111',videoId2:'aaqqqq1111'}
- Response: JSON response indicating the success or failure of the merge.

### Video Metadata API ###

- URL: `GET llocalhost:3000/video/metadata/:videoId`
- Description: Get the metadata of the video on the supabase storage.
- Request parameters: videoId of the video on supabase
- Response: JSON response of the metadata on sucesss or failure of the fetch.

## How to Test the APIs

A postman client is used to test the APIs.

* Upload APIs- The upload API can be tested by using the following URL : `localhost:3000/video`. On the body, select `form-data`,on the key give the parameter    
  name as `file` and in `value`, select a video file and send the request.

* Video metadata API - The upload API can be tested by using the following URL : `localhost:3000/video/metadata/:videoId`. The videoId should be on the URL as a 
  parameter. The `videoId` can be found on the supabase storage. The videoId is nothing butunique name of the video that is stored in the supabase.

* Merge Video API - The merge API can be tested using the following URL :

* Download Video API - The download API can be tested using the following URL :
  
