import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Konwersja __dirname w trybie ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguracja Multer – zapis tymczasowy przed wysłaniem do Google Drive
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Pliki zapisywane w katalogu `uploads`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unikalna nazwa pliku
  },
});

const upload = multer({ storage });

export default upload;
