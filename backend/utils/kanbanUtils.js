import { Task, User } from "../models/index.js";
import { Op } from "sequelize";

// Helper function to format tasks
export const formatTasks = (tasks) => {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    stage: task.stage,
    dueDate: task.dueDate,
    phase: task.phase,
    usersResponsible: task.Users.map((user) => user.name).join(", "),
  }));
};

// Helper function to fetch tasks with filters
export const fetchTasks = async (whereCondition, responsibleUsers) => {
  return await Task.findAll({
    where: whereCondition,
    include: [
      {
        model: User,
        attributes: ["id", "name"],
        ...(responsibleUsers && {
          where: { name: { [Op.like]: `%${responsibleUsers}%` } },
        }),
        through: { attributes: [] },
      },
    ],
  });
};
