import express from "express";
import { uploadVideo } from "../controllers/uploadVideoController";
import multer from "multer";
import { fetchVideoData } from "../controllers/videoMetadataController";
const router = express.Router();
const upload = multer({ dest: "uploads" });

// POST /upload
router.post("/", upload.single("file"), uploadVideo);

// router.get("/videos/:videoId", fetchVideoData);

// GET /videos/:videoId
router.get("/metadata/:videoId", fetchVideoData);

// to define here.
export default router;
