import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import stream from "stream";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { v4 as uuid4 } from "uuid";
// import path from "path";

export const uploadVideoToSupabase = async (file) => {
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc2hqZ2twZXd2cW1yaXpyd3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3NTIyMDcsImV4cCI6MjAwMTMyODIwN30.ZZGSVFyr5x7jGapWWZSDKw-fRZQ6nER6MRu4q6SwXCc";
  const supabaseUrl = "https://pdshjgkpewvqmrizrwro.supabase.co";

  // Initialize Supabase client

  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    // const convertedFile = file;
    // console.log("service file beforeconversion", convertedFile);
    //console.log("service filee path ", file.path);
    const convertedFile = await mp4Conversion(file);
    console.log("converted", convertedFile);
    // const readStream = fs.createReadStream(convertedFile)
    // console.log("converted", convertedFile.path);
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`videos/${convertedFile}`, fs.createReadStream(convertedFile), {
        upsert: true,
      });
    if (error) {
      // console.error("Error uploading file:", error.message);
      // return data.status(500).json({ error: "Failed to upload file" });
      throw error;
    } else {
      console.log("File uploaded successfully:", data?.path);
      return { success: true };
    }
  } catch (error) {
    // console.log("Error uploading file:", error);
    // return error.status(500).json({ error: "Failed to upload file" });
    console.error(error);
    throw new Error("custom message");
  }
  async function mp4Conversion(fileData): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log("tests", fileData);

      ffmpeg(file.path)
        .toFormat("mp4")
        .on("error", (error) => reject(error))
        .saveToFile(`./converted/${file.filename}.mp4`)
        .on("end", () => resolve(`./converted/${file.filename}.mp4`));
    });
  }
};
