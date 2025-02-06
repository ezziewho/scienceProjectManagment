import express from "express";
import {
  getExpensesByCategory,
  createExpense,
  approveExpense,
  getBudgetSummary,
  getPlannedBudget,
  editPlannedBudget,
} from "../controllers/budgetController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", isAuthenticated, getBudgetSummary);
router.get("/planned", isAuthenticated, getPlannedBudget);
router.get("/:cat", isAuthenticated, getExpensesByCategory);

// Tworzenie nowego wydatku
router.post("/create", isAuthenticated, createExpense);

// Zatwierdzanie wydatku przez administratora (isAdmin)
router.put("/approve", isAuthenticated, isAdmin, approveExpense);

router.put("/:id", editPlannedBudget); // Aktualizacja wpisu budżetu

export default router;
