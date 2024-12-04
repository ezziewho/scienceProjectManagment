import React, { useState } from "react";
import TaskColumn from "./TaskColumn";
import AddTaskModal from "./AddTaskModal";
import { useTasks } from "../../hooks/useTasks";

function KanbanBoard() {
  const { tasks, updateTask, addTask } = useTasks(); // Fetch tasks and actions
  const stages = ["Planning", "In Progress", "Review", "Done"];

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4">Kanban Board</h1>
      <div className="text-center mb-4">
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addTaskModal"
        >
          Add Task
        </button>
      </div>
      <div className="row">
        {stages.map((stage, index) => (
          <TaskColumn
            key={index}
            stage={stage}
            tasks={tasks.filter((task) => task.stage === stage)}
            onDrop={updateTask} // Handle task updates on drag-and-drop
          />
        ))}
      </div>
      <AddTaskModal onAdd={addTask} stages={stages} />
    </div>
  );
}

export default KanbanBoard;
