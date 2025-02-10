import React from "react";
import "../../css/Modal.css"; // Stylizacja modala

function ConfirmDeleteTaskModal({ task, onClose, onConfirmDelete }) {
  if (!task) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-md">
        {" "}
        {/* Zmienione z modal-sm na modal-md */}
        <div className="modal-content">
          {/* Nagłówek */}
          <div className="modal-header">
            <h5 className="modal-title">Delete Task</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Treść */}
          <div className="modal-body">
            <p>
              Are you sure you want to delete task <strong>{task.title}</strong>
              ?
            </p>
            <p className="text-muted">This action cannot be undone.</p>
          </div>

          {/* Stopka */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onConfirmDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteTaskModal;
