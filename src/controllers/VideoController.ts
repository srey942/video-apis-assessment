import { Request, Response } from "express";
import { VideoService } from "../services/VideoService";
import fs from "fs";
import CONSTANTS from "../common.constant";

const videoService = new VideoService();

export async function uploadVideo(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const uploadResponse = await videoService.uploadAndFormatVideo(req.file);
    return res.status(201).json({ uploadResponse });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
}

export async function fetchVideoData(req: Request, res: Response) {
  const { videoId } = req.params;

  if (!videoId) {
    return res.status(400).json({ message: "No video ID provided" });
  }

  try {
    const metaDataResponse = await videoService.fetchVideoMetaData(videoId);
    return res.status(200).json({ metaDataResponse });
  } catch (error) {
    console.error("Error in fetchVideoData:", error);
    return res.status(500).json({ error: "Failed to download file" });
  }
}

export const mergeVideo = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }
    const { videoId1, videoId2 } = req.body;
    const response = await videoService.mergeVideoService(videoId1, videoId2);
    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ error: "Failed to download file" });
  }
};

export async function downloadMergedVideo(req: Request, res: Response) {
  const { videoId } = req.params;

  if (!videoId) {
    return res.status(400).json({ message: "No video ID provided" });
  }

  try {
    const filePath = await videoService.downloadMergedVideo(videoId);
    const fileStream = fs.createReadStream(filePath);
    fileStream.on("open", () => {
      res.attachment(`${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`);
      fileStream.pipe(res);
    });
  } catch (error) {
    console.error("Error in downloading merged video:", error);
    return res.status(500).json({ error: "Failed to download file" });
  }
}
