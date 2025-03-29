import React, { useState } from "react";
import AdminPanelbyAll from "./AdminPanelbyAll";
import AdminPanelByCategory from "./AdminPanelByCategory";
import { useAuth } from "../../hooks/AuthContext";
import "../../css/DocumentAdminPanel.css"; // Import pliku CSS

const AdminDocumentPanel = () => {
  const [view, setView] = useState("byAll"); // 'board' lub 'table'
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "manager"; // Sprawdzamy, czy użytkownik to admin
  return (
    <div className="kanban-background">
      {isAdmin && (
        <div className="kanban-buttons-container">
          <button
            className={`kanban-button ${
              view === "byAll" ? "active" : "inactive"
            }`}
            onClick={() => setView("byAll")}
          >
            Search by All Files
          </button>
          <button
            className={`kanban-button ${
              view === "table" ? "active" : "inactive"
            }`}
            onClick={() => setView("table")}
          >
            Search by Category
          </button>
        </div>
      )}

      {view === "byAll" && <AdminPanelbyAll />}
      {view === "table" && <AdminPanelByCategory />}

      {/* Modal Add Task */}
    </div>
  );
};

export default AdminDocumentPanel;
