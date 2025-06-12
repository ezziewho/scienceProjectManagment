import { formatTasks, fetchTasks } from "../utils/kanbanUtils.js";
import { Task, User } from "../models/index.js";
import { Op } from "sequelize";

jest.mock("../models/index.js", () => ({
  Task: {
    findAll: jest.fn(),
  },
  User: {},
}));

describe("kanbanUtils", () => {
  describe("formatTasks", () => {
    it("should format tasks correctly", () => {
      const tasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          stage: "To Do",
          dueDate: "2023-10-01",
          phase: "Phase 1",
          Users: [{ name: "User A" }, { name: "User B" }],
        },
      ];

      const formattedTasks = formatTasks(tasks);

      expect(formattedTasks).toEqual([
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          stage: "To Do",
          dueDate: "2023-10-01",
          phase: "Phase 1",
          usersResponsible: "User A, User B",
        },
      ]);
    });
  });

  describe("fetchTasks", () => {
    it("should fetch tasks with the correct filters", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          stage: "To Do",
          dueDate: "2023-10-01",
          phase: "Phase 1",
          Users: [{ id: 1, name: "User A" }],
        },
      ];

      Task.findAll.mockResolvedValue(mockTasks);

      const whereCondition = { stage: "To Do" };
      const responsibleUsers = "User A";

      const tasks = await fetchTasks(whereCondition, responsibleUsers);

      expect(Task.findAll).toHaveBeenCalledWith({
        where: whereCondition,
        include: [
          {
            model: User,
            attributes: ["id", "name"],
            where: { name: { [Op.like]: `%User A%` } },
            through: { attributes: [] },
          },
        ],
      });

      expect(tasks).toEqual(mockTasks);
    });
  });
});
