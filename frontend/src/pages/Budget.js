import React, { useState, useEffect } from "react";
import "../css/Budget.css";
import {
  fetchPlannedBudget,
  editPlannedBudget,
  fetchExpensesByCategory,
  fetchBudgetSummary,
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
  const [phaseChecked, setPhaseChecked] = useState(null); // null = both, 0 = preparation, 1 = execution
  const [budgetSummary, setBudgetSummary] = useState([]);

  const [filterPhase, setFilterPhase] = useState(null); // null = both, 0 = preparation, 1 = execution

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

  const handleCheckboxChange = async (phase) => {
    const newPhaseChecked = phaseChecked === phase ? null : phase; // Toggle between phase and null
    setPhaseChecked(newPhaseChecked);

    try {
      const summary = await fetchBudgetSummary(newPhaseChecked);
      setBudgetSummary(summary);
    } catch (error) {
      console.error("Error fetching budget summary:", error);
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

  const filteredBudgetData = budgetData.filter((item) => {
    if (filterPhase === null) return true; // Show all if no filter is applied
    return item.phase === filterPhase;
  });

  return (
    <div className="budget-container">
      <h1 className="budget-title">Project Budget</h1>

      <div>
        <label>
          <input
            type="checkbox"
            checked={phaseChecked === 0}
            onChange={() => handleCheckboxChange(0)}
          />
          Summarize only costs added during preparation of the application
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={phaseChecked === 1}
            onChange={() => handleCheckboxChange(1)}
          />
          Summarize only costs added during project execution
        </label>
      </div>

      {loading && <p>Loading budget data...</p>}
      {error && <p className="error">{error}</p>}

      {/* Main budget table */}
      <table className="budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Planned Costs </th>
            <th>Actual Costs </th>
            <th>Remaining </th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBudgetData.map((item, index) => (
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
                {index === budgetData.length - 1 ? ( // Check if it's the last row
                  <span></span> // Display a placeholder or leave it empty
                ) : editingRow === index ? (
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
