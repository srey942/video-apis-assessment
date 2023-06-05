import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export class VideoService {
  supabase: any;
  assetsBaseUrl = "./assets";
  convertedBaseUrl = "./converted";
  downloadedBaseUrl = "./downloaded";
  mergedBaseUrl = "./merged";

  constructor() {
    const supabaseKey = process.env.BASE_KEY;
    const supabaseUrl = process.env.BASE_URL;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  addWaterMark = async (filePath: any) => {
    const tempFileLocation = `${this.convertedBaseUrl}/${filePath}.mp4`
    new Promise((resolve, reject) => {
      try {
        ffmpeg()
          .input(tempFileLocation)
          .input(`${this.assetsBaseUrl}/watermark.png`)
          .videoCodec("libx264")
          .outputOptions("-pix_fmt yuv420p")
          .complexFilter([
            "[0:v]scale=1024:-1[bg];[bg][1:v]overlay=W-w-10:H-h-10",
          ])
          .saveToFile(`${this.mergedBaseUrl}/${filePath}.mp4`)
          .on("end", () => resolve("success"))
          .on("error", (error) => reject(error));
      } catch (e) {
        reject(e);
      } finally {
        this.cleanUp(tempFileLocation);
      }
    });
  };

  uploadVideoToSupabase = async (file) => {
    const tempFileLocation = `${this.convertedBaseUrl}/${file.filename}.mp4`
    try {
      const convertedFile = await mp4Conversion(file);
      const { data, error } = await this.supabase.storage
        .from("videos")
        .upload(`videos/${convertedFile}`, fs.createReadStream(convertedFile), {
          upsert: true,
        });
      return { success: true, data };
      if (error) {
        throw error;
      }
      else {
        return { status: "success"}
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    } finally {
      this.cleanUp(tempFileLocation);
    }

    async function mp4Conversion(fileData): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        ffmpeg(file.path)
          .toFormat("mp4")
          .on("error", (error) => reject(error))
          .saveToFile(tempFileLocation)
          .on("end", () => resolve(tempFileLocation));
      });
    }
  };

  fetchVideoDataFromSupabase = async (videoId: any) => {
    try {
      const { data, error } = await this.supabase.storage
        .from("videos")
        .download(`videos/converted/${videoId}.mp4`);
      if (error) {
        throw error;
      } else {
        await downloadToLocal(data, videoId);
        const metadata = await extractMetadata(videoId);
        const formattedMetadata = filterMetaDataResponse(metadata);
        return { success: true, formattedMetadata };
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }

    async function downloadToLocal(fileData, videoId): Promise<any> {
      const buf = Buffer.from(await fileData.arrayBuffer()); // decode
      fs.writeFileSync(`./downloaded/${videoId}.mp4`, buf);
    }

    async function extractMetadata(videoId): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        ffmpeg.ffprobe(`./downloaded/${videoId}.mp4`, function (err, metadata) {
          if (err) {
            reject(err);
          }
          resolve(metadata);
        });
      });
    }

    function filterMetaDataResponse(response: any): any {
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
    }
  };
  mergeVideoService = async (videoId1: string, videoId2: string) => {

    try {
      await Promise.allSettled([this.fetchVideoDataFromSupabase(videoId1),
       this.fetchVideoDataFromSupabase(videoId2)]);

      await Promise.allSettled([this.videoTranscoding(videoId1), this.videoTranscoding(videoId2)]);

      ffmpeg().input(`./temp/${videoId1}.mp4`)
      // .withDuration(30)
      .input(`./temp/${videoId2}.mp4`)
      // .withDuration(30)
      .mergeToFile('./merged/test.mp4','./temp')
      .on('error', function(err) {
        // console.error('An error occurred on merge: ', err); //throw error
        throw err
      })
      .on('end', function() {
        console.log('Merging finished !');
      })
    } catch (error) {
        console.error("Error")
    }
  }

     videoTranscoding = async (videoId): Promise<any> => {
      return new Promise((resolve, reject) => {
          ffmpeg().input(`${this.downloadedBaseUrl}/${videoId}.mp4`)
          .videoCodec('libx264')
          .noAudio()
          .outputOptions('-vf', 'scale=1280:720')
          .outputOptions('-r', '30')
          .saveToFile(`./temp/${videoId}.mp4`).on('error', function(err) {
            console.error('An error occurred on convert: ', err);
            reject(err)
          })
          .on('end', function() {
            console.log('convert finished !');
            resolve('success')
          });
        });
    }

    cleanUp(pathToFile) {
      try {
        fs.unlinkSync(pathToFile);
      } catch (err) {
        console.log("clean up failed", err);
      }
    }
}