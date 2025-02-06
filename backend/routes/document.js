import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadDocument,
  getTaskFiles,
  getTeamFiles,
  deleteTaskFile,
  deleteTeamFile,
  deleteExpenseFile,
  getAllTaskFiles,
  downloadTaskFile,
  downloadTeamFile,
  downloadExpenseFile,
  getFilesByCategory,
  uploadExpenseDocument,
  getExpenseFiles,
  uploadTaskDocument,
  uploadTeamDocument,
  getExpenseModels,
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.post("/upload/task-file", upload.single("file"), uploadTaskDocument);
router.post("/upload/team-file", upload.single("file"), uploadTeamDocument);
router.post(
  "/upload/expense_files",
  upload.single("file"),
  uploadExpenseDocument
);
router.delete("/delete/task/:fileId", deleteTaskFile);
router.delete("/delete/team/:fileId", deleteTeamFile);
router.delete("/delete/expense/:fileId", deleteExpenseFile);

router.get("/download/task/:fileId", downloadTaskFile);
router.get("/download/team/:userId", downloadTeamFile);
router.get("/download/expense/:fileId", downloadExpenseFile);

router.get("/files/task/:taskId", getTaskFiles); // Pobiera pliki dla task_id
router.get("/files/team/:userId", getTeamFiles); // Pobiera pliki dla task_id
router.get("/files/expense/:category/:expense_id", getExpenseFiles);

router.get("/files/expense/", getExpenseModels);
router.get("/files/category/:filetable_category", getFilesByCategory);
/*router.post(
  "/upload/:filetable_category",
  upload.single("file"),
  uploadDocument
);*/

router.get("/files", getAllTaskFiles); // Pobiera wszystkie pliki
router.get("/files/task/:taskId", getTaskFiles); // Pobiera pliki dla task_id
router.delete("/files/:fileId", deleteTaskFile); // Usuwa plik

export default router;
