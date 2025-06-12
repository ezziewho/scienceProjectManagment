import { Team } from "../models/index.js";

export const getTeamPhase = async (session) => {
  // Get team phase by team ID from session. Returns true, false, or throws an error.
  try {
    if (!session.userId) {
      throw new Error("User not authenticated");
    }
    const team = await Team.findByPk(session.teamId);
    if (!team) {
      throw new Error("Team not found");
    }
    return team.phase; // Returns true or false
  } catch (err) {
    console.error("Error in getTeamPhase:", err.message);
    throw err; // Propagate the error to the caller
  }
};
