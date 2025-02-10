import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/DynamicTableModal.css";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";

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
        { id: row.id, category: row.category },
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
    Object.keys(filters).every(
      (key) =>
        !filters[key] ||
        row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const hiddenColumns = ["id", "created_at", "updated_at", "approved_by"];

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
              .map((col) => (
                <input
                  key={col}
                  type="text"
                  name={col}
                  placeholder={`Search by ${col.replace(/_/g, " ")}`}
                  value={filters[col] || ""}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              ))}
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
                      <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
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
                        onClick={() => onEdit(row)}
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
      </div>
    </div>
  );
};

export default DynamicTableModal;
