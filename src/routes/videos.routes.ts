import express from "express";
import { uploadVideo } from "../controllers/uploadVideoController";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: 'uploads' });

// POST /upload
router.post("/", upload.single("file"), uploadVideo );

// to define here.
export default router;
