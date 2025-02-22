import request from "supertest";
import express from "express";
import session from "express-session";
import {
  getAllLeaves,
  getUserLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import Leave from "../models/Leave.js";
import sessionConfig from "../config/session.js";

jest.mock("../models/Leave.js");

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

describe("Leave Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllLeaves", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "admin" }, // Dane sesji
        [{ path: "/leaves", handler: getAllLeaves }] // Trasy
      );
    });

    it("should return a list of all leave requests", async () => {
      const mockLeaves = [
        {
          id: 1,
          user_id: 1,
          start_date: "2025-02-20",
          end_date: "2025-02-25",
          status: "pending",
        },
        {
          id: 2,
          user_id: 2,
          start_date: "2025-03-01",
          end_date: "2025-03-05",
          status: "approved",
        },
      ];
      Leave.findAll.mockResolvedValue(mockLeaves);

      const response = await request(testApp).get("/leaves");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLeaves);
    });
  });

  describe("getUserLeaves", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/leaves/mine", handler: getUserLeaves }] // Trasy
      );
    });

    it("should return a list of leave requests for the logged-in user", async () => {
      const mockLeaves = [
        {
          id: 1,
          user_id: 1,
          start_date: "2025-02-20",
          end_date: "2025-02-25",
          status: "pending",
        },
        {
          id: 2,
          user_id: 1,
          start_date: "2025-03-01",
          end_date: "2025-03-05",
          status: "approved",
        },
      ];
      Leave.findAll.mockResolvedValue(mockLeaves);

      const response = await request(testApp).get("/leaves/mine");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLeaves);
    });

    it("should return 401 if user is not authorized", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/leaves/mine", handler: getUserLeaves }] // Trasy
      );

      const response = await request(noSessionApp).get("/leaves/mine");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized. Please log in.");
    });
  });

  describe("createLeave", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/leaves", handler: createLeave, method: "post" }] // Trasy
      );
    });

    it("should create a new leave request", async () => {
      const mockLeave = {
        id: 1,
        user_id: 1,
        start_date: "2025-02-20",
        end_date: "2025-02-25",
        status: "pending",
      };
      Leave.create.mockResolvedValue(mockLeave);

      const response = await request(testApp).post("/leaves").send({
        start_date: "2025-02-20",
        end_date: "2025-02-25",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockLeave);
    });

    it("should return 401 if user is not authorized", async () => {
      const noSessionApp = setupTestApp(
        {}, // Brak danych sesji
        [{ path: "/leaves", handler: createLeave, method: "post" }] // Trasy
      );

      const response = await request(noSessionApp).post("/leaves").send({
        start_date: "2025-02-20",
        end_date: "2025-02-25",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized. Please log in.");
    });

    it("should return 400 if start_date or end_date is missing", async () => {
      const response = await request(testApp).post("/leaves").send({
        start_date: "2025-02-20",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Start date and end date are required.");
    });
  });

  describe("deleteLeave", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/leaves/:id", handler: deleteLeave, method: "delete" }] // Trasy
      );
    });

    it("should delete an existing leave request", async () => {
      const mockLeave = {
        id: 1,
        user_id: 1,
        start_date: "2025-02-20",
        end_date: "2025-02-25",
        status: "pending",
        destroy: jest.fn().mockResolvedValue(), // ✅ Poprawione mockowanie `destroy`
      };
      Leave.findByPk.mockResolvedValue(mockLeave);
      Leave.prototype.destroy = jest.fn().mockResolvedValue();

      const response = await request(testApp).delete("/leaves/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Leave request deleted successfully.");
    });

    it("should return 404 if leave request is not found", async () => {
      Leave.findByPk.mockResolvedValue(null);

      const response = await request(testApp).delete("/leaves/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Leave request not found.");
    });
  });

  describe("updateLeaveStatus", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "admin" }, // Dane sesji
        [
          {
            path: "/leaves/:id/status",
            handler: updateLeaveStatus,
            method: "put",
          },
        ] // Trasy
      );
    });

    it("should update the status of a leave request", async () => {
      const mockLeave = {
        id: 1,
        user_id: 1,
        start_date: "2025-02-20",
        end_date: "2025-02-25",
        status: "pending",
        update: jest.fn().mockResolvedValue(), // ✅ Poprawione: Mockujemy `update()`
      };
      Leave.findByPk.mockResolvedValue(mockLeave);
      //Leave.prototype.update = jest.fn().mockResolvedValue(mockLeave);

      const response = await request(testApp).put("/leaves/1/status").send({
        status: "approved",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Leave request approved and notification sent."
      );
    });

    it("should return 404 if leave request is not found", async () => {
      Leave.findByPk.mockResolvedValue(null);

      const response = await request(testApp).put("/leaves/1/status").send({
        status: "approved",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Leave request not found.");
    });

    it("should return 400 if status is invalid", async () => {
      const response = await request(testApp).put("/leaves/1/status").send({
        status: "invalid_status",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid status value.");
    });
  });
});
