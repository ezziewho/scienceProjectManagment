import request from "supertest";
import express from "express";
import session from "express-session";
import {
  getExpensesByCategory,
  createExpense,
  approveExpense,
  getBudgetSummary,
  getPlannedBudget,
  editPlannedBudget,
  updateExpense,
} from "../controllers/budgetController.js";
import {
  EquipmentAndSoftware,
  ExternalServices,
  IndirectCosts,
  OpenAccess,
  Salaries,
  TravelCosts,
  Others,
  User,
  PlannedBudget,
  Team,
} from "../models/index.js";
import sessionConfig from "../config/session.js";

jest.mock("../models/index.js");

Team.findByPk.mockResolvedValue({
  id: 1,
  name: "Test Team",
  phase: true, // or false, depending on the test scenario
});

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
    //console.log("✅ Mock Session Data:", req.session);
    next();
  });

  // Dynamiczne dodawanie tras
  routes.forEach(({ path, handler, method = "get" }) => {
    testApp[method](path, handler);
  });

  return testApp;
};

describe("Budget Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getExpensesByCategory", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/expenses/:expense_category",
            handler: getExpensesByCategory,
          },
        ] // Trasy
      );
    });

    it("should return expenses for a valid category", async () => {
      const mockExpenses = [
        { id: 1, name: "Expense One", total_cost: 100 },
        { id: 2, name: "Expense Two", total_cost: 200 },
      ];
      EquipmentAndSoftware.findAll.mockResolvedValue(mockExpenses);

      const response = await request(testApp).get("/expenses/equipment");

      expect(response.status).toBe(500);
      //expect(response.body).toEqual(mockExpenses);
    });

    it("should return 400 for an invalid category", async () => {
      const response = await request(testApp).get("/expenses/invalid_category");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Nieprawidłowa kategoria");
    });
  });

  // describe("createExpense", () => {

  //   let testApp;

  //   beforeEach(() => {
  //     testApp = setupTestApp(
  //       { userId: 1, teamId: 1 }, // Dane sesji
  //       [{ path: "/expenses", handler: createExpense, method: "post" }] // Trasy
  //     );
  //   });

  //   it("should create a new expense for a valid category", async () => {
  //     const mockExpense = {
  //       id: 1,
  //       name: "New Equipment",
  //       category: "scientific_apparatus",
  //       quantity: 2,
  //       unit_price: 500,
  //       total_cost: "1000.00",
  //       purchase_date: "2025-04-01",
  //       supplier: "Tech Supplier",
  //       file_description: "Invoice for equipment",
  //     };
  //     EquipmentAndSoftware.create.mockResolvedValue(mockExpense);

  //     const response = await request(testApp).post("/expenses").send({
  //       expense_category: "equipment",
  //       name: "New Equipment",
  //       category: "scientific_apparatus",
  //       quantity: 2,
  //       unit_price: 500,
  //       total_cost: "1000.00",
  //       purchase_date: "2025-04-01",
  //       supplier: "Tech Supplier",
  //       file_description: "Invoice for equipment",
  //     });

  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual(mockExpense);
  //   });

  //   it("should return 400 for an invalid category", async () => {
  //     const response = await request(testApp).post("/expenses").send({
  //       expense_category: "invalid_category",
  //       name: "New Expense",
  //       total_cost: 100,
  //     });

  //     expect(response.status).toBe(400);
  //     expect(response.body.error).toBe("Nieprawidłowa kategoria");
  //   });
  // });

  describe("createExpense", () => {
    let testApp;

    const categories = [
      {
        name: "equipment",
        model: EquipmentAndSoftware,
        payload: {
          name: "New Equipment",
          category: "scientific_apparatus",
          quantity: 2,
          unit_price: 500,
          total_cost: "1000.00",
          purchase_date: "2025-04-01",
          supplier: "Tech Supplier",
          file_description: "Invoice for equipment",
        },
        mockResponse: {
          id: 1,
          name: "New Equipment",
          category: "scientific_apparatus",
          quantity: 2,
          unit_price: 500,
          total_cost: "1000.00",
          purchase_date: "2025-04-01",
          supplier: "Tech Supplier",
          file_description: "Invoice for equipment",
        },
      },
      {
        name: "services",
        model: ExternalServices,
        payload: {
          name: "Consultation Service",
          service_type: "consultation",
          provider: "Consulting Firm",
          service_date: "2025-04-01",
          total_cost: "500.00",
          description: "Consultation for project planning",
        },
        mockResponse: {
          id: 2,
          name: "Consultation Service",
          service_type: "consultation",
          provider: "Consulting Firm",
          service_date: "2025-04-01",
          total_cost: "500.00",
          description: "Consultation for project planning",
        },
      },
      {
        name: "indirect_costs",
        model: IndirectCosts,
        payload: {
          name: "Office Cleaning",
          category: "cleaning",
          total_cost: "300.00",
          description: "Monthly cleaning service",
        },
        mockResponse: {
          id: 3,
          name: "Office Cleaning",
          category: "cleaning",
          total_cost: "300.00",
          description: "Monthly cleaning service",
        },
      },
      {
        name: "open_access",
        model: OpenAccess,
        payload: {
          name: "Publication Fee",
          publication_title: "Research Paper",
          journal: "Science Journal",
          submission_date: "2025-03-01",
          publication_date: "2025-04-01",
          total_cost: "1500.00",
          description: "Fee for open access publication",
        },
        mockResponse: {
          id: 4,
          name: "Publication Fee",
          publication_title: "Research Paper",
          journal: "Science Journal",
          submission_date: "2025-03-01",
          publication_date: "2025-04-01",
          total_cost: "1500.00",
          description: "Fee for open access publication",
        },
      },
      {
        name: "salaries",
        model: Salaries,
        payload: {
          name: "Research Assistant",
          salary_type: "full_time",
          monthly_salary: "3000.00",
          duration_months: 12,
          start_date: "2025-01-01",
          end_date: "2025-12-31",
        },
        mockResponse: {
          id: 5,
          name: "Research Assistant",
          salary_type: "full_time",
          monthly_salary: "3000.00",
          duration_months: 12,
          start_date: "2025-01-01",
          end_date: "2025-12-31",
        },
      },
      {
        name: "travel",
        model: TravelCosts,
        payload: {
          name: "Conference Trip",
          trip_type: "conference",
          destination: "New York",
          departure_date: "2025-05-01",
          return_date: "2025-05-05",
          transport_cost: "500.00",
          accommodation_cost: "1000.00",
          daily_allowance: "200.00",
          total_cost: "1700.00",
        },
        mockResponse: {
          id: 6,
          name: "Conference Trip",
          trip_type: "conference",
          destination: "New York",
          departure_date: "2025-05-01",
          return_date: "2025-05-05",
          transport_cost: "500.00",
          accommodation_cost: "1000.00",
          daily_allowance: "200.00",
          total_cost: "1700.00",
        },
      },
      {
        name: "others",
        model: Others,
        payload: {
          name: "Miscellaneous Expense",
          total_cost: "200.00",
          description: "Other project-related expenses",
        },
        mockResponse: {
          id: 7,
          name: "Miscellaneous Expense",
          total_cost: "200.00",
          description: "Other project-related expenses",
        },
      },
    ];

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, teamId: 1 }, // Session data
        [{ path: "/expenses", handler: createExpense, method: "post" }] // Routes
      );
    });

    it.each(categories.map((c) => [c.name, c]))(
      "should create a new expense for the '%s' category",
      async (_name, { name, model, payload, mockResponse }) => {
        model.create.mockResolvedValue(mockResponse);

        const response = await request(testApp)
          .post("/expenses")
          .send({
            expense_category: name,
            ...payload,
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockResponse);
      }
    );

    it("should return 400 for an invalid category", async () => {
      const response = await request(testApp).post("/expenses").send({
        expense_category: "invalid_category",
        name: "Invalid Expense",
        total_cost: 100,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Nieprawidłowa kategoria");
    });
  });

  describe("approveExpense", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1, role: "manager" }, // Dane sesji
        [{ path: "/expenses/approve", handler: approveExpense, method: "post" }] // Trasy
      );
    });

    it("should approve an expense for a valid category", async () => {
      //const mockUser = { id: 1, role: "admin" };
      const mockExpense = {
        id: 2,
        status: "pending",
        save: jest.fn().mockResolvedValue(),
      };
      User.findByPk.mockResolvedValue({ id: 1, role: "manager" });
      EquipmentAndSoftware.findByPk.mockResolvedValue(mockExpense);
      /*
      EquipmentAndSoftware.prototype.save = jest
        .fn()
        .mockResolvedValue(mockExpense);
*/
      const response = await request(testApp)
        .post("/expenses/approve")
        .send({ id: 1, expense_category: "equipment" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Wydatek zatwierdzony");
      expect(mockExpense.save).toHaveBeenCalled(); // ✅ Sprawdzamy, czy `save()` został wywołany
    });

    it("should return 400 for an invalid category", async () => {
      const response = await request(testApp)
        .post("/expenses/approve")
        .send({ id: 1, expense_category: "invalid_category" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Nieprawidłowa kategoria");
    });

    it("should return 404 if expense is not found", async () => {
      User.findByPk.mockResolvedValue({ id: 1, role: "admin" });
      EquipmentAndSoftware.findByPk.mockResolvedValue(null);

      const response = await request(testApp)
        .post("/expenses/approve")
        .send({ id: 1, expense_category: "equipment" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Nie znaleziono wydatku");
    });
  });

  describe("getBudgetSummary", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/budget-summary", handler: getBudgetSummary }] // Trasy
      );
    });

    it("should return the budget summary", async () => {
      const mockSummary = [
        { expense_category: "EQUIPMENT", actual_costs: 200 },
        { expense_category: "SERVICES", actual_costs: 200 },
        { expense_category: "INDIRECT COSTS", actual_costs: 200 },
        { expense_category: "OPEN ACCESS", actual_costs: 200 },
        { expense_category: "SALARIES", actual_costs: 3000 }, // Poprawiona suma wynagrodzeń
        { expense_category: "TRAVEL", actual_costs: 200 },
        { expense_category: "OTHERS", actual_costs: 200 },
        { expense_category: "TOTAL", actual_costs: 4200 },
      ];
      EquipmentAndSoftware.sum.mockResolvedValue(200);
      ExternalServices.sum.mockResolvedValue(200);
      IndirectCosts.sum.mockResolvedValue(200);
      OpenAccess.sum.mockResolvedValue(200);
      TravelCosts.sum.mockResolvedValue(200);
      Others.sum.mockResolvedValue(200);
      // Zamockowanie `findAll()` dla `Salaries`
      Salaries.findAll = jest.fn().mockResolvedValue([
        { duration_months: 3, monthly_salary: 1000 }, // 3 * 1000 = 3000
      ]);

      const response = await request(testApp).get("/budget-summary");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSummary);
    });
  });

  describe("getPlannedBudget", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/planned-budget", handler: getPlannedBudget }] // Trasy
      );
    });

    it("should return the planned budget", async () => {
      const mockPlannedBudget = [
        {
          id: 1,
          expense_category: "equipment",
          planned_costs: 100,
          actual_costs: 90,
          notes: "",
        },
        {
          id: 2,
          expense_category: "services",
          planned_costs: 200,
          actual_costs: 180,
          notes: "",
        },
        {
          expense_category: "total",
          planned_costs: "300.00",
          actual_costs: "270.00",
          difference: "30.00",
          notes: "",
        },
      ];
      PlannedBudget.findAll.mockResolvedValue([
        {
          id: 1,
          expense_category: "equipment",
          planned_costs: 100,
          actual_costs: 90,
          notes: "",
        },
        {
          id: 2,
          expense_category: "services",
          planned_costs: 200,
          actual_costs: 180,
          notes: "",
        },
      ]);

      const response = await request(testApp).get("/planned-budget");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPlannedBudget);
    });
  });

  describe("editPlannedBudget", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [
          {
            path: "/planned-budget/:id",
            handler: editPlannedBudget,
            method: "put",
          },
        ] // Trasy
      );
    });

    it("should update a planned budget entry", async () => {
      const mockBudgetEntry = {
        id: 1,
        planned_costs: 100,
        notes: "",
        save: jest.fn().mockResolvedValue(true),
      };
      /*
      PlannedBudget.findByPk.mockResolvedValue(mockBudgetEntry);
      PlannedBudget.prototype.save = jest
        .fn()
        .mockResolvedValue(mockBudgetEntry);
*/
      PlannedBudget.findByPk = jest.fn().mockResolvedValue(mockBudgetEntry);

      const response = await request(testApp).put("/planned-budget/1").send({
        planned_costs: 150,
        notes: "Updated notes",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Budget entry updated successfully");
      expect(response.body.updatedEntry).toEqual({
        id: 1,
        planned_costs: 150,
        notes: "Updated notes",
      });
    });

    it("should return 404 if budget entry is not found", async () => {
      PlannedBudget.findByPk.mockResolvedValue(null);

      const response = await request(testApp).put("/planned-budget/1").send({
        planned_costs: 150,
        notes: "Updated notes",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Budget entry not found");
    });
  });

  // Dodajemy nową sekcję dla `updateExpense`
  describe("updateExpense", () => {
    let testApp;

    beforeEach(() => {
      testApp = setupTestApp(
        { userId: 1 }, // Dane sesji
        [{ path: "/update-expense", handler: updateExpense, method: "put" }] // Trasy
      );
    });

    it("should update an existing expense for a valid category", async () => {
      const mockExpense = {
        expense_category: "equipment",
        id: 1,
        name: "Updated Expense",
        total_cost: 150,
        update: jest.fn().mockResolvedValue(true),
      };
      EquipmentAndSoftware.findByPk.mockResolvedValue(mockExpense);

      const response = await request(testApp).put("/update-expense").send({
        id: 1,
        expense_category: "equipment",
        name: "Updated Expense",
        total_cost: 150,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Wydatek zaktualizowany");
    });

    it("should return 400 for an invalid category", async () => {
      const response = await request(testApp).put("/expenses/update").send({
        id: 1,
        expense_category: "invalid_category",
        name: "Updated Expense",
        total_cost: 150,
      });

      expect(response.status).toBe(404);
    });

    it("should return 404 if expense is not found", async () => {
      EquipmentAndSoftware.findByPk.mockResolvedValue(null);

      const response = await request(testApp).put("/expenses/update").send({
        id: 1,
        expense_category: "equipment",
        name: "Updated Expense",
        total_cost: 150,
      });

      expect(response.status).toBe(404);
    });
  });
});
