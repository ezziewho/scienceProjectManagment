import React from "react";

function TaskCard({ task }) {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
  };

  return (
    <div
      className="card mb-2 shadow-sm"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-body">
        <h5 className="card-title">{task.title}</h5>
        <p className="card-text">{task.description}</p>
      </div>
    </div>
  );
}

export default TaskCard;
