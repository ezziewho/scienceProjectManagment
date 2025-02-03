import drive from "../config/googleDrive.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Konwersja ścieżek w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_DRIVE_FOLDER_ID = "1lzdTpFLoje5adS5_8jPxOfGNC_Klo8R7";

// 🚀 Przesyłanie pliku do Google Drive
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Brak pliku do przesłania." });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const fileMetadata = {
      name: req.file.originalname,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    };
    const media = { mimeType: req.file.mimetype, body: fs.createReadStream(filePath) };

    // Przesyłanie pliku do Google Drive
    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",
    });

    fs.unlinkSync(filePath); // Usuwamy plik po przesłaniu

    res.json({
      message: "Plik przesłany!",
      fileId: driveResponse.data.id,
      fileUrl: driveResponse.data.webViewLink,
    });
  } catch (error) {
    console.error("Błąd przesyłania pliku:", error);
    res.status(500).json({ error: "Błąd przesyłania pliku do Google Drive." });
  }
};
