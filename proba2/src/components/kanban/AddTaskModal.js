import React, { useState } from "react";

function AddTaskModal({ onAdd, stages }) {
  const [newTask, setNewTask] = useState({ title: "", description: "", stage: "Planning" });

  const handleInputChange = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    alert("Add Task clicked"); 
    onAdd(newTask);
    setNewTask({ title: "", description: "", stage: "Planning" }); // Reset form
  };

  return (
    <div
      className="modal fade"
      id="addTaskModal"
      tabIndex="-1"
      aria-labelledby="addTaskModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addTaskModalLabel">Add New Task</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="taskDescription"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="taskStage" className="form-label">Stage</label>
                <select
                  className="form-select"
                  id="taskStage"
                  value={newTask.stage}
                  onChange={(e) => handleInputChange("stage", e.target.value)}
                >
                  {stages.map((stage, index) => (
                    <option key={index} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleAdd}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
