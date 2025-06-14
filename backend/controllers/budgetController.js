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
} from "../models/index.js";

// Mapowanie kategorii na modele Sequelize
const expenseModels = {
  equipment: EquipmentAndSoftware,
  services: ExternalServices,
  indirect_costs: IndirectCosts,
  open_access: OpenAccess,
  salaries: Salaries,
  travel: TravelCosts,
  others: Others,
};
import { getTeamPhase } from "../utils/teamUtils.js";

// Pobieranie wydatków według kategorii
export const getExpensesByCategory = async (req, res) => {
  try {
    const { expense_category } = req.params;
    console.log(`📌 Pobieranie wydatków dla kategorii: ${expense_category}`);

    const Model = expenseModels[expense_category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${expense_category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    const expenses = await Model.findAll();
    console.log(
      `✅ Pobranie zakończone sukcesem. Znaleziono ${
        expenses.length
      } rekordów, a one to: ${JSON.stringify(
        expenses.map((expense) => expense.toJSON()),
        null,
        2
      )}`
    );
    res.status(200).json(expenses);
  } catch (error) {
    console.error("❌ Błąd podczas pobierania wydatków:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
};

// Tworzenie wydatku w dowolnej kategorii
export const createExpense = async (req, res) => {
  try {
    const { expense_category, ...expenseData } = req.body;
    const teamPhase = await getTeamPhase(req.session);
    console.log(
      `📌 Tworzenie nowego wydatku w kategorii: ${expense_category}, ${req.body.user_id}`
    );

    // Validate required fields for the EquipmentAndSoftware model
    if (expense_category === "equipment") {
      const requiredFields = [
        "name",
        "category",
        "unit_price",
        "purchase_date",
      ];
      const missingFields = requiredFields.filter(
        (field) => !expenseData[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
    }

    const Model = expenseModels[expense_category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${expense_category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    const newExpense = await Model.create({
      ...expenseData,
      team_id: req.session.teamId, // Add team_id from session
      phase: teamPhase, // Add phase retrieved from getTeamPhase
    });
    console.log(`✅ Wydatek utworzony: ${newExpense.id}`);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("❌ Błąd podczas tworzenia wydatku:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
};

// Zatwierdzanie wydatku przez PI
export const approveExpense = async (req, res) => {
  try {
    const { id, expense_category } = req.body;
    console.log(
      `📌 Próba zatwierdzenia wydatku ID: ${id} w kategorii: ${expense_category}`
    );

    const user = await User.findByPk(req.session.userId, {
      attributes: ["id", "role"], // ✅ Pobieramy tylko ID i role
    });

    console.log("🔍 Pobranie użytkownika:", req.session.userId);
    /*
    if (!user) {
      console.warn("⚠️ Użytkownik nie znaleziony w bazie.");
      return res.status(401).json({ error: "Nieautoryzowany użytkownik." });
    }
*/
    console.warn("Headersllo oto id z sesji,", req.session.userId);
    if (req.session.role !== "manager") {
      console.warn(
        `⚠️ Użytkownik ID: ${req.session.userId} i rolą:  ${req.session.role}  nie ma uprawnień do zatwierdzania wydatków.`
      );
      return res
        .status(403)
        .json({ error: "Brak uprawnień do zatwierdzania wydatków" });
    }

    const Model = expenseModels[expense_category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${expense_category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    const expense = await Model.findByPk(id);
    if (!expense) {
      console.warn(`⚠️ Wydatek ID: ${id} nie znaleziony.`);
      return res.status(404).json({ error: "Nie znaleziono wydatku" });
    }

    expense.status = "approved";
    await expense.save();
    console.log(
      `✅ Wydatek ID: ${id} został zatwierdzony przez użytkownika ID: ${req.session.userId}`
    );

    res.json({ message: "Wydatek zatwierdzony" });
  } catch (error) {
    console.error("❌ Błąd podczas zatwierdzania wydatku:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
};

export const getBudgetSummary = async (req, res) => {
  try {
    console.log("📊 Pobieranie podsumowania budżetu...");

    const { phase_checked } = req.query; // Get phase_checked from query params
    console.log(`🔍 Faza do zsumowania: ${phase_checked}`);

    let budgetSummary = [];

    for (const [expense_category, Model] of Object.entries(expenseModels)) {
      console.log(`🔍 Przetwarzanie kategorii: ${expense_category}`);

      let actualCosts = 0;

      if (expense_category === "salaries") {
        console.log("🟢 Liczenie wynagrodzeń...");
        const salaries = await Model.findAll({
          where:
            phase_checked !== "both" ? { phase: phase_checked === "1" } : {},
        });
        actualCosts = salaries.reduce((sum, salary) => {
          return sum + salary.duration_months * salary.monthly_salary;
        }, 0);
      } else {
        console.log(`🟢 Sumowanie total_costs dla ${expense_category}...`);
        const result = await Model.sum("total_cost", {
          where:
            phase_checked !== "both" ? { phase: phase_checked === "1" } : {},
        });
        actualCosts = result || 0; // Jeśli brak danych, zwracamy 0
      }

      budgetSummary.push({
        expense_category: expense_category.replace("_", " ").toUpperCase(), // Formatowanie nazwy
        actual_costs: actualCosts,
      });
    }

    // Sumowanie wszystkich actual_costs
    const totalActualCosts = budgetSummary.reduce(
      (sum, item) => sum + item.actual_costs,
      0
    );

    // Dodanie sumy do budżetu
    budgetSummary.push({
      expense_category: "TOTAL",
      actual_costs: totalActualCosts,
    });

    console.log("✅ Podsumowanie budżetu wygenerowane:", budgetSummary);
    res.status(200).json(budgetSummary);
  } catch (error) {
    console.error("❌ Błąd podczas pobierania podsumowania budżetu:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Funkcja zwracająca budżet bezpośrednio (do użytku wewnętrznego)
export const getBudgetSummaryDirectly = async (phaseChecked, teamId) => {
  try {
    console.log("📊 Pobieranie podsumowania budżetu (bezpośrednie)...");

    let budgetSummary = [];

    for (const [expense_category, Model] of Object.entries(expenseModels)) {
      let actualCosts = 0;

      if (expense_category === "salaries") {
        console.log(
          `🟢 Liczenie wynagrodzeń dla kategorii ${expense_category}...`
        );
        const salaries = await Model.findAll({
          where: {
            team_id: teamId,
            ...(phaseChecked !== "both" ? { phase: phaseChecked === "1" } : {}),
          },
        });
        actualCosts = salaries.reduce((sum, salary) => {
          return sum + salary.duration_months * salary.monthly_salary;
        }, 0);
      } else {
        console.log(`🟢 Sumowanie total_costs dla ${expense_category}...`);
        const result = await Model.sum("total_cost", {
          where: {
            team_id: teamId,
            ...(phaseChecked !== "both" ? { phase: phaseChecked === "1" } : {}),
          },
        });
        actualCosts = result || 0; // Jeśli brak danych, zwracamy 0
      }

      budgetSummary.push({
        expense_category: expense_category.replace("_", " ").toUpperCase(),
        actual_costs: actualCosts,
        planned_costs: 0, // Planned costs zostaną uzupełnione później
      });
    }

    // Obliczenie wartości TOTAL
    const totalActualCosts = budgetSummary.reduce(
      (sum, item) => sum + item.actual_costs,
      0
    );
    const totalPlannedCosts = budgetSummary.reduce(
      (sum, item) => sum + item.planned_costs,
      0
    );

    // Dodanie podsumowania do listy
    budgetSummary.push({
      expense_category: "TOTAL",
      actual_costs: totalActualCosts,
      planned_costs: totalPlannedCosts,
    });

    console.log("✅ Podsumowanie budżetu wygenerowane:", budgetSummary);
    return budgetSummary;
  } catch (error) {
    console.error("❌ Błąd podczas pobierania budżetu bezpośrednio:", error);
    return [];
  }
};

// Aktualizacja planned_budget na podstawie actual_costs
export const updatePlannedBudget = async (phaseChecked, teamId) => {
  try {
    console.log("🔄 Aktualizacja actual_costs w planned_budget...");

    // Pobieramy aktualne wartości actual_costs z getBudgetSummaryDirectly()
    const budgetSummary = await getBudgetSummaryDirectly(phaseChecked, teamId);

    // Sprawdzamy, czy pobrano poprawne dane
    if (!budgetSummary || budgetSummary.length === 0) {
      console.warn("⚠️ Brak danych do aktualizacji planned_budget!");
      return;
    }

    // Aktualizacja każdej kategorii w planned_budget
    for (const item of budgetSummary) {
      try {
        const formattedCategory = item.expense_category
          .toLowerCase()
          .replace(" ", "_");

        await PlannedBudget.update(
          {
            actual_costs: item.actual_costs,
            difference: item.planned_costs - item.actual_costs,
          },
          { where: { expense_category: formattedCategory } }
        );

        console.log(
          `✅ Zaktualizowano kategorię: ${item.expense_category} (Actual: ${
            item.actual_costs
          }, Planned: ${item.planned_costs}, Difference: ${
            item.planned_costs - item.actual_costs
          })`
        );
      } catch (updateError) {
        console.error(
          `❌ Błąd aktualizacji dla kategorii: ${item.expense_category}`,
          updateError
        );
      }
    }

    console.log(
      "✅ Wszystkie kategorie planned_budget zostały zaktualizowane!"
    );
  } catch (error) {
    console.error(
      "❌ Krytyczny błąd podczas aktualizacji planned_budget:",
      error
    );
  }
};

export const getPlannedBudget = async (req, res) => {
  try {
    console.log("📊 Pobieranie danych z planned_budget...");

    // Najpierw aktualizujemy actual_costs, żeby dane były najnowsze
    await updatePlannedBudget();

    // Pobieramy aktualne dane z planned_budget, tylko potrzebne pola
    const plannedBudget = await PlannedBudget.findAll({
      attributes: [
        "id",
        "expense_category",
        "planned_costs",
        "actual_costs",
        "notes",
      ], // Tylko wybrane pola
    });

    // Obliczanie sum dla total
    const totalPlannedCosts = plannedBudget.reduce(
      (sum, item) => sum + parseFloat(item.planned_costs),
      0
    );
    const totalActualCosts = plannedBudget.reduce(
      (sum, item) => sum + parseFloat(item.actual_costs),
      0
    );
    const totalDifference = totalPlannedCosts - totalActualCosts;

    // Dodanie kategorii "total" jako ostatni wpis
    const totalEntry = {
      expense_category: "total",
      planned_costs: totalPlannedCosts.toFixed(2),
      actual_costs: totalActualCosts.toFixed(2),
      difference: totalDifference.toFixed(2),
      notes: "", // Możesz tu ustawić jakąś wartość, jeśli chcesz
    };

    plannedBudget.push(totalEntry);

    console.log(
      "✅ Podsumowanie planowanego budżetu wygenerowane:",
      plannedBudget
    );

    // Zwrócenie zaktualizowanych danych
    res.status(200).json(plannedBudget);
  } catch (error) {
    console.error("❌ Błąd podczas pobierania planned_budget:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const editPlannedBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { planned_costs, notes } = req.body;

    // Znalezienie wpisu w budżecie po ID
    const budgetEntry = await PlannedBudget.findByPk(id);

    if (!budgetEntry) {
      return res.status(404).json({ message: "Budget entry not found" });
    }

    // Aktualizacja wartości
    budgetEntry.planned_costs = planned_costs;
    budgetEntry.notes = notes;

    await budgetEntry.save(); // Zapis zmian w bazie

    return res.status(200).json({
      message: "Budget entry updated successfully",
      updatedEntry: budgetEntry,
    });
  } catch (error) {
    console.error("Error updating budget entry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id, expense_category, ...updateData } = req.body;

    console.log(
      `📌 Próba edycji wydatku ID: ${id} w kategorii: ${expense_category}`
    );

    // Sprawdzenie poprawności kategorii
    const Model = expenseModels[expense_category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${expense_category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    // Pobranie istniejącego wydatku
    const expense = await Model.findByPk(id);
    if (!expense) {
      console.warn(`⚠️ Wydatek ID: ${id} nie znaleziony.`);
      return res.status(404).json({ error: "Nie znaleziono wydatku" });
    }

    // Aktualizacja tylko podanych pól
    await expense.update(updateData);

    console.log(`✅ Wydatek ID: ${id} zaktualizowany pomyślnie.`);
    res
      .status(200)
      .json({ message: "Wydatek zaktualizowany", updatedExpense: expense });
  } catch (error) {
    console.error("❌ Błąd podczas aktualizacji wydatku:", error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
};
