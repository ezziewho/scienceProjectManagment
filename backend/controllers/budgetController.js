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

// Pobieranie wydatków według kategorii
export const getExpensesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📌 Pobieranie wydatków dla kategorii: ${category}`);

    const Model = expenseModels[category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    const expenses = await Model.findAll();
    console.log(
      `✅ Pobranie zakończone sukcesem. Znaleziono ${expenses.length} rekordów.`
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
    const { category, ...expenseData } = req.body;
    console.log(
      `📌 Tworzenie nowego wydatku w kategorii: ${category}, ${req.body.user_id}`
    );

    const Model = expenseModels[category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${category}`);
      return res.status(400).json({ error: "Nieprawidłowa kategoria" });
    }

    const newExpense = await Model.create(expenseData);
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
    const { id, category } = req.body;
    console.log(
      `📌 Próba zatwierdzenia wydatku ID: ${id} w kategorii: ${category}`
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
    if (req.session.role !== "admin") {
      console.warn(
        `⚠️ Użytkownik ID: ${req.session.userId} i rolą:  ${req.session.role}  nie ma uprawnień do zatwierdzania wydatków.`
      );
      return res
        .status(403)
        .json({ error: "Brak uprawnień do zatwierdzania wydatków" });
    }

    const Model = expenseModels[category];
    if (!Model) {
      console.warn(`⚠️ Nieprawidłowa kategoria: ${category}`);
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

    let budgetSummary = [];

    for (const [category, Model] of Object.entries(expenseModels)) {
      console.log(`🔍 Przetwarzanie kategorii: ${category}`);

      let actualCosts = 0;

      if (category === "salaries") {
        console.log("🟢 Liczenie wynagrodzeń...");
        const salaries = await Model.findAll();
        actualCosts = salaries.reduce((sum, salary) => {
          return sum + salary.duration_months * salary.monthly_salary;
        }, 0);
      } else {
        console.log(`🟢 Sumowanie total_costs dla ${category}...`);
        const result = await Model.sum("total_cost");
        actualCosts = result || 0; // Jeśli brak danych, zwracamy 0
      }

      budgetSummary.push({
        category: category.replace("_", " ").toUpperCase(), // Formatowanie nazwy
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
      category: "TOTAL",
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
export const getBudgetSummaryDirectly = async () => {
  try {
    console.log("📊 Pobieranie podsumowania budżetu (bezpośrednie)...");

    let budgetSummary = [];

    for (const [category, Model] of Object.entries(expenseModels)) {
      let actualCosts = 0;

      if (category === "salaries") {
        console.log(`🟢 Liczenie wynagrodzeń dla kategorii ${category}...`);
        const salaries = await Model.findAll();
        actualCosts = salaries.reduce((sum, salary) => {
          return sum + salary.duration_months * salary.monthly_salary;
        }, 0);
      } else {
        console.log(`🟢 Sumowanie total_costs dla ${category}...`);
        const result = await Model.sum("total_cost");
        actualCosts = result || 0; // Jeśli brak danych, zwracamy 0
      }

      budgetSummary.push({
        category: category.replace("_", " ").toUpperCase(),
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
      category: "TOTAL",
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
export const updatePlannedBudget = async () => {
  try {
    console.log("🔄 Aktualizacja actual_costs w planned_budget...");

    // Pobieramy aktualne wartości actual_costs z getBudgetSummaryDirectly()
    const budgetSummary = await getBudgetSummaryDirectly();

    // Sprawdzamy, czy pobrano poprawne dane
    if (!budgetSummary || budgetSummary.length === 0) {
      console.warn("⚠️ Brak danych do aktualizacji planned_budget!");
      return;
    }

    // Aktualizacja każdej kategorii w planned_budget
    for (const item of budgetSummary) {
      try {
        const formattedCategory = item.category.toLowerCase().replace(" ", "_");

        await PlannedBudget.update(
          {
            actual_costs: item.actual_costs,
            difference: item.planned_costs - item.actual_costs,
          },
          { where: { category: formattedCategory } }
        );

        console.log(
          `✅ Zaktualizowano kategorię: ${item.category} (Actual: ${
            item.actual_costs
          }, Planned: ${item.planned_costs}, Difference: ${
            item.planned_costs - item.actual_costs
          })`
        );
      } catch (updateError) {
        console.error(
          `❌ Błąd aktualizacji dla kategorii: ${item.category}`,
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
      attributes: ["id", "category", "planned_costs", "actual_costs", "notes"], // Tylko wybrane pola
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
      category: "total",
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
