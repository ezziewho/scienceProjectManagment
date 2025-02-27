import request from "supertest";
import express from "express";
import session from "express-session";
import {
  uploadTaskDocument,
  uploadTeamDocument,
  getTaskFiles,
  getTeamFiles,
  deleteFile,
  downloadFile,
  getExpenseModels,
  getExpenseFiles,
  getFilesByCategory,
  uploadExpenseDocument,
  downloadExpenseFile,
  deleteExpenseFile,
  getAllFilesAdmin,
} from "../controllers/documentController.js";
import drive from "../config/googleDrive.js";
import { ExpenseFile, TaskFile, TeamFile } from "../models/index.js";
import sessionConfig from "../config/session.js";
import multer from "multer";

jest.mock("../models/index.js");
jest.mock("../config/googleDrive.js", () => ({
  files: {
    create: jest.fn(),
  },
}));

const setupTestApp = (sessionData = {}, routes = []) => {
  const testApp = express();
  testApp.use(express.json());

  testApp.use(session(sessionConfig));

  // Mock session middleware
  testApp.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  // Dynamiczne ustawienie sesji
  testApp.use((req, res, next) => {
    Object.assign(req.session, sessionData); // ✅ Bezpośrednio nadpisujemy `req.session`
    //console.log("✅ Mock Session Data:", req.session);
    next();
  });

  // Dynamiczne dodawanie tras
  routes.forEach(({ path, handler, method = "get" }) => {
    testApp[method](path, handler);
  });

  return testApp;
};

describe("Document Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadTaskDocument", () => {
    let testApp;

    beforeEach(() => {
      const upload = multer({ storage: multer.memoryStorage() });

      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/upload/task-file",
            //handler: uploadTaskDocument,
            handler: [upload.single("file"), uploadTaskDocument],
            method: "post",
          },
        ] // Trasy
      );
    });

    it("should upload a task document to Google Drive and save in the database", async () => {
      const mockFile = {
        originalname: "testfile.txt",
        mimetype: "text/plain",
        filename: "testfile.txt",
        buffer: Buffer.from("test content"),
      };
      const mockDriveResponse = {
        data: {
          id: "driveFileId",
          webViewLink: "https://drive.google.com/file/d/driveFileId/view",
        },
      };
      drive.files.create.mockResolvedValue(mockDriveResponse);
      TaskFile.create.mockResolvedValue({
        file_name: mockFile.originalname,
        file_path: mockDriveResponse.data.webViewLink,
        task_id: 1,
        uploaded_by: 1,
        description: null,
      });

      const response = await request(testApp)
        .post("/upload/task-file")
        .field("task_id", 1)
        .field("user_id", 1)
        .attach("file", Buffer.from("test content"), "testfile.txt");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Plik przesłany do Google Drive i zapisany w bazie!"
      );
      expect(response.body.file.fileId).toBe("driveFileId");
      expect(response.body.file.fileUrl).toBe(
        "https://drive.google.com/file/d/driveFileId/view"
      );
    });

    it("should return 400 if no file is provided", async () => {
      const response = await request(testApp).post("/upload/task-file");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Brak pliku do przesłania.");
    });
  });

  describe("uploadTeamDocument", () => {
    let testApp;

    beforeEach(() => {
      const upload = multer({ storage: multer.memoryStorage() }); // ✅ Ensure `memoryStorage()` is used

      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/upload/team-file",
            //handler: uploadTeamDocument,
            handler: [upload.single("file"), uploadTeamDocument], // ✅ Apply multer middleware
            method: "post",
          },
        ] // Trasy
      );
    });

    it("should upload a team document to Google Drive and save in the database", async () => {
      const mockFile = {
        originalname: "testfile.txt",
        mimetype: "text/plain",
        filename: "testfile.txt",
        buffer: Buffer.from("test content"),
      };
      const mockDriveResponse = {
        data: {
          id: "driveFileId",
          webViewLink: "https://drive.google.com/file/d/driveFileId/view",
        },
      };
      drive.files.create.mockResolvedValue(mockDriveResponse);
      TeamFile.create.mockResolvedValue({
        file_name: mockFile.originalname,
        file_path: mockDriveResponse.data.webViewLink,
        user_id: 1,
        uploaded_by: 1,
        description: null,
      });

      const response = await request(testApp)
        .post("/upload/team-file")
        .field("user_id", 1)
        .attach("file", Buffer.from("test content"), mockFile.originalname);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Plik przesłany do Google Drive i zapisany w bazie!"
      );
      expect(response.body.file.fileId).toBe("driveFileId");
      expect(response.body.file.fileUrl).toBe(
        "https://drive.google.com/file/d/driveFileId/view"
      );
    });

    it("should return 400 if no file is provided", async () => {
      const response = await request(testApp).post("/upload/team-file");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Brak pliku do przesłania.");
    });
  });

  describe("getTaskFiles", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/task-files/:taskId", handler: getTaskFiles }] // Trasy
      );
    });

    it("should return task files for a valid task ID", async () => {
      const mockFiles = [
        { id: 1, file_name: "file1.txt" },
        { id: 2, file_name: "file2.txt" },
      ];
      TaskFile.findAll.mockResolvedValue(mockFiles);

      const response = await request(testApp).get("/task-files/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFiles);
    });
  });

  describe("getTeamFiles", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/team-files/:userId", handler: getTeamFiles }] // Trasy
      );
    });

    it("should return team files for a valid user ID", async () => {
      const mockFiles = [
        { id: 1, file_name: "file1.txt" },
        { id: 2, file_name: "file2.txt" },
      ];
      TeamFile.findAll.mockResolvedValue(mockFiles);

      const response = await request(testApp).get("/team-files/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFiles);
    });
  });

  describe("deleteFile", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/delete/:category/:fileId",
            handler: deleteFile,
            method: "delete",
          },
        ] // Trasy
      );
    });

    it("should delete a file from Google Drive and database", async () => {
      const mockFile = {
        id: 1,
        file_name: "file1.txt",
        file_path: "https://drive.google.com/file/d/driveFileId/view",
      };
      TaskFile.findByPk.mockResolvedValue(mockFile);

      const response = await request(testApp).delete("/delete/task/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Plik został usunięty z bazy i Google Drive."
      );
    });

    it("should return 404 if file is not found", async () => {
      TaskFile.findByPk.mockResolvedValue(null);

      const response = await request(testApp).delete("/delete/task/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Plik nie istnieje.");
    });
  });

  describe("downloadFile", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/download/:category/:fileId", handler: downloadFile }] // Trasy
      );
    });

    it("should download a file from Google Drive", async () => {
      const mockFile = {
        id: 1,
        file_name: "file1.txt",
        file_path: "https://drive.google.com/file/d/driveFileId/view",
      };
      const mockDriveFile = {
        headers: { "content-type": "text/plain" },
        data: {
          pipe: jest.fn(),
        },
      };
      TaskFile.findByPk.mockResolvedValue(mockFile);
      drive.files.get.mockResolvedValue(mockDriveFile);

      const response = await request(testApp).get("/download/task/1");

      expect(response.status).toBe(200);
      expect(drive.files.get).toHaveBeenCalledWith(
        { fileId: "driveFileId", alt: "media" },
        { responseType: "stream" }
      );
    });

    it("should return 404 if file is not found", async () => {
      TaskFile.findByPk.mockResolvedValue(null);

      const response = await request(testApp).get("/download/task/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Plik nie istnieje w bazie.");
    });
  });

  describe("getExpenseModels", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/expense-models", handler: getExpenseModels }] // Trasy
      );
    });

    it("should return expense models", async () => {
      const mockExpenseModels = [
        "equipment",
        "services",
        "indirect_costs",
        "open_access",
        "salaries",
        "travel",
        "others",
      ];

      const response = await request(testApp).get("/expense-models");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockExpenseModels);
    });
  });

  describe("getExpenseFiles", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/expense-files/:category/:expense_id",
            handler: getExpenseFiles,
          },
        ] // Trasy
      );
    });

    it("should return expense files for a valid category and expense ID", async () => {
      const mockFiles = [
        { id: 1, file_name: "file1.txt" },
        { id: 2, file_name: "file2.txt" },
      ];
      ExpenseFile.findAll.mockResolvedValue(mockFiles);

      const response = await request(testApp).get("/expense-files/equipment/1");

      expect(response.status).toBe(200);
      expect(response.body.files).toEqual(mockFiles);
    });

    it("should return 400 if required parameters are missing", async () => {
      const response = await request(testApp).get("/expense-files//");

      expect(response.status).toBe(404);
    });
  });

  describe("uploadExpenseDocument", () => {
    let testApp;

    beforeEach(() => {
      const upload = multer({ storage: multer.memoryStorage() }); // ✅ Ensure `memoryStorage()` is used
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/upload/expense",
            //handler: uploadExpenseDocument,
            handler: [upload.single("file"), uploadExpenseDocument], // ✅ Apply multer middleware
            method: "post",
          },
        ] // Trasy
      );
    });

    it("should upload an expense document to Google Drive and save in the database", async () => {
      const mockFile = {
        originalname: "testfile.txt",
        mimetype: "text/plain",
        filename: "testfile.txt",
        buffer: Buffer.from("test content"),
      };
      const mockDriveResponse = {
        data: {
          id: "driveFileId",
          webViewLink: "https://drive.google.com/file/d/driveFileId/view",
        },
      };
      drive.files.create.mockResolvedValue(mockDriveResponse);
      ExpenseFile.create.mockResolvedValue({
        id: 1,
        file_name: mockFile.originalname,
        file_path: mockDriveResponse.data.webViewLink,
        expense_id: 1,
        expense_category: "equipment",
        uploaded_by: 1,
        description: null,
      });

      const response = await request(testApp)
        .post("/upload/expense")
        .field("expense_id", 1)
        .field("expense_category", "equipment")
        .field("uploaded_by", 1)
        .attach("file", Buffer.from("test content"), mockFile.originalname);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Plik przesłany i zapisany w bazie!");
      //expect(response.body.file.fileId).toBe("driveFileId");
      /*
      expect(response.body.file.fileUrl).toBe(
        "https://drive.google.com/file/d/driveFileId/view"
      );
      */
    });

    it("should return 400 if no file is provided", async () => {
      const response = await request(testApp).post("/upload/expense");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Brak pliku do przesłania.");
    });
  });

  describe("downloadExpenseFile", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/download/expense/:fileId", handler: downloadExpenseFile }] // Trasy
      );
    });

    it("should download an expense file from Google Drive", async () => {
      const mockFile = {
        id: 1,
        file_name: "file1.txt",
        file_path: "https://drive.google.com/file/d/driveFileId/view",
      };
      const mockDriveFile = {
        headers: { "content-type": "text/plain" },
        data: {
          pipe: jest.fn(),
        },
      };
      ExpenseFile.findByPk.mockResolvedValue(mockFile);
      drive.files.get.mockResolvedValue(mockDriveFile);

      const response = await request(testApp).get("/download/expense/1");

      expect(response.status).toBe(200);
      expect(drive.files.get).toHaveBeenCalledWith(
        { fileId: "driveFileId", alt: "media" },
        { responseType: "stream" }
      );
    });

    it("should return 404 if file is not found", async () => {
      ExpenseFile.findByPk.mockResolvedValue(null);

      const response = await request(testApp).get("/download/expense/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Plik nie istnieje w bazie.");
    });
  });

  describe("deleteExpenseFile", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/delete/expense/:fileId",
            handler: deleteExpenseFile,
            method: "delete",
          },
        ] // Trasy
      );
    });

    it("should delete an expense file from Google Drive and database", async () => {
      const mockFile = {
        id: 1,
        file_name: "file1.txt",
        file_path: "https://drive.google.com/file/d/driveFileId/view",
      };
      ExpenseFile.findByPk.mockResolvedValue(mockFile);

      const response = await request(testApp).delete("/delete/expense/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Plik został usunięty.");
    });

    it("should return 404 if file is not found", async () => {
      ExpenseFile.findByPk.mockResolvedValue(null);

      const response = await request(testApp).delete("/delete/expense/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Plik nie istnieje.");
    });
  });

  describe("getAllFilesAdmin", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "admin" }, // Dane sesji
        [{ path: "/admin/files", handler: getAllFilesAdmin }] // Trasy
      );
    });

    it("should return a list of all files", async () => {
      const mockTaskFiles = [
        { id: 1, file_name: "taskfile1.txt" },
        { id: 2, file_name: "taskfile2.txt" },
      ];
      const mockTeamFiles = [
        { id: 3, file_name: "teamfile1.txt" },
        { id: 4, file_name: "teamfile2.txt" },
      ];
      const mockExpenseFiles = [
        { id: 5, file_name: "expensefile1.txt" },
        { id: 6, file_name: "expensefile2.txt" },
      ];
      TaskFile.findAll.mockResolvedValue(mockTaskFiles);
      TeamFile.findAll.mockResolvedValue(mockTeamFiles);
      ExpenseFile.findAll.mockResolvedValue(mockExpenseFiles);

      const response = await request(testApp).get("/admin/files");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        ...mockTaskFiles.map((file) => ({
          ...file,
          file_table_category: "task",
        })),
        ...mockTeamFiles.map((file) => ({
          ...file,
          file_table_category: "team",
        })),
        ...mockExpenseFiles.map((file) => ({
          ...file,
          file_table_category: "expense",
        })),
      ]);
    });
  });
});
