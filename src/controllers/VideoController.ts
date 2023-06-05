
import { Request, Response } from "express";
import { VideoService } from "../services/VideoService";

const videoService = new VideoService();

export async function addWaterMark(req: Request, res: Response) {
  try {
    console.log("req.params.filePath", req.params.videoId);
    await videoService.addWaterMark(req.params.videoId);
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
}

export async function uploadVideo(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const uploadResponse = await videoService.uploadVideoToSupabase(req.file);
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
    const metaDataResponse = await videoService.fetchVideoDataFromSupabase(
      videoId
    );
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
        const metaDataResponse = await videoService.mergeVideoService(videoId1, videoId2);
        return res.status(200).json({ metaDataResponse });;
      } catch (error) {
        console.error("Error in uploadVideo:", error);
        return res.status(500).json({ error: "Failed to download file" });
      }
}