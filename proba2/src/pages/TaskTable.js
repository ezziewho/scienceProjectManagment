import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import "../css/TaskTable.css"; // Styl tabeli
import EditTaskModal from "../components/modals/EditTaskModal"; // Importujemy modal edycji

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    taskId: "",
    title: "",
    stage: "",
    dueDate: "",
    responsibleUsers: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false); // Czy modal edycji jest otwarty
  const [currentTask, setCurrentTask] = useState(null); // Aktualnie edytowane zadanie

  useEffect(() => {
    axios
      .get("http://localhost:8081/kanban/tasks/all", { withCredentials: true })
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load tasks.");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleEditClick = (task) => {
    setCurrentTask(task); // Ustawiamy aktualnie edytowane zadanie
    setShowEditModal(true); // Otwieramy modal edycji
  };

  const handleUpdateTask = (updatedTask) => {
    // Aktualizacja zadania w tabeli
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setShowEditModal(false); // Zamykamy modal
    setCurrentTask(null); // Resetujemy aktualne zadanie
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.taskId === "" || task.id.toString().includes(filters.taskId)) &&
      (filters.title === "" || task.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.stage === "" || task.stage.toLowerCase().includes(filters.stage.toLowerCase())) &&
      (filters.dueDate === "" || task.dueDate.includes(filters.dueDate)) &&
      (filters.responsibleUsers === "" ||
        task.usersResponsible.toLowerCase().includes(filters.responsibleUsers.toLowerCase()))
    );
  });

  if (loading) {
    return <div className="task-table-container">Loading tasks...</div>;
  }

  if (error) {
    return <div className="task-table-container">{error}</div>;
  }

  return (
    <div className="task-table-container">
      {/* Filtry */}
      <div className="filters">
        <input
          type="text"
          name="taskId"
          placeholder="Search by Task ID"
          value={filters.taskId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="title"
          placeholder="Search by Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="stage"
          placeholder="Search by Stage"
          value={filters.stage}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="dueDate"
          placeholder="Search by Due Date"
          value={filters.dueDate}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="responsibleUsers"
          placeholder="Search by Responsible Users"
          value={filters.responsibleUsers}
          onChange={handleFilterChange}
        />
      </div>

      {/* Tabela */}
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
          {filteredTasks.map((task) => (
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
                  new Date(task.dueDate) < new Date() && task.stage !== "Done"
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
                  className="btn btn-sm btn-custom-blue me-2" style={{ backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}
                  onClick={() => handleEditClick(task)}
                >
                  <IconSearch  size={16} />
                </button>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEditClick(task)}
                >
                  <IconEdit size={16} />
                </button>
                <button className="btn btn-sm btn-danger">
                  <IconTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal edycji */}
      {showEditModal && currentTask && (
        <EditTaskModal
          task={currentTask}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default TaskTable;
