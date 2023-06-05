# video-apis-assessment
### Technical Assessment Montra ###
This application is video manipulation service built using Node.js, Express.js, Supabase, and FFmpeg. The application mainly four APIs:
* Upload API - used upload a video file to Supabase storage.
* Metadata API - returns the metadata of the video of that is present in Supabase storage.
* Merge API - used to merge two corresponding videos from Supabase.
* Download API -  provides a link to download the merged video.

## Project Structure
```
├── src
│   ├── controllers
|   |   └── VideoController.ts
│   ├── routes
│   │   └── videos.routes.ts
│   ├── services
│   │   ├── VideoService.ts
│   ├── app.ts
│   └── server.ts
├── converted (the folder from which videos are uploaded to supabase storage)
├── downloaded (the folder where the videos from supabase are downloaded and later used to extract metadata)
├── .env (environment variables)
├── common.constant.ts (constant related to the application)
├── utils.ts ( utils related to the application)
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
* Please create a supabase account and create new project. From the project settings->API-> Get your Project URL and Project Key. This key and url needs to be entered in your environment variables.
* Please a create a storage bucket named `videos` and set it to public.
* Please create `.env` and provide the necessary environment variables (e.g., Supabase URL, Supabase key, PORT). Here is sample .env file.
```
BASE_URL="YOUR_SUPABASE_URL"
BASE_KEY="YOUR_SUPABASE_KEY"
MAX_FILE_LIMIT=5242880
```
* Set up and run docker with following commands:
``` 
docker build -t test .
docker run -p 3000:3000 -v $(pwd):/usr/src/app test:latest
```

## API Documentation

### Video Upload API ###

- URL: `POST localhost:3000/video`
- Description: Uploads a video file to Supabase storage.
- Request body: `file` param Form-data with file field containing the video file.
- Sample request body
```
{
"videoId1":"dcfc295467ea4533d78de81339b07beb"
"videoId2":"dcfc295467ea7833d78de81339b07beb"
}
```
- Response: JSON response indicating the success or failure of the upload.
- Sample response :
```
{
    "uploadResponse": {
        "success": true,
        "data": {
            "path": "videos/./converted/dcfc295467ea7833d78de81339b07beb.mp4"
        }
    }
}
```

### Video Merge API ###

- URL: `POST: localhost:3000/video/merge`
- Description: Merge two videos from the supabase.
- Request body: Request body parameters with two video ids. {viodeoId1:'aaaaadd111',videoId2:'aaqqqq1111'}
- Sample request
```
{
"videoId1":"dcfc295467ea7833d78de81339b07beb",
"videoId2":"822c647bb84b607b40437c1fc35c4785"
}
```
- Response: JSON response indicating the success or failure of the merge.
- Sample response :
```
{
    "mergeVideoResponse": {
        "success": true,
        "data": {
            "download_link": "videos/./merged/dcfc295467ea7833d78de81339b07beb.mp4"
        }
    }
}
```

### Video Metadata API ###

- URL: `GET: localhost:3000/video/:videoId/metadata`
- Description: Get the metadata of the video on the supabase storage.
- Request parameters: videoId of the video on supabase.
- Response: JSON response of the metadata on sucesss or failure of the fetch.
- Sample response:
```
{
    "metaDataResponse": {
        "success": true,
        "formattedMetadata": {
            "codecName": "h264",
            "resolution": "960x540",
            "duration": 13.346667,
            "bitRate": 696914,
            "formatName": "mov,mp4,m4a,3gp,3g2,mj2"
        }
    }
}
```

## How to Test the APIs

A postman client is used to test the APIs.

* Upload APIs- The upload API can be tested by using the following URL : `localhost:3000/video`. On the body, select `form-data`,on the key give the parameter    
  name as `file` and in `value`, select a video file and send the request.

* Video metadata API - The upload API can be tested by using the following URL : `localhost:3000/video/metadata/:videoId`. The videoId should be on the URL as a 
  parameter. The `videoId` can be found on the supabase storage. The videoId is nothing but the unique name of the video that is stored in the supabase.

* Merge Video API - The merge API can be tested using the following URL :

* Download Video API - The download API can be tested using the following URL :
  
## Limitations

The supabase free account provides storage of maximum of 50Mb. Hence the file can't be larger than 50Mb. Please refer the screenshot below.

![image](https://github.com/srey942/video-apis-assessment/assets/46189829/dd0ac787-eda5-41f7-9d98-6d04a4e6261d)
