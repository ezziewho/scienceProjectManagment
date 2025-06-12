import request from "supertest";
import express from "express";
import session from "express-session";
import {
  getTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getStages,
} from "../controllers/kanbanController.js";
import { Task, User } from "../models/index.js";
import sessionConfig from "../config/session.js";

jest.mock("../models/index.js");

const setupTestApp = (sessionData = {}, routes = []) => {
  const testApp = express();
  testApp.use(express.json());

  testApp.use(session(sessionConfig));

  // Mock session middleware
  testApp.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  // Dynamiczne ustawienie sesji
  testApp.use((req, res, next) => {
    Object.assign(req.session, sessionData); // ✅ Bezpośrednio nadpisujemy `req.session`
    console.log("✅ Mock Session Data:", req.session);
    next();
  });

  // Dynamiczne dodawanie tras
  routes.forEach(({ path, handler, method = "get" }) => {
    testApp[method](path, handler);
  });

  return testApp;
};

describe("Kanban Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/tasks", handler: getTasks }] // Trasy
      );
    });

    it("should return a list of tasks if user is authorized", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          Users: [{ id: 1, name: "User One" }],
        },
        {
          id: 2,
          title: "Task Two",
          description: "Description Two",
          stage: "In Progress",
          dueDate: "2025-02-21",
          Users: [{ id: 1, name: "User One" }],
        },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const response = await request(testApp).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          usersResponsible: "User One",
        },
        {
          id: 2,
          title: "Task Two",
          description: "Description Two",
          stage: "In Progress",
          dueDate: "2025-02-21",
          usersResponsible: "User One",
        },
      ]);
    });

    it("should return 401 if user is not authorized", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/tasks", handler: getTasks }] // Trasy
      );

      const response = await request(noSessionApp).get("/tasks");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("getAllTasks", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, teamId: 1 }, // Dane sesji
        [{ path: "/all-tasks", handler: getAllTasks }] // Trasy
      );
    });

    it("should return a list of all tasks", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          Users: [{ id: 1, name: "User One" }],
        },
        {
          id: 2,
          title: "Task Two",
          description: "Description Two",
          stage: "In Progress",
          dueDate: "2025-02-21",
          Users: [{ id: 1, name: "User One" }],
        },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const response = await request(testApp).get("/all-tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          usersResponsible: "User One",
        },
        {
          id: 2,
          title: "Task Two",
          description: "Description Two",
          stage: "In Progress",
          dueDate: "2025-02-21",
          usersResponsible: "User One",
        },
      ]);
    });

    it("should return tasks matching all filters", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          phase: 1,
          Users: [{ id: 1, name: "User One" }],
        },
        {
          id: 2,
          title: "Task Two",
          description: "Description Two",
          stage: "In Progress",
          dueDate: "2025-02-21",
          phase: 0,
          Users: [{ id: 2, name: "User Two" }],
        },
      ];

      // Mock the database response
      Task.findAll.mockResolvedValue([mockTasks[0]]); // Only the first task matches all filters

      const response = await request(testApp).get("/all-tasks").query({
        title: "Task One",
        stage: "To Do",
        dueDate: "2025-02-20",
        responsibleUsers: "User One",
        phase: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          title: "Task One",
          description: "Description One",
          stage: "To Do",
          dueDate: "2025-02-20",
          phase: 1,
          usersResponsible: "User One",
        },
      ]);
    });
  });

  describe("createTask", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, teamId: 1 }, // Dane sesji
        [{ path: "/tasks", handler: createTask, method: "post" }] // Trasy
      );
    });

    it("should create a new task", async () => {
      const mockTask = {
        id: 1,
        title: "New Task",
        description: "New Description",
        stage: "To Do",
        dueDate: "2025-02-20",
        //Users: [{ name: "User One", email: "user1@example.com" }],
        addUsers: jest.fn().mockResolvedValue(), // ✅ Mockowanie `addUsers()`
        Users: [{ name: "User One", email: "user1@example.com" }],
      };
      const mockUsers = [{ name: "User One", email: "user1@example.com" }];

      Task.create.mockResolvedValue(mockTask);
      User.findAll.mockResolvedValue(mockUsers); // ✅ Mockowanie `User.findAll`
      Task.findOne.mockResolvedValue(mockTask);

      const response = await request(testApp)
        .post("/tasks")
        .send({
          title: "New Task",
          description: "New Description",
          stage: "To Do",
          dueDate: "2025-02-20",
          phase: 1,
          assignedUsers: ["User One"],
        });

      expect(response.status).toBe(200);
      // expect(response.body).toEqual({
      //   id: 1,
      //   title: "New Task",
      //   description: "New Description",
      //   stage: "To Do",
      //   dueDate: "2025-02-20",
      //   phase: 1,
      //   assignedUsers: [{ name: "User One", email: "user1@example.com" }],
      // });
    });

    it("should return 401 if user is not authorized", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/tasks", handler: createTask, method: "post" }] // Trasy
      );

      const response = await request(noSessionApp)
        .post("/tasks")
        .send({
          title: "New Task",
          description: "New Description",
          stage: "To Do",
          dueDate: "2025-02-20",
          assignedUsers: ["User One"],
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("updateTask", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/tasks/:id", handler: updateTask, method: "put" }] // Trasy
      );
    });

    it("should update an existing task", async () => {
      Task.update.mockResolvedValue([1]);

      const response = await request(testApp).put("/tasks/1").send({
        title: "Updated Task",
        description: "Updated Description",
        stage: "In Progress",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "1",
        title: "Updated Task",
        description: "Updated Description",
        stage: "In Progress",
      });
    });

    it("should return 404 if task is not found", async () => {
      Task.update.mockResolvedValue([0]);

      const response = await request(testApp).put("/tasks/1").send({
        title: "Updated Task",
        description: "Updated Description",
        stage: "In Progress",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("deleteTask", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/tasks/:id", handler: deleteTask, method: "delete" }] // Trasy
      );
    });

    it("should delete an existing task", async () => {
      Task.destroy.mockResolvedValue(1);

      const response = await request(testApp).delete("/tasks/1");

      expect(response.status).toBe(200);
    });

    it("should return 404 if task is not found", async () => {
      Task.destroy.mockResolvedValue(0);

      const response = await request(testApp).delete("/tasks/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Task not found");
    });
  });

  describe("getStages", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/stages", handler: getStages }] // Trasy
      );
    });

    it("should return a list of stages", async () => {
      const mockStages = ["To Do", "In Progress", "Done"];
      Task.getAttributes = jest.fn().mockReturnValue({
        stage: { values: mockStages },
      });

      const response = await request(testApp).get("/stages");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStages);
    });
  });
});
