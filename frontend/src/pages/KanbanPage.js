import React, { useState } from "react";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskTable from "./TaskTable";
import { useAuth } from "../hooks/AuthContext";
import AddTaskModal from "../components/modals/AddTaskModal";
import "../css/KanbanBoard.css"; // Import pliku CSS

const KanbanPage = () => {
  const [view, setView] = useState("board"); // 'board' lub 'table'
  const { currentUser } = useAuth();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin"; // Sprawdzamy, czy użytkownik to admin

  return (
    <div className="kanban-background">
      {isAdmin && (
        <div className="kanban-buttons-container">
          <button
            className={`kanban-button ${
              view === "board" ? "active" : "inactive"
            }`}
            onClick={() => setView("board")}
          >
            Board
          </button>
          <button
            className={`kanban-button ${
              view === "table" ? "active" : "inactive"
            }`}
            onClick={() => setView("table")}
          >
            Table
          </button>
          <button
            className="add-task-button"
            onClick={() => setIsAddTaskModalOpen(true)}
          >
            Add Task
          </button>
        </div>
      )}

      {view === "board" && <KanbanBoard />}
      {view === "table" && <TaskTable />}

      {/* Modal Add Task */}
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={(newTask) => {
            console.log("New Task Added:", newTask);
            setIsAddTaskModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default KanbanPage;
