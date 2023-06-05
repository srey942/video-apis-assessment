import { Blob } from "buffer";
import fs from "fs";

export const cleanUp = (pathToFile: string) => {
  try {
    fs.unlinkSync(pathToFile);
  } catch (err) {
    console.error("clean up failed", err);
  }
};

export const writeFileToLocal = async (
  fileData: Blob,
  filePath: string
): Promise<void> => {
  const buf = Buffer.from(await fileData.arrayBuffer()); // decode
  fs.writeFileSync(filePath, buf);
};
