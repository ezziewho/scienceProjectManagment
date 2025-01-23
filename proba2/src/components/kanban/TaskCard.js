import React, { useState } from "react";
import "../../css/TaskCard.css";

function TaskCard({ task }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("task", JSON.stringify(task));
    };

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    // Formatowanie daty w stylu DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "No due date";
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
        <div
            className={`task-card ${isExpanded ? "expanded" : ""} ${
                isOverdue ? "overdue" : ""
            }`}
            draggable
            onDragStart={handleDragStart}
            onClick={toggleExpand}
        >
            {/* Nagłówek z tytułem */}
            <div className="task-card-header">
                <h5 className="task-card-title">{task.title}</h5>
            </div>

            {/* Informacje o zadaniu */}
            <div className="task-card-info">
                <span className={`task-card-due ${isOverdue ? "overdue-badge" : ""}`}>
                    Due: {formatDate(task.dueDate)}
                </span>
                <div className="task-card-users">
                    {task.usersResponsible || "No users assigned"}
                </div>
            </div>

            {/* Rozwinięty opis */}
            {isExpanded && (
                <div className="task-card-description">
                    <p>{task.description || "No description available."}</p>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
