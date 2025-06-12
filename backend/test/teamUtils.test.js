import { getTeamPhase } from "../utils/teamUtils.js";
import { Team } from "../models/index.js";

jest.mock("../models/index.js", () => ({
  Team: {
    findByPk: jest.fn(),
  },
}));

describe("getTeamPhase", () => {
  it("should return the team phase if the user is authenticated and team exists", async () => {
    const mockSession = { userId: 1, teamId: 2 };
    const mockTeam = { id: 2, phase: true };

    Team.findByPk.mockResolvedValue(mockTeam);

    const result = await getTeamPhase(mockSession);

    expect(Team.findByPk).toHaveBeenCalledWith(mockSession.teamId);
    expect(result).toBe(true);
  });

  it("should throw an error if the user is not authenticated", async () => {
    const mockSession = { userId: null, teamId: 2 };

    await expect(getTeamPhase(mockSession)).rejects.toThrow(
      "User not authenticated"
    );
  });

  it("should throw an error if the team is not found", async () => {
    const mockSession = { userId: 1, teamId: 2 };

    Team.findByPk.mockResolvedValue(null);

    await expect(getTeamPhase(mockSession)).rejects.toThrow("Team not found");
  });

  it("should propagate errors from the database", async () => {
    const mockSession = { userId: 1, teamId: 2 };
    const mockError = new Error("Database error");

    Team.findByPk.mockRejectedValue(mockError);

    await expect(getTeamPhase(mockSession)).rejects.toThrow("Database error");
  });
});
