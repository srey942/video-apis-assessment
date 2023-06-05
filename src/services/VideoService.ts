import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import "dotenv/config";

import { MetaData } from "../model/MetaData";
import { cleanUp, writeFileToLocal } from "../utils";
import CONSTANTS from "../common.constant";

export class VideoService {
  supabase: SupabaseClient<any, "public", any>;
  assetsBaseUrl = "./assets";
  convertedBaseUrl = "./converted";
  downloadedBaseUrl = "./downloaded";
  mergedBaseUrl = "./merged";
  processedBaseUrl = "./processed";

  constructor() {
    this.supabase = createClient(process.env.BASE_URL, process.env.BASE_KEY);
  }

  addWaterMark = async (filePath: string): Promise<string> => {
    const watermarkFilePath = `${this.mergedBaseUrl}/${uuidv4()}.${
      CONSTANTS.DEFAULT_OUTPUT_TYPE
    }`;
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(filePath)
        .input(`${this.assetsBaseUrl}/watermark.png`)
        .videoCodec(CONSTANTS.DEFAULT_ENCODER)
        .outputOptions("-pix_fmt yuv420p")
        .complexFilter([
          "[0:v]scale=1024:-1[bg];[bg][1:v]overlay=W-w-10:H-h-10",
        ])
        .saveToFile(watermarkFilePath)
        .on("end", () => resolve(watermarkFilePath))
        .on("error", (error) => reject(error));
    });
  };

  convertToFormat = (
    filePath: string,
    tempFileLocation: string,
    format = CONSTANTS.DEFAULT_OUTPUT_TYPE
  ): Promise<string> => {
    return new Promise<any>((resolve, reject) => {
      ffmpeg(filePath)
        .toFormat(format)
        .on("error", (error) => reject(error))
        .saveToFile(tempFileLocation)
        .on("end", () => resolve("success"));
    });
  };

  uploadAndFormatVideo = async (file: Express.Multer.File) => {
    const tempFileLocation = `${this.convertedBaseUrl}/${file.filename}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`;
    await this.convertToFormat(file.path, tempFileLocation);
    return await this.uploadVideoToSupabase(tempFileLocation);
  };

  uploadVideoToSupabase = async (filePath: string) => {
    try {
      const { data, error } = await this.supabase.storage
        .from("videos")
        .upload(`videos/${filePath}`, fs.createReadStream(filePath), {
          upsert: true,
        });
      if (error) {
        throw error;
      }
      return { success: true, link: filePath };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    } finally {
      cleanUp(filePath);
    }
  };

  downloadVideoAndSaveFromSupabase = async (
    videoId: string
  ): Promise<string> => {
    try {
      const filePath = `${this.downloadedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`;
      const { data, error } = await this.supabase.storage
        .from("videos")
        .download(
          `videos/${this.convertedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
        );
      if (error) {
        throw error;
      }
      await writeFileToLocal(data, filePath);
      return filePath;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  extractMetadata = (filePath: string): Promise<MetaData> => {
    return new Promise<any>((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        }
        resolve(this.filterMetaDataResponse(metadata));
      });
    });
  };

  filterMetaDataResponse = (response: ffmpeg.FfprobeData): MetaData => {
    const { codec_name, width, height, duration, bit_rate } =
      response.streams[0];
    const { format_name } = response.format;
    return {
      codecName: codec_name,
      resolution: `${width}x${height}`,
      duration: duration,
      bitRate: bit_rate,
      formatName: format_name,
    };
  };

  fetchVideoMetaData = async (videoId: string) => {
    const tempFilePath = await this.downloadVideoAndSaveFromSupabase(videoId);

    const metadata = await this.extractMetadata(tempFilePath);
    return { success: true, metadata };
  };

  downloadMergedVideo = async (videoId: string): Promise<string> => {
    try {
      const filePath = `${this.downloadedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`;
      const { data, error } = await this.supabase.storage
        .from("videos")
        .download(
          `videos/${this.mergedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
        );
      if (error) {
        throw error;
      }
      await writeFileToLocal(data, filePath);
      return filePath;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  videoTranscoding = async (videoId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(
          `${this.downloadedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
        )
        .videoCodec(CONSTANTS.DEFAULT_ENCODER)
        .noAudio()
        .size("1280x720")
        .withFps(24)
        .withDuration(30)
        .saveToFile(
          `${this.processedBaseUrl}/${videoId}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
        )
        .on("error", function (err) {
          console.error("An error occurred on convert: ", err);
          reject(err);
        })
        .on("end", function () {
          console.log("convert finished !");
          resolve("success");
        });
    });
  };

  mergeVideoService = async (videoId1: string, videoId2: string) => {
    try {
      await Promise.allSettled([
        this.downloadVideoAndSaveFromSupabase(videoId1),
        this.downloadVideoAndSaveFromSupabase(videoId2),
      ]);

      await Promise.allSettled([
        this.videoTranscoding(videoId1),
        this.videoTranscoding(videoId2),
      ]);

      const mergedVideoFilePath = `${this.mergedBaseUrl}/${uuidv4()}.${
        CONSTANTS.DEFAULT_OUTPUT_TYPE
      }`;

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(
            `${this.processedBaseUrl}/${videoId1}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
          )
          .input(
            `${this.processedBaseUrl}/${videoId2}.${CONSTANTS.DEFAULT_OUTPUT_TYPE}`
          )
          .mergeToFile(mergedVideoFilePath, "./temp")
          .on("error", (err) => {
            reject(err);
          })
          .on("end", () => {
            console.log("Merging finished!");
            resolve("success");
          });
      });

      const watermarkFilePath = await this.addWaterMark(mergedVideoFilePath);

      return await this.uploadVideoToSupabase(watermarkFilePath);
    } catch (error) {
      console.error("Error merging file", error);
    }
  };
}
