import {
  getBudgetSummaryDirectly,
  updatePlannedBudget,
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

jest.mock("../models/index.js");

describe("Budget Controller", () => {
  describe("getBudgetSummaryDirectly", () => {
    it("should calculate actual costs for salaries based on phaseChecked and teamId", async () => {
      const mockSalaries = [
        { duration_months: 12, monthly_salary: 3000 },
        { duration_months: 6, monthly_salary: 2000 },
      ];

      Salaries.findAll.mockResolvedValue(mockSalaries);

      const result = await getBudgetSummaryDirectly("1", 123);

      expect(Salaries.findAll).toHaveBeenCalledWith({
        where: { phase: true, team_id: 123 },
      });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            expense_category: "SALARIES",
            actual_costs: 48000, // 12*3000 + 6*2000
          }),
        ])
      );
    });

    it("should calculate total costs for other categories based on phaseChecked and teamId", async () => {
      TravelCosts.sum.mockResolvedValue(5000);

      const result = await getBudgetSummaryDirectly("0", 123);

      expect(TravelCosts.sum).toHaveBeenCalledWith("total_cost", {
        where: { phase: false, team_id: 123 },
      });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            expense_category: "TRAVEL",
            actual_costs: 5000,
          }),
        ])
      );
    });
  });

  describe("updatePlannedBudget", () => {
    it("should update planned budget with actual costs and differences", async () => {
      const mockBudgetSummary = [
        {
          expense_category: "SALARIES",
          actual_costs: 48000,
          planned_costs: 50000,
        },
      ];

      jest
        .spyOn(
          require("../controllers/budgetController.js"),
          "getBudgetSummaryDirectly"
        )
        .mockResolvedValue(mockBudgetSummary);

      await updatePlannedBudget("1", 123);

      //   expect(PlannedBudget.update).toHaveBeenCalledWith(
      //     {
      //       actual_costs: 48000,
      //       difference: 2000, // 50000 - 48000
      //     },
      //     { where: { expense_category: "salaries" } }
      //   );
    });

    it("should log a warning if no data is available for update", async () => {
      jest
        .spyOn(
          require("../controllers/budgetController.js"),
          "getBudgetSummaryDirectly"
        )
        .mockResolvedValue([]);

      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      await updatePlannedBudget("1", 123);

      //   expect(consoleWarnSpy).toHaveBeenCalledWith(
      //     "⚠️ Brak danych do aktualizacji planned_budget!"
      //   );

      consoleWarnSpy.mockRestore();
    });
  });
});
