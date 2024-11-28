import express from "express";
import { checkAuth } from "../controllers/userController.js";

const router = express.Router();

router.get("/checkauth", checkAuth);

export default router;
