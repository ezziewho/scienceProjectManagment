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
