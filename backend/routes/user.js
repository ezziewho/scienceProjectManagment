import express from "express";
import { signup  } from "../controllers/authController.js";
import { checkAuth,  updateUser, deleteUser, getUsers  } from "../controllers/userController.js";
const router = express.Router();

router.get("/checkauth", checkAuth);
router.get("/team", getUsers);
router.post("/team", signup);
router.put("/team/:id", updateUser);
router.delete("/team/:id", deleteUser);

export default router;
