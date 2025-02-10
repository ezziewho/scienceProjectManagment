import React, { useState } from "react";
import TaskAdminFile from "./TaskAdminFile";
import TeamAdminFile from "./TeamAdminFile";
import BudgetDocuments from "./BudgetDocuments";
import "../../css/DocumentsAdmin.css"; // Używamy tego samego stylu

const AdminPanelByCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("task");
  const [showPanel, setShowPanel] = useState(false); // Czy panel jest otwarty?

  return (
    <div className="task-documents-container">
      <div className="task-documents-section">
        <h2>Select Document Category</h2>
        <select
          className="form-control"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="task">Task Files</option>
          <option value="team">Team Files</option>
          <option value="budget">Budget Files</option>
        </select>

        {/* Przycisk otwierający panel */}
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowPanel(true)}
        >
          Open Panel
        </button>
      </div>

      {/* Wyświetlanie odpowiedniego panelu po kliknięciu przycisku */}
      {showPanel && (
        <div className="task-documents-panel">
          {selectedCategory === "task" && <TaskAdminFile />}
          {selectedCategory === "team" && <TeamAdminFile />}
          {selectedCategory === "budget" && <BudgetDocuments />}
        </div>
      )}
    </div>
  );
};

export default AdminPanelByCategory;
