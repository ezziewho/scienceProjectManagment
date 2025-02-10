import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconEdit, IconTrash, IconRefresh } from "@tabler/icons-react";
import "../css/TaskTable.css"; // Styl tabeli
import EditTaskModal from "../components/modals/EditTaskModal"; // Modal edycji
import ConfirmDeleteTaskModal from "../components/modals/ConfirmDeleteTaskModal"; // Modal usuwania
import { useTasks } from "../hooks/useTasks"; // Hook do zarządzania zadaniami

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    stage: "",
    dueDate: "",
    responsibleUsers: "",
  });

  const [loading, setLoading] = useState(true); // Stan ładowania danych
  const [error, setError] = useState(""); // Obsługa błędów

  const { showAllTasks, setShowAllTasks, deleteTask, updateTask } =
    useTasks(filters);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8081/kanban/tasks/all", {
        params: filters,
        withCredentials: true,
      })
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load tasks.");
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Obsługa edycji zadania
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Obsługa usuwania zadania
  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="task-table-container">
      <h2>Task Management</h2>

      {/* Panel filtrów */}
      <div className="filters">
        <input
          type="text"
          name="title"
          placeholder="Search by Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <select
          name="stage"
          value={filters.stage}
          onChange={handleFilterChange}
        >
          <option value="">All Stages</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={filters.dueDate}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="responsibleUsers"
          placeholder="Search by Assigned User"
          value={filters.responsibleUsers}
          onChange={handleFilterChange}
        />
        <button
          className="btn-custom-blue"
          onClick={() => setShowAllTasks(!showAllTasks)}
        >
          <IconRefresh size={16} />
        </button>
      </div>

      {/* Obsługa błędów i ładowania */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Stage</th>
              <th>Due Date</th>
              <th>Responsible Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        task.stage === "Planning"
                          ? "bg-primary"
                          : task.stage === "In Progress"
                          ? "bg-warning text-dark"
                          : task.stage === "Review"
                          ? "bg-info text-dark"
                          : "bg-success"
                      }`}
                    >
                      {task.stage}
                    </span>
                  </td>
                  <td
                    className={
                      new Date(task.dueDate) < new Date() &&
                      task.stage !== "Done"
                        ? "text-danger"
                        : ""
                    }
                  >
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td>
                    {task.usersResponsible.split(", ").map((user, i) => (
                      <span key={i} className="badge bg-secondary me-1">
                        {user}
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(task)}
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(task)}
                    >
                      <IconTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal edycji */}
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={updateTask}
        />
      )}

      {/* Modal potwierdzenia usunięcia */}
      {isDeleteModalOpen && selectedTask && (
        <ConfirmDeleteTaskModal
          task={selectedTask}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={() => {
            deleteTask(selectedTask.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskTable;
