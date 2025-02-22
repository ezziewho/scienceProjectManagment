import drive from "../config/googleDrive.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  TaskFile,
  TeamFile,
  ExpenseFile,
  EquipmentAndSoftware,
  ExternalServices,
  IndirectCosts,
  OpenAccess,
  Salaries,
  TravelCosts,
  Others,
} from "../models/index.js"; // Zmienna z modelem TaskFile

// Konwersja ścieżek w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const __filename = __filename || __dirname; // Alternatywne podejście
//const __dirname = path.resolve();

const GOOGLE_DRIVE_FOLDER_ID = "1lzdTpFLoje5adS5_8jPxOfGNC_Klo8R7";

const fileModels = {
  task_files: TaskFile,
  team_files: TeamFile,
  expense_files: ExpenseFile,
};
// 🚀 Przesyłanie pliku do Google Drive
// 🚀 Przesyłanie pliku do Google Drive i zapisywanie w bazie
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

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath),
    };

    // Przesyłanie pliku do Google Drive
    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",
    });

    fs.unlinkSync(filePath); // Usuwamy plik lokalny po przesłaniu

    res.json({
      message: "Plik przesłany do Google Drive!",
      fileId: driveResponse.data.id,
      fileUrl: driveResponse.data.webViewLink,
    });
  } catch (error) {
    console.error("Błąd przesyłania pliku:", error);
    res.status(500).json({ error: "Błąd przesyłania pliku do Google Drive." });
  }
};

export const uploadTaskDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Brak pliku do przesłania." });
    }

    if (!req.body.task_id || !req.body.user_id) {
      return res.status(400).json({
        error: "Brak wymaganych identyfikatorów (task_id i user_id).",
      });
    }

    //const filePath = path.join(__dirname, "../uploads", req.file.filename);
    let filePath = null;

    if (!req.file.buffer) {
      filePath = path.join(__dirname, "../uploads", req.file.filename);
    }

    const fileMetadata = {
      name: req.file.originalname,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      //body: fs.createReadStream(filePath),
      body: req.file.buffer
        ? Buffer.from(req.file.buffer) // ✅ Use buffer for `memoryStorage()`
        : fs.createReadStream(
            path.join(__dirname, "../uploads", req.file.filename)
          ), // ✅ Use file path for `diskStorage()`
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",
    });
    if (filePath) {
      fs.unlinkSync(filePath); // Usuwamy plik lokalny po przesłaniu
    }
    console.log("📂 req.file:", req.file);
    console.log("📂 req.file.filename:", req.file?.originalname);
    // Zapis pliku w bazie danych
    const savedFile = await TaskFile.create({
      file_name: req.file.originalname,
      file_path: driveResponse.data.webViewLink,
      task_id: req.body.task_id,
      uploaded_by: req.body.user_id,
      description: req.body.description || null,
    });

    res.json({
      message: "Plik przesłany do Google Drive i zapisany w bazie!",
      file: {
        fileId: driveResponse.data.id,
        fileUrl: driveResponse.data.webViewLink,
        fileName: savedFile.file_name,
        description: savedFile.description,
        uploadedBy: savedFile.uploaded_by,
      },
    });
  } catch (error) {
    console.error("Błąd przesyłania pliku:", error);
    res.status(500).json({
      error: "Błąd przesyłania pliku do Google Drive lub bazy danych.",
    });
  }
};

export const uploadTeamDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Brak pliku do przesłania." });
    }

    if (!req.body.user_id) {
      return res.status(400).json({
        error: "Brak wymaganych identyfikatorów (user_id).",
      });
    }
    let filePath = null;

    if (!req.file.buffer) {
      filePath = path.join(__dirname, "../uploads", req.file.filename);
    }
    //const filePath = path.join(__dirname, "../uploads", req.file.filename);

    const fileMetadata = {
      name: req.file.originalname,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      //body: fs.createReadStream(filePath),
      body: req.file.buffer
        ? Buffer.from(req.file.buffer)
        : fs.createReadStream(
            path.join(__dirname, "../uploads", req.file.filename)
          ),
    };

    // Przesyłanie pliku do Google Drive
    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink",
    });

    if (filePath) {
      fs.unlinkSync(filePath); // Usuwamy plik lokalny po przesłaniu
    }

    // Zapis pliku w bazie danych
    const savedFile = await TeamFile.create({
      file_name: req.file.originalname,
      file_path: driveResponse.data.webViewLink,
      user_id: req.body.user_id,
      uploaded_by: req.body.user_id,
      description: req.body.description || null,
    });

    res.json({
      message: "Plik przesłany do Google Drive i zapisany w bazie!",
      file: {
        fileId: driveResponse.data.id,
        fileUrl: driveResponse.data.webViewLink,
        fileName: savedFile.file_name,
        description: savedFile.description,
        uploadedBy: savedFile.uploaded_by,
      },
    });
  } catch (error) {
    console.error("Błąd przesyłania pliku:", error);
    res.status(500).json({
      error: "Błąd przesyłania pliku do Google Drive lub bazy danych.",
    });
  }
};

export const getTaskFiles = async (req, res) => {
  try {
    const { taskId } = req.params;

    const files = await TaskFile.findAll({
      where: { task_id: taskId },
    });
    console.log("wysylam...", files);
    res.json(files);
  } catch (error) {
    console.error("Błąd pobierania plików:", error);
    res.status(500).json({ error: "Nie udało się pobrać plików." });
  }
};
export const getTeamFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await TeamFile.findAll({
      where: { user_id: userId },
    });

    res.json(files);
  } catch (error) {
    console.error("Błąd pobierania plików:", error);
    res.status(500).json({ error: "Nie udało się pobrać plików." });
  }
};

export const downloadTaskFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Pobieramy plik z bazy danych na podstawie fileId
    const file = await TaskFile.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje w bazie." });
    }

    // Funkcja do wyodrębnienia ID z linku Google Drive
    const extractFileId = (url) => {
      const match = url.match(/\/d\/(.*)\//);
      return match ? match[1] : null;
    };

    // Pobranie właściwego fileId z URL-a w bazie
    const driveFileId = extractFileId(file.file_path);
    if (!driveFileId) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy link do pliku w Google Drive." });
    }

    // Pobranie pliku jako strumień z Google Drive
    const driveFile = await drive.files.get(
      { fileId: driveFileId, alt: "media" },
      { responseType: "stream" }
    );

    // Ustawienie odpowiednich nagłówków
    res.setHeader("Content-Type", driveFile.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.file_name}"`
    );

    // Przesyłanie pliku do użytkownika
    driveFile.data.pipe(res);
  } catch (error) {
    console.error("Błąd pobierania pliku:", error);

    // Obsługa błędów Google Drive (np. brak dostępu)
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: "Brak dostępu do pliku." });
    }

    res.status(500).json({ error: "Nie udało się pobrać pliku." });
  }
};

export const downloadTeamFile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Pobieramy plik z bazy danych na podstawie fileId
    const file = await TeamFile.findByPk(userId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje w bazie." });
    }

    // Funkcja do wyodrębnienia ID z linku Google Drive
    const extractFileId = (url) => {
      const match = url.match(/\/d\/(.*)\//);
      return match ? match[1] : null;
    };

    // Pobranie właściwego fileId z URL-a w bazie
    const driveFileId = extractFileId(file.file_path);
    if (!driveFileId) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy link do pliku w Google Drive." });
    }

    // Pobranie pliku jako strumień z Google Drive
    const driveFile = await drive.files.get(
      { fileId: driveFileId, alt: "media" },
      { responseType: "stream" }
    );

    // Ustawienie odpowiednich nagłówków
    res.setHeader("Content-Type", driveFile.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.file_name}"`
    );

    // Przesyłanie pliku do użytkownika
    driveFile.data.pipe(res);
  } catch (error) {
    console.error("Błąd pobierania pliku:", error);

    // Obsługa błędów Google Drive (np. brak dostępu)
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: "Brak dostępu do pliku." });
    }

    res.status(500).json({ error: "Nie udało się pobrać pliku." });
  }
};

export const deleteTaskFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log("Otrzymane parametry:", req.params); // 👀 Sprawdź, jakie ID dociera
    // Znalezienie pliku w bazie danych
    const file = await TaskFile.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje." });
    }

    // Usunięcie pliku z Google Drive
    const driveFileId = file.file_path.split("/d/")[1]?.split("/")[0]; // Pobranie ID pliku z URL-a
    if (driveFileId) {
      await drive.files.delete({ fileId: driveFileId });
    }

    // Usunięcie wpisu z bazy danych
    await file.destroy();

    res.json({ message: "Plik został usunięty." });
  } catch (error) {
    console.error("Błąd usuwania pliku:", error);
    res.status(500).json({ error: "Nie udało się usunąć pliku." });
  }
};

export const deleteTeamFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log("Otrzymane parametry:", req.params); // 👀 Sprawdź, jakie ID dociera
    // Znalezienie pliku w bazie danych
    const file = await TeamFile.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje." });
    }

    // Usunięcie pliku z Google Drive
    const driveFileId = file.file_path.split("/d/")[1]?.split("/")[0]; // Pobranie ID pliku z URL-a
    if (driveFileId) {
      await drive.files.delete({ fileId: driveFileId });
    }

    // Usunięcie wpisu z bazy danych
    await file.destroy();

    res.json({ message: "Plik został usunięty." });
  } catch (error) {
    console.error("Błąd usuwania pliku:", error);
    res.status(500).json({ error: "Nie udało się usunąć pliku." });
  }
};

export const getAllTaskFiles = async (req, res) => {
  try {
    const files = await TaskFile.findAll();
    res.json({ files });
  } catch (error) {
    console.error("Błąd pobierania wszystkich plików:", error);
    res.status(500).json({ error: "Nie udało się pobrać plików." });
  }
};

// Pobieranie plików według kategorii
export const getFilesByCategory = async (req, res) => {
  console.log("🔥 API /files/:filetable_category zostało wywołane!");
  try {
    console.log("🔥 API /files/:filetable_category zostało wywołane!");
    const { filetable_category } = req.params;
    console.log(`📌 Pobieranie plików dla kategorii: ${filetable_category}`);

    const Model = fileModels[filetable_category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${filetable_category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria plików" });
    }

    const files = await Model.findAll();
    console.log(
      `✅ Pobranie zakończone sukcesem. Znaleziono ${files.length} rekordów.`
    );
    res.status(200).json(files);
  } catch (error) {
    console.error("❌ Błąd podczas pobierania plików:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
};

//////EXPENSE

const expenseModels = {
  equipment: EquipmentAndSoftware,
  services: ExternalServices,
  indirect_costs: IndirectCosts,
  open_access: OpenAccess,
  salaries: Salaries,
  travel: TravelCosts,
  others: Others,
};

export const getExpenseModels = async (req, res) => {
  try {
    console.log("Fetching expense categories...");
    console.log("Expense Models:", expenseModels); // Debug

    if (!expenseModels || Object.keys(expenseModels).length === 0) {
      throw new Error("expenseModels is empty or undefined");
    }

    const categories = Object.keys(expenseModels);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Błąd pobierania kategorii budżetowych:", error.message);
    res.status(500).json({ error: "Błąd pobierania kategorii budżetowych." });
  }
};

export const getExpenseFiles = async (req, res) => {
  try {
    const { category, expense_id } = req.params;

    console.log(
      `📌 Pobieranie plików dla wydatku ${expense_id} w kategorii ${category}`
    );

    if (!category || !expense_id) {
      return res
        .status(400)
        .json({ error: "Brak wymaganych parametrów (category, expense_id)." });
    }

    const files = await ExpenseFile.findAll({
      where: { expense_id, category },
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Błąd pobierania plików:", error);
    res.status(500).json({ error: "Błąd pobierania plików." });
  }
};

export const uploadExpenseDocument = async (req, res) => {
  try {
    console.log("📥 Otrzymane body w backendzie:", req.body);
    console.log("📂 Otrzymany plik w backendzie:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Brak pliku do przesłania." });
    }

    const { expense_id, category, uploaded_by, file_description } = req.body;

    if (!expense_id || !category || !uploaded_by) {
      return res.status(400).json({
        error: "Brak wymaganych danych (expense_id, category, uploaded_by).",
      });
    }

    console.log(
      `📌 Przetwarzanie pliku dla expense_id: ${expense_id}, category: ${category}, uploaded_by: ${uploaded_by}`
    );

    let filePath = null;

    if (!req.file.buffer) {
      filePath = path.join(__dirname, "../uploads", req.file.filename);
    }

    let uploadedFileUrl = null;

    if (GOOGLE_DRIVE_FOLDER_ID) {
      try {
        const fileMetadata = {
          name: req.file.originalname,
          parents: [GOOGLE_DRIVE_FOLDER_ID],
        };
        const media = {
          mimeType: req.file.mimetype,
          //body: fs.createReadStream(filePath),
          body: req.file.buffer
            ? Buffer.from(req.file.buffer)
            : fs.createReadStream(
                path.join(__dirname, "../uploads", req.file.filename)
              ),
        };

        const driveResponse = await drive.files.create({
          resource: fileMetadata,
          media,
          fields: "id, webViewLink",
        });

        uploadedFileUrl = driveResponse.data.webViewLink;
        if (filePath) {
          fs.unlinkSync(filePath); // Usuwamy plik lokalny po przesłaniu
        }
      } catch (error) {
        console.error(
          "❌ Błąd usuwania pliku lub przesyłania na Google Drive:",
          error
        );
      }
    }

    const expenseFile = await ExpenseFile.create({
      file_name: req.file.originalname,
      file_path: uploadedFileUrl || filePath,
      expense_id,
      category,
      uploaded_by,
      description: file_description || null,
    });

    res.json({
      message: "Plik przesłany i zapisany w bazie!",
      file: {
        id: expenseFile.id,
        fileName: expenseFile.file_name,
        filePath: expenseFile.file_path,
        category: expenseFile.category,
        expenseId: expenseFile.expense_id,
        uploadedBy: expenseFile.uploaded_by,
        description: expenseFile.description,
      },
    });
  } catch (error) {
    console.error("❌ Błąd przesyłania pliku:", error);
    res.status(500).json({ error: "Błąd przesyłania pliku." });
  }
};

export const downloadExpenseFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Pobieramy plik z bazy danych na podstawie fileId
    const file = await ExpenseFile.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje w bazie." });
    }

    // Funkcja do wyodrębnienia ID z linku Google Drive
    const extractFileId = (url) => {
      const match = url.match(/\/d\/(.*)\//);
      return match ? match[1] : null;
    };

    // Pobranie właściwego fileId z URL-a w bazie
    const driveFileId = extractFileId(file.file_path);
    if (!driveFileId) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy link do pliku w Google Drive." });
    }

    // Pobranie pliku jako strumień z Google Drive
    const driveFile = await drive.files.get(
      { fileId: driveFileId, alt: "media" },
      { responseType: "stream" }
    );

    // Ustawienie odpowiednich nagłówków
    res.setHeader("Content-Type", driveFile.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.file_name}"`
    );

    // Przesyłanie pliku do użytkownika
    driveFile.data.pipe(res);
  } catch (error) {
    console.error("Błąd pobierania pliku:", error);

    // Obsługa błędów Google Drive (np. brak dostępu)
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: "Brak dostępu do pliku." });
    }

    res.status(500).json({ error: "Nie udało się pobrać pliku." });
  }
};

export const deleteExpenseFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    console.log("Otrzymane parametry:", req.params); // 👀 Sprawdź, jakie ID dociera
    // Znalezienie pliku w bazie danych
    const file = await ExpenseFile.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje." });
    }

    // Usunięcie pliku z Google Drive
    const driveFileId = file.file_path.split("/d/")[1]?.split("/")[0]; // Pobranie ID pliku z URL-a
    if (driveFileId) {
      await drive.files.delete({ fileId: driveFileId });
    }

    // Usunięcie wpisu z bazy danych
    await file.destroy();

    res.json({ message: "Plik został usunięty." });
  } catch (error) {
    console.error("Błąd usuwania pliku:", error);
    res.status(500).json({ error: "Nie udało się usunąć pliku." });
  }
};
//ADMIN
export const getAllFilesAdmin = async (req, res) => {
  try {
    const taskFiles = await TaskFile.findAll();
    const teamFiles = await TeamFile.findAll();
    const expenseFiles = await ExpenseFile.findAll();

    const allFiles = [
      ...taskFiles.map((file) => ({
        ...file.dataValues,
        file_table_category: "task",
      })),
      ...teamFiles.map((file) => ({
        ...file.dataValues,
        file_table_category: "team",
      })),
      ...expenseFiles.map((file) => ({
        ...file.dataValues,
        file_table_category: "expense",
      })),
    ];

    res.json(allFiles);
  } catch (error) {
    console.error("Błąd pobierania wszystkich plików:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId, category } = req.params;

    // Mapa tabel na modele Sequelize
    const fileModels = {
      task: TaskFile,
      team: TeamFile,
      budget: ExpenseFile,
    };

    const Model = fileModels[category];

    if (!Model) {
      return res.status(400).json({ error: "Nieprawidłowa kategoria plików." });
    }

    // Znalezienie pliku w bazie
    const file = await Model.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje." });
    }

    // Pobranie Google Drive ID
    const extractFileId = (url) => {
      const match = url.match(/\/d\/(.*)\//);
      return match ? match[1] : null;
    };

    const driveFileId = extractFileId(file.file_path);
    if (driveFileId) {
      await drive.files.delete({ fileId: driveFileId });
    }

    // Usunięcie wpisu z bazy danych
    await file.destroy();

    res.json({ message: "Plik został usunięty z bazy i Google Drive." });
  } catch (error) {
    console.error("Błąd usuwania pliku:", error);
    res.status(500).json({ error: "Nie udało się usunąć pliku." });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId, category } = req.params;

    const fileModels = {
      task: TaskFile,
      team: TeamFile,
      budget: ExpenseFile,
    };

    const Model = fileModels[category];

    // Pobieramy plik z bazy danych na podstawie fileId
    const file = await Model.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: "Plik nie istnieje w bazie." });
    }

    // Funkcja do wyodrębnienia ID z linku Google Drive
    const extractFileId = (url) => {
      const match = url.match(/\/d\/(.*)\//);
      return match ? match[1] : null;
    };

    // Pobranie właściwego fileId z URL-a w bazie
    const driveFileId = extractFileId(file.file_path);
    if (!driveFileId) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy link do pliku w Google Drive." });
    }

    // Pobranie pliku jako strumień z Google Drive
    const driveFile = await drive.files.get(
      { fileId: driveFileId, alt: "media" },
      { responseType: "stream" }
    );

    // Ustawienie odpowiednich nagłówków
    res.setHeader("Content-Type", driveFile.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.file_name}"`
    );

    // Przesyłanie pliku do użytkownika
    driveFile.data.pipe(res);
  } catch (error) {
    console.error("Błąd pobierania pliku:", error);

    // Obsługa błędów Google Drive (np. brak dostępu)
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: "Brak dostępu do pliku." });
    }

    res.status(500).json({ error: "Nie udało się pobrać pliku." });
  }
};
