import express from "express";
import { getTeam, updateTeamPhase } from "../controllers/teamController.js";
const router = express.Router();

router.get("/getteam", getTeam);
router.get("/updateteamphase", updateTeamPhase);

export default router;
