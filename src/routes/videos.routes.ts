import express from "express";
import multer from "multer";
import CONSTANTS from "../common.constant";
import {
  uploadVideo,
  fetchVideoData,
  mergeVideo,
  downloadMergedVideo,
} from "../controllers/VideoController";

const router = express.Router();
const maxFileLimit =
  parseInt(process.env.MAX_FILE_LIMIT, 10) ?? CONSTANTS.DEFAULT_FILE_LIMIT;
const upload = multer({
  dest: "uploads",
  limits: { fieldSize: maxFileLimit, fileSize: maxFileLimit },
});

//Upload video
router.post("/", upload.single("file"), uploadVideo);

//Get video metadata
router.get("/:videoId/metadata", fetchVideoData);

//Merge video
router.post("/merge", mergeVideo);

router.get("/merged/:videoId", downloadMergedVideo);

// to define here.
export default router;
