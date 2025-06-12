import drive from "../config/googleDrive.js";
import fs from "fs";
import path from "path";

// Extract Google Drive File ID
export const extractFileId = (url) => {
  const match = url.match(/\/d\/(.*)\//);
  return match ? match[1] : null;
};

// Upload File to Google Drive
export const uploadToGoogleDrive = async (file, folderId) => {
  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: file.buffer
      ? Buffer.from(file.buffer)
      : fs.createReadStream(path.join(__dirname, "../uploads", file.filename)),
  };

  const driveResponse = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id, webViewLink",
  });

  return driveResponse.data;
};

// Delete File from Google Drive
export const deleteFromGoogleDrive = async (filePath) => {
  const driveFileId = extractFileId(filePath);
  if (driveFileId) {
    await drive.files.delete({ fileId: driveFileId });
  }
};
