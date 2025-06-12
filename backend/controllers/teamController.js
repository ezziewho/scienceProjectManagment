import { Team } from "../models/index.js";
import { getTeamPhase } from "../utils/teamUtils.js";

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

// export const getTeamPhase = async (session) => {
//   // Get team phase by team ID from session. Returns true, false, or throws an error.
//   try {
//     if (!session.userId) {
//       throw new Error("User not authenticated");
//     }
//     const team = await Team.findByPk(session.teamId);
//     if (!team) {
//       throw new Error("Team not found");
//     }
//     return team.phase; // Returns true or false
//   } catch (err) {
//     console.error("Error in getTeamPhase:", err.message);
//     throw err; // Propagate the error to the caller
//   }
// };

export const validateOrCreateTeam = async (team_id, team_name, res) => {
  if (team_id) {
    const team = await Team.findOne({ where: { id: team_id } });
    if (!team) {
      res.status(400).json({ error: "Team not found" });
      return null; // Return null to indicate failure
    }
    return team.id; // Return the existing team ID
  } else if (team_name) {
    const newTeam = await Team.create({ name: team_name });
    return newTeam.id; // Return the new team ID
  } else {
    res.status(400).json({ error: "Must join or create a team" });
    return null; // Return null to indicate failure
  }
};
