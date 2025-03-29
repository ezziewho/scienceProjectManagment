import React, { useState } from "react";
import axios from "axios";
import "../../css/Modal.css";

function EditRowModal({ row, tableCategory, onClose, onUpdate }) {
  const [formData, setFormData] = useState({ ...row });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("category:", tableCategory);
      const response = await axios.put(
        `http://localhost:8081/budget/update-expense`,
        { id: formData.id, expense_category: "equipment", ...formData },
        { withCredentials: true }
      );
      onUpdate(response.data.updatedExpense);
      console.log("Row updated successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Record</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map(
                (key) =>
                  key !== "id" && ( // Don't allow editing the ID
                    <div className="mb-3" key={key}>
                      <label htmlFor={key} className="form-label">
                        {key.replace(/_/g, " ").toUpperCase()}
                      </label>
                      <input
                        type="text"
                        id={key}
                        name={key}
                        className="form-control"
                        value={formData[key] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  )
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRowModal;
