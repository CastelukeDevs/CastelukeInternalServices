import admin from "firebase-admin";
import { getDownloadURL } from "firebase-admin/storage";
import { IStoragePath } from "./StoragePath";
// const { getDownloadURL } = require("firebase-admin/storage");

type IUploadFileOption = {
  path: IStoragePath;
  uid?: string;
};
export default (file: any, options: IUploadFileOption) => {
  const storage = admin.storage().bucket();

  return new Promise<string>((resolve, reject) => {
    if (!file) {
      reject("No file");
    }
    let newFileName = `${options?.path}${
      options?.uid ? options.uid : ""
    }_${Date.now()}_${file.originalname}`;

    let fileUpload = storage.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.log("error", error);

      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const alt = await getDownloadURL(fileUpload);

      //   const url = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
      resolve(alt);
    });

    blobStream.end(file.buffer);
  });
};
