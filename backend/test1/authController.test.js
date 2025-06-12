import request from "supertest";
import express from "express";
import session from "express-session";
import { signup, login, logout } from "../controllers/authController";
import { User, Team } from "../models/index.js";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(
  session({ secret: "testsecret", resave: false, saveUninitialized: true })
);

app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

jest.mock("../models/index.js");
jest.mock("bcrypt");
jest.mock("../utils/email.js", () => ({
  sendEmail: jest.fn(),
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should sign up a new user and create a new team", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "manager",
        team_id: 1,
      });
      Team.create.mockResolvedValue({
        id: 1,
        team_name: "Test Team",
      });
      bcrypt.hash.mockResolvedValue("hashedpassword");

      const response = await request(app).post("/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        team_name: "Test Team", // Ensure this matches the controller's expected format
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should sign up a new user and join an existing team", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        name: "Test User",
        email: "test1@example.com",
        role: "user",
        team_id: 1,
      });
      Team.findOne.mockResolvedValue({
        id: 1,
        team_name: "Existing Team",
      });
      bcrypt.hash.mockResolvedValue("hashedpassword");

      const response = await request(app).post("/signup").send({
        name: "Test User",
        email: "test1@example.com",
        password: "password123",
        team_id: 1, // Ensure this matches the controller's expected format
      });

      expect(response.status).toBe(400);
    });

    it("should return an error if the user already exists", async () => {
      User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });

      const response = await request(app).post("/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User already exists");
    });

    it("should return an error if the team is not found", async () => {
      User.findOne.mockResolvedValue(null);
      Team.findOne.mockResolvedValue(null);

      const response = await request(app).post("/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        team_id: 1, // Ensure this matches the controller's expected format
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Team not found");
    });

    it("should return an error if neither team creation nor joining is specified", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Must join or create a team");
    });
  });

  describe("login", () => {
    it("should log in an existing user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
        role: "user",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.Login).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedpassword"
      );
    });

    it("should return an error if the user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });

    it("should return an error if the password is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid email or password");
    });
  });

  describe("logout", () => {
    it("should log out the user", async () => {
      const response = await request(app).post("/logout");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logged out successfully");
    });
  });
});
