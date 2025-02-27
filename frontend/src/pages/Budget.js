import React, { useState, useEffect } from "react";
import "../css/Budget.css";
import {
  fetchPlannedBudget,
  editPlannedBudget,
  fetchExpensesByCategory,
} from "../services/budgetService";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import DynamicTableModal from "../components/modals/DynamicTableModal";

const categories = [
  {
    id: "equipment",
    name: "Equipment and Software",
    description:
      "Costs related to purchasing hardware and software needed for the project.",
  },
  {
    id: "services",
    name: "External Services",
    description:
      "Expenses for outsourced services, consultations, or professional support.",
  },
  {
    id: "indirect_costs",
    name: "Indirect Costs",
    description:
      "General expenses necessary for the project, including administrative fees.",
  },
  {
    id: "open_access",
    name: "Open Access",
    description:
      "Funds allocated for publishing research under open access policies.",
  },
  {
    id: "salaries",
    name: "Salaries and Scholarships",
    description:
      "Wages and scholarships for researchers and students involved in the project.",
  },
  {
    id: "travel",
    name: "Travel Costs",
    description:
      "Costs associated with conferences, field research, and work-related travel.",
  },
  {
    id: "others",
    name: "Other Expenses",
    description:
      "Miscellaneous costs that do not fit into the main budget categories.",
  },
];

const formatCategory = (text) => {
  if (!text) return "";
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Budget = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({
    planned_costs: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const data = await fetchPlannedBudget();
        setBudgetData(data);
      } catch (error) {
        setError("Failed to load budget summary.");
      } finally {
        setLoading(false);
      }
    };
    loadBudgetData();
  }, []);

  const handleEditClick = (rowIndex) => {
    const item = budgetData[rowIndex];
    setEditingRow(rowIndex);
    setEditValues({
      planned_costs: item.planned_costs,
      notes: item.notes,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async (rowIndex, id) => {
    setSaving(true);
    try {
      const updatedData = {
        planned_costs: parseFloat(editValues.planned_costs),
        notes: editValues.notes,
      };

      await editPlannedBudget(id, updatedData);

      const newBudgetData = [...budgetData];
      newBudgetData[rowIndex] = { ...newBudgetData[rowIndex], ...updatedData };
      setBudgetData(newBudgetData);
      setEditingRow(null);
    } catch (error) {
      console.error("❌ Error saving budget entry:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
  };

  const openModal = async (categoryId) => {
    setSelectedCategory(categoryId);
    setModalLoading(true);
    try {
      const data = await fetchExpensesByCategory(categoryId);
      setFilteredData(data);
    } catch (error) {
      setFilteredData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setFilteredData([]);
  };

  return (
    <div className="budget-container">
      <h1 className="budget-title">Project Budget</h1>

      {loading && <p>Loading budget data...</p>}
      {error && <p className="error">{error}</p>}

      {/* Main budget table */}
      <table className="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Planned Costs (PLN)</th>
            <th>Actual Costs (PLN)</th>
            <th>Remaining (PLN)</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((item, index) => (
            <tr key={item.id}>
              <td>{formatCategory(item.expense_category)}</td>
              <td>
                {editingRow === index ? (
                  <input
                    type="number"
                    name="planned_costs"
                    value={editValues.planned_costs}
                    onChange={handleInputChange}
                  />
                ) : (
                  `${parseFloat(item.planned_costs).toFixed(2)} PLN`
                )}
              </td>
              <td>{parseFloat(item.actual_costs).toFixed(2)} PLN</td>
              <td
                className={
                  parseFloat(item.planned_costs) -
                    parseFloat(item.actual_costs) <
                  0
                    ? "negative-difference"
                    : ""
                }
              >
                {(
                  parseFloat(item.planned_costs) - parseFloat(item.actual_costs)
                ).toFixed(2)}{" "}
                PLN
              </td>
              <td>
                {editingRow === index ? (
                  <textarea
                    name="notes"
                    value={editValues.notes}
                    onChange={handleInputChange}
                    className="edit-notes"
                  />
                ) : (
                  item.notes
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <div className="button-group">
                    <button
                      className="icon-btn save-btn"
                      onClick={() => handleSaveClick(index, item.id)}
                    >
                      <IconCheck size={20} />
                    </button>
                    <button
                      className="icon-btn cancel-btn"
                      onClick={handleCancelClick}
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => handleEditClick(index)}
                  >
                    <IconEdit size={20} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Category selection boxes */}
      <div className="budget-boxes">
        {categories.map((category) => (
          <div
            key={category.id}
            className="budget-box"
            onClick={() => openModal(category.id)}
          >
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      {/* Użycie uniwersalnego modala */}
      {selectedCategory && (
        <DynamicTableModal
          title={categories.find((c) => c.id === selectedCategory)?.name}
          data={filteredData}
          loading={modalLoading}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Budget;
