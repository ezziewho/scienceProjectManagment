import React, { useState } from "react";
import "../../css/TaskCard.css";

function TaskCard({ task, isDone }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("task", JSON.stringify(task));
    };

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No due date";
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    };

    // If the task is in the "Done" column, it should always appear green.
    // Otherwise, determine if it's overdue.
    const taskClass = isDone
        ? "done-task"
        : task.dueDate && new Date(task.dueDate) < new Date()
        ? "overdue-task"
        : "";

    return (
        <div
            className={`task-card ${taskClass} ${isExpanded ? "expanded" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onClick={toggleExpand}
        >
            {/* Header with the task title */}
            <div className="task-card-header">
                <h5 className="task-card-title">{task.title}</h5>
            </div>

            {/* Task information */}
            <div className="task-card-info">
                <span className="task-card-due">Due: {formatDate(task.dueDate)}</span>
                <div className="task-card-users">
                    {task.usersResponsible || "No users assigned"}
                </div>
            </div>

            {/* Task description (visible only when expanded) */}
            {isExpanded && (
                <div className="task-card-description">
                    <p>{task.description || "No description available."}</p>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
