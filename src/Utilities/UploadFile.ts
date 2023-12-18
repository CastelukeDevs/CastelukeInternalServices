import admin from "firebase-admin";
const { getDownloadURL } = require("firebase-admin/storage");

export default (file: any, uid?: string) => {
  const storage = admin.storage().bucket();

  return new Promise<string>((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `user/avatar/${uid ? uid : ""}_${Date.now()}_${
      file.originalname
    }`;

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
