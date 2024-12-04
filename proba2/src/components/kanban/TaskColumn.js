import React from "react";
import TaskCard from "./TaskCard";

function TaskColumn({ stage, tasks, onDrop }) {
  const handleDrop = (event) => {
    event.preventDefault();
    const task = JSON.parse(event.dataTransfer.getData("task"));
    onDrop({ ...task, stage }); // Update the task's stage
  };

  const handleDragOver = (event) => event.preventDefault();

  return (
    <div
      className="col-md-3"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h4>{stage}</h4>
        </div>
        <div className="card-body bg-light" style={{ minHeight: "300px" }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskColumn;
