import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/DynamicTableModal.css";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import EditRowModal from "./EditRowModal"; // Import the new modal
const DynamicTableModal = ({
  title,
  data,
  loading,
  onClose,
  onEdit,
  onDelete,
  onView,
  refreshData, // Dodaj funkcję do odświeżania danych
}) => {
  const [filters, setFilters] = useState({});
  const [userNames, setUserNames] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = [
        ...new Set(data.map((row) => row.user_id).filter(Boolean)),
      ];

      const userResponses = await Promise.all(
        uniqueUserIds.map((id) =>
          axios
            .get(`http://localhost:8081/user/profile/${id}`, {
              withCredentials: true,
            })
            .then((res) => ({ id, name: res.data.name }))
            .catch(() => ({ id, name: "Unknown User" }))
        )
      );

      const userMap = userResponses.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});

      setUserNames(userMap);
    };

    if (data.length > 0) {
      fetchUserNames();
    }
  }, [data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleApproveExpense = async (row) => {
    try {
      const response = await axios.put(
        "http://localhost:8081/budget/approve",
        { id: row.id, expense_category: row.expense_category },
        { withCredentials: true }
      );
      alert(response.data.message || "Wydatek zatwierdzony!");
      refreshData(); // Odśwież dane po zatwierdzeniu
    } catch (error) {
      console.error("❌ Błąd zatwierdzania wydatku:", error);
      alert("Nie udało się zatwierdzić wydatku.");
    }
  };

  const filteredData = data.filter((row) =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true; // Skip if no filter is applied

      const value = row[key];
      const filterValue = filters[key];

      // Handle date filters
      if (
        [
          "submission_date",
          "publication_date",
          "created_at",
          "updated_at",
        ].includes(key)
      ) {
        return new Date(value).toISOString().split("T")[0] === filterValue;
      }

      // Handle boolean filters (e.g., phase)
      if (key === "phase") {
        return value.toString() === filterValue;
      }

      // Handle enum-like filters (e.g., status)
      if (key === "status") {
        return value === filterValue;
      }

      // Handle string filters
      return value
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    })
  );

  const handleEditRow = (row) => {
    setSelectedRow(row);
  };

  const handleUpdateRow = (updatedRow) => {
    refreshData(); // Refresh data after update
    setSelectedRow(null); // Close modal
  };

  const hiddenColumns = [
    "id",
    "created_at",
    "updated_at",
    "approved_by",
    "team_id",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>

        <div className="filter-container">
          {data.length > 0 &&
            Object.keys(data[0])
              .filter((col) => !hiddenColumns.includes(col))
              .map((col) => {
                // Determine the type of filter based on the column name or data
                const isDateField = [
                  "submission_date",
                  "publication_date",
                  "created_at",
                  "updated_at",
                ].includes(col);
                const isBooleanField = col === "phase";
                const isEnumField = col === "status";

                return (
                  <div key={col} className="filter-item">
                    {isDateField ? (
                      // Date filter
                      <input
                        type="date"
                        name={col}
                        value={filters[col] || ""}
                        onChange={handleFilterChange}
                        className="filter-input"
                      />
                    ) : isBooleanField ? (
                      // Dropdown for boolean fields (e.g., phase)
                      <select
                        name={col}
                        value={filters[col] || ""}
                        onChange={handleFilterChange}
                        className="filter-select"
                      >
                        <option value="">All Phases</option>
                        <option value="false">Application Phase</option>
                        <option value="true">Project Execution</option>
                      </select>
                    ) : isEnumField ? (
                      // Dropdown for enum-like fields (e.g., status)
                      <select
                        name={col}
                        value={filters[col] || ""}
                        onChange={handleFilterChange}
                        className="filter-select"
                      >
                        <option value="">All Statuses</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      // Text filter for other fields
                      <input
                        type="text"
                        name={col}
                        placeholder={`Search by ${col.replace(/_/g, " ")}`}
                        value={filters[col] || ""}
                        onChange={handleFilterChange}
                        className="filter-input"
                      />
                    )}
                  </div>
                );
              })}
        </div>

        {loading ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            Loading data...
          </p>
        ) : filteredData.length > 0 ? (
          <div className="table-container">
            <table className="category-table">
              <thead>
                <tr>
                  {Object.keys(data[0])
                    .filter((col) => !hiddenColumns.includes(col))
                    .map((col) => (
                      <th key={col}>
                        {col === "user_id"
                          ? "USER"
                          : col.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row)
                      .filter((col) => !hiddenColumns.includes(col))
                      .map((col) => (
                        <td key={col}>
                          {col === "user_id" ? (
                            userNames[row[col]] || "Loading..."
                          ) : col === "status" ? (
                            <span
                              className={`status-badge ${row[
                                col
                              ].toLowerCase()}`}
                            >
                              {row[col]}
                            </span>
                          ) : col === "phase" ? (
                            <span
                              className={`badge ${
                                row[col] === false
                                  ? "bg-primary" // Application Phase
                                  : row[col] === true
                                  ? "bg-success" // Project Execution
                                  : "bg-secondary" // Unknown Phase
                              }`}
                            >
                              {row[col] === false
                                ? "Application Phase"
                                : row[col] === true
                                ? "Project Execution"
                                : "Unknown Phase"}
                            </span>
                          ) : row[col] !== null ? (
                            row[col]
                          ) : (
                            "-"
                          )}
                        </td>
                      ))}
                    <td className="actions-column">
                      <button
                        className="icon-btn check-btn me-2"
                        onClick={() => handleApproveExpense(row)}
                        disabled={row.status === "approved"}
                      >
                        <IconCheck size={16} />
                      </button>
                      <button
                        className="icon-btn edit-btn me-2"
                        // onClick={() => onEdit(row)}
                        onClick={() => handleEditRow(row)}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => onDelete(row.id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>
            No data available.
          </p>
        )}

        {selectedRow && (
          <EditRowModal
            row={selectedRow}
            tableCategory={title.toLowerCase()}
            onClose={() => setSelectedRow(null)}
            onUpdate={handleUpdateRow}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicTableModal;
