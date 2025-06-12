import {
  extractFileId,
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
} from "../utils/googleDriveUtils.js";
import drive from "../config/googleDrive.js";
import fs from "fs";
import path from "path";

jest.mock("../config/googleDrive.js", () => ({
  files: {
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("fs", () => ({
  createReadStream: jest.fn(),
}));

describe("googleDriveUtils", () => {
  describe("extractFileId", () => {
    it("should extract the file ID from a valid Google Drive URL", () => {
      const url = "https://drive.google.com/file/d/12345/view";
      const fileId = extractFileId(url);
      expect(fileId).toBe("12345");
    });

    it("should return null for an invalid Google Drive URL", () => {
      const url = "https://example.com/file/invalid";
      const fileId = extractFileId(url);
      expect(fileId).toBeNull();
    });
  });

  describe("uploadToGoogleDrive", () => {
    it("should upload a file to Google Drive and return the response data", async () => {
      const mockFile = {
        originalname: "testfile.txt",
        mimetype: "text/plain",
        buffer: Buffer.from("test content"),
      };
      const mockFolderId = "folder123";
      const mockResponse = {
        id: "file123",
        webViewLink: "https://drive.google.com/file/d/file123/view",
      };

      drive.files.create.mockResolvedValue({ data: mockResponse });

      const response = await uploadToGoogleDrive(mockFile, mockFolderId);

      expect(drive.files.create).toHaveBeenCalledWith({
        resource: {
          name: mockFile.originalname,
          parents: [mockFolderId],
        },
        media: {
          mimeType: mockFile.mimetype,
          body: mockFile.buffer,
        },
        fields: "id, webViewLink",
      });

      expect(response).toEqual(mockResponse);
    });
  });

  describe("deleteFromGoogleDrive", () => {
    it("should delete a file from Google Drive if the file ID is valid", async () => {
      const mockFilePath = "https://drive.google.com/file/d/12345/view";

      await deleteFromGoogleDrive(mockFilePath);

      expect(drive.files.delete).toHaveBeenCalledWith({ fileId: "12345" });
    });

    it("should not call delete if the file ID is invalid", async () => {
      const mockFilePath = "https://example.com/file/invalid";

      await deleteFromGoogleDrive(mockFilePath);
    });
  });
});
