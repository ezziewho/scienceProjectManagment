import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import "../../css/Modal.css";

function EditTaskModal({ task, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: task.title || "",
        description: task.description || "",
        stage: task.stage || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "", // Formatowanie daty
        assignedUsers: task.assignedUsers || [], // Lista przypisanych użytkowników
    });

    const [users, setUsers] = useState([]); // Wszystkich dostępnych użytkowników
    const [stages, setStages] = useState([]); // Etapy zadania
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pobieranie użytkowników i etapów z backendu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, stagesResponse] = await Promise.all([
                    axios.get("http://localhost:8081/user/team"),
                    axios.get("http://localhost:8081/kanban/tasks/stages"),
                ]);

                setUsers(usersResponse.data);
                setStages(stagesResponse.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data.");
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddUser = (user) => {
        setFormData((prev) => ({
            ...prev,
            assignedUsers: [...prev.assignedUsers, user.name],
        }));
    };

    const handleRemoveUser = (user) => {
        setFormData((prev) => ({
            ...prev,
            assignedUsers: prev.assignedUsers.filter((u) => u !== user.name),
        }));
    };

    const sortedUsers = [...users].sort((a, b) => {
        const isASelected = formData.assignedUsers.includes(a.name);
        const isBSelected = formData.assignedUsers.includes(b.name);
        if (isASelected && !isBSelected) return -1;
        if (!isASelected && isBSelected) return 1;
        return 0;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:8081/kanban/tasks/${task.id}`,
                formData
            );
            onUpdate(response.data); // Zaktualizuj dane w głównym komponencie
            console.log("Task updated successfully:", response.data);
            onClose(); // Zamknij modal
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            {/* Stage */}
                            <div className="mb-3">
                                <label htmlFor="stage" className="form-label">
                                    Stage
                                </label>
                                <select
                                    id="stage"
                                    name="stage"
                                    className="form-select"
                                    value={formData.stage}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {stages.map((stage, index) => (
                                        <option key={index} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date */}
                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    className="form-control"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Assign Users */}
                            <div className="mb-3">
                                <label className="form-label">Assign Users</label>
                                <ul className="list-group">
                                    {sortedUsers.map((user) => (
                                        <li
                                            key={user.id}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                                formData.assignedUsers.includes(user.name)
                                                    ? "bg-success text-white"
                                                    : ""
                                            }`}
                                        >
                                            {user.name}
                                            {formData.assignedUsers.includes(user.name) ? (
                                                <IconTrash
                                                    size={20}
                                                    color="white"
                                                    onClick={() => handleRemoveUser(user)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            ) : (
                                                <IconPlus
                                                    size={20}
                                                    color="green"
                                                    onClick={() => handleAddUser(user)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTaskModal;
