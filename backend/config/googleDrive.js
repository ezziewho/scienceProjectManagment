import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

// Zamiana `__dirname` dla ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export default drive;
