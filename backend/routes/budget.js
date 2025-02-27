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
// Zatwierdzanie wydatku przez administratora (isAdmin)
router.put("/approve", /*isAuthenticated, isAdmin,*/ approveExpense);
router.get("/:expense_category", isAuthenticated, getExpensesByCategory);

// Tworzenie nowego wydatku
router.post("/new/create", isAuthenticated, createExpense);

router.put("/:id", editPlannedBudget); // Aktualizacja wpisu budżetu

export default router;
