import React, { useState } from "react";
import "../../css/DynamicTableModal.css";  
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";

const DynamicTableModal = ({ title, data, loading, onClose, onEdit, onDelete, onView }) => {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const filteredData = data.filter((row) =>
        Object.keys(filters).every((key) =>
            !filters[key] || row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
        )
    );

    const hiddenColumns = ["created_at", "updated_at", "approved_by"];

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
                            .filter(col => !hiddenColumns.includes(col))
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
                    <p style={{ textAlign: "center", fontStyle: "italic" }}>Loading data...</p>
                ) : filteredData.length > 0 ? (
                    <div className="table-container">
                        <table className="category-table">
                            <thead>
                                <tr>
                                    {Object.keys(data[0])
                                        .filter(col => !hiddenColumns.includes(col))
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
                                            .filter(col => !hiddenColumns.includes(col))
                                            .map((col) => (
                                                <td key={col}>
                                                    {col === "status" ? (
                                                        <span className={`status-badge ${row[col].toLowerCase()}`}>
                                                            {row[col]}
                                                        </span>
                                                    ) : (
                                                        row[col] !== null ? row[col] : "-"
                                                    )}
                                                </td>
                                            ))}
                                        <td className="actions-column">
                                            <button className="icon-btn view-btn me-2" onClick={() => onView(row)}>
                                                <IconSearch size={16} />
                                            </button>
                                            <button className="icon-btn edit-btn me-2" onClick={() => onEdit(row)}>
                                                <IconEdit size={16} />
                                            </button>
                                            <button className="icon-btn delete-btn" onClick={() => onDelete(row.id)}>
                                                <IconTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ textAlign: "center", fontStyle: "italic" }}>No data available.</p>
                )}
            </div>
        </div>
    );
};

export default DynamicTableModal;
