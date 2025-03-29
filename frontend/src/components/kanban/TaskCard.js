import React, { useState } from "react";
import {
  IconCalendar,
  IconUser,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import "../../css/TaskCard.css";

function TaskCard({ task, isDone, isPhaseAccepted }) {
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
    return new Intl.DateTimeFormat("en-GB", options).format(
      new Date(dateString)
    );
  };

  const taskClass = isDone
    ? "done-task"
    : task.dueDate && new Date(task.dueDate) < new Date()
    ? "overdue-task"
    : "";

  const taskPhaseClass = isPhaseAccepted ? "phase-accepted" : "phase-prepared";

  return (
    <div
      className={`task-card ${taskClass} ${
        isExpanded ? "expanded" : ""
      } ${taskPhaseClass}`}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Header with title and expand/collapse button */}
      <div className="task-card-header">
        <h5 className="task-card-title">{task.title}</h5>
        <button className="task-card-toggle" onClick={toggleExpand}>
          {isExpanded ? (
            <IconChevronUp size={20} />
          ) : (
            <IconChevronDown size={20} />
          )}
        </button>
      </div>

      {/* Info Section */}
      <div className="task-card-info">
        <div className="task-card-due">
          <IconCalendar size={16} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="task-card-users">
          <IconUser size={16} />
          <span>{task.usersResponsible || "No users assigned"}</span>
        </div>
      </div>

      {/* Description (visible only when expanded) */}
      {isExpanded && (
        <div className="task-card-description">
          <p>{task.description || "No description available."}</p>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
