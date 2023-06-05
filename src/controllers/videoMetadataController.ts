import { Request, Response, query } from "express";
import { fetchVideoDataFromSupabase } from "../services/videoMetadataService";

export async function fetchVideoData(req: Request, res: Response) {
  try {
    console.log("videoController",req.params);
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }
    const { videoId } = req.params;
    console.log("request file", videoId);
    const metaDataResponse = await fetchVideoDataFromSupabase(videoId);

    return res.status(20).json({ metaDataResponse });;
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ error: "Failed to download file" });
  }
}
