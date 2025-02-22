import request from "supertest";
import express from "express";
import session from "express-session";
import {
  checkAuth,
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import User from "../models/User.js";
import sessionConfig from "../config/session.js";

jest.mock("../models/User");

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

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkAuth", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "admin" }, // Dane sesji
        [{ path: "/checkAuth", handler: checkAuth }] // Trasy
      );
      console.log("✅ Session inside testApp:", testApp.session);
    });

    it("should return valid true if user is logged in", async () => {
      const response = await request(testApp).get("/checkAuth");

      console.log("🔍 Jest received response body:", response.body);

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
      expect(response.body.role).toBe("admin");
      expect(response.body.userId).toBe(1);
    }, 10000); // Zwiększ timeout do 10 sekund

    it("should return valid false if user is not logged in", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/checkAuth", handler: checkAuth }] // Trasy
      );

      const response = await request(noSessionApp).get("/checkAuth");

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(false);
    }, 10000); // Zwiększ timeout do 10 sekund
  });

  describe("getUsers", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "admin" }, // Dane sesji
        [{ path: "/users", handler: getUsers }] // Trasy
      );
    });

    it("should return a list of users if user is authorized", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "User One",
          email: "user1@example.com",
          role: "user",
          position: "Developer",
        },
        {
          id: 2,
          name: "User Two",
          email: "user2@example.com",
          role: "admin",
          position: "Manager",
        },
      ];
      User.findAll.mockResolvedValue(mockUsers);

      const response = await request(testApp).get("/users");

      console.log("🔍 Jest received response body:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    }, 10000); // Zwiększ timeout do 10 sekund

    it("should return 401 if user is not authorized", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/users", handler: getUsers }] // Trasy
      );

      const response = await request(noSessionApp).get("/users");

      console.log("🔍 Jest received response body:", response.body);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    }, 10000); // Zwiększ timeout do 10 sekund
  });

  describe("getUserById", () => {
    it("should return a user by ID if user is authorized", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: getUserById }] // ✅ Trasa dla pobrania użytkownika
      );

      const mockUser = {
        id: 1,
        name: "User One",
        email: "user1@example.com",
        role: "user",
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(testApp).get("/users/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 401 if user is not authorized", async () => {
      const testApp = setupTestApp(
        {}, // ❌ Brak danych w sesji = brak autoryzacji
        [{ path: "/users/:id", handler: getUserById }]
      );

      const response = await request(testApp).get("/users/1");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });

    it("should return 404 if user is not found", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: getUserById }]
      );

      User.findOne.mockResolvedValue(null);

      const response = await request(testApp).get("/users/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("addUser", () => {
    it("should add a new user", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users", handler: addUser, method: "post" }] // ✅ Trasa do dodania użytkownika
      );

      const mockUser = {
        id: 1,
        name: "New User",
        email: "newuser@example.com",
        role: "user",
      };
      User.create.mockResolvedValue(mockUser);

      const response = await request(testApp)
        .post("/users")
        .send({ name: "New User", email: "newuser@example.com", role: "user" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 400 if required fields are missing", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users", handler: addUser, method: "post" }]
      );

      const response = await request(testApp)
        .post("/users")
        .send({ name: "New User", email: "newuser@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("All fields are required.");
    });

    it("should return 400 if email already exists", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users", handler: addUser, method: "post" }]
      );

      User.create.mockRejectedValue({ name: "SequelizeUniqueConstraintError" });

      const response = await request(testApp)
        .post("/users")
        .send({ name: "New User", email: "newuser@example.com", role: "user" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email already exists.");
    });
  });

  describe("updateUser", () => {
    it("should update an existing user", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: updateUser, method: "put" }] // ✅ Trasa do aktualizacji użytkownika
      );

      const mockUser = {
        id: 1,
        name: "User One",
        email: "user1@example.com",
        role: "user",
        save: jest.fn().mockResolvedValue(), // ✅ Mockowanie metody zapisu
      };

      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(testApp).put("/users/1").send({
        name: "Updated User",
        email: "updateduser@example.com",
        role: "admin",
      });

      expect(response.status).toBe(200);
      expect(mockUser.save).toHaveBeenCalled(); // ✅ Sprawdzamy, czy wywołano zapis
      expect(response.body.name).toBe("Updated User");
      expect(response.body.email).toBe("updateduser@example.com");
      expect(response.body.role).toBe("admin");
    });

    it("should return 404 if user is not found", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: updateUser, method: "put" }]
      );

      User.findByPk.mockResolvedValue(null);

      const response = await request(testApp).put("/users/1").send({
        name: "Updated User",
        email: "updateduser@example.com",
        role: "admin",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found.");
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: deleteUser, method: "delete" }] // ✅ Trasa do usuwania użytkownika
      );

      const mockUser = {
        id: 1,
        name: "User One",
        email: "user1@example.com",
        role: "user",
        destroy: jest.fn().mockResolvedValue(), // ✅ Mockowanie metody `destroy`
      };

      User.findByPk.mockResolvedValue(mockUser);

      const response = await request(testApp).delete("/users/1");

      expect(response.status).toBe(204);
      expect(mockUser.destroy).toHaveBeenCalled(); // ✅ Sprawdzamy, czy użytkownik został usunięty
    });

    it("should return 404 if user is not found", async () => {
      const testApp = setupTestApp(
        { userId: 1, role: "admin" }, // ✅ Sesja admina
        [{ path: "/users/:id", handler: deleteUser, method: "delete" }]
      );

      User.findByPk.mockResolvedValue(null);

      const response = await request(testApp).delete("/users/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found.");
    });
  });
});
