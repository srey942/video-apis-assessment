import { Request, Response } from "express";
import { uploadVideoToSupabase } from "../services/uploadVideoService";

export async function uploadVideo(req: Request, res: Response) {
  try {
    console.log("gotha")
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.file;
    console.log("request file",file)
    console.log("request name ,path ",req.file?.originalname,req.file?.path);
    const uploadResponse = await uploadVideoToSupabase(file);

    return res.status(201).json({ uploadResponse });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ error: "Failed to upload file" }); 
  }
  
}
