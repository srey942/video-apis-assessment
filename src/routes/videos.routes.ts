import express from "express";
import multer from "multer";
import { addWaterMark, uploadVideo, fetchVideoData, mergeVideo } from "../controllers/VideoController";

const router = express.Router();
const upload = multer({ dest: "uploads", limits: { fieldSize: parseInt(process.env.MAX_FILE_LIMIT, 10), fileSize: parseInt(process.env.MAX_FILE_LIMIT, 10)} });

//Upload video
router.post("/", upload.single("file"), uploadVideo);

//Get video metadata
router.get("/:videoId/metadata", fetchVideoData);

//Merge video
router.post("/merge", mergeVideo);

//Add mark video
router.post("/:videoId/watermark", addWaterMark);

// to define here.
export default router;
