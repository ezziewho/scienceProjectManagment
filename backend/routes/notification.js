import express from "express";
import { getNotifications, markAsRead, addNotification } from "../controllers/notificationController.js";

const router = express.Router();

// Pobiera powiadomienia dla zalogowanego użytkownika
router.get("/", getNotifications);

// Oznacza powiadomienie jako przeczytane
router.put("/:id/read", markAsRead);

router.post("/add", addNotification);

export default router;  // Eksport jako domyślny moduł
