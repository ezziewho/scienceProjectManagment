import { Team } from "../models/index.js";

export const getTeam = async (req, res) => {
  try {
    console.log("Session data:", req.session); // Log sesji
    console.log("Session userId:", req.session.userId); // Sprawdzenie sesji
    console.log("Session teamId:", req.session.teamId); // Sprawdzenie sesji

    if (!req.session.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const team = await Team.findByPk(req.session.teamId);

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Zaktualizuj zadanie
export const updateTeamPhase = async (req, res) => {
  //update team phase by team id from session. new phase is "true"
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const team = await Team.findByPk(req.session.teamId);
    team.phase = true;
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
