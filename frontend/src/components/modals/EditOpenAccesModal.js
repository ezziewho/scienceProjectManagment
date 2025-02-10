import React, { useState } from "react";
import axios from "axios";

const EditOpenAccessModal = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    publication_title: record.publication_title,
    journal: record.journal,
    submission_date: record.submission_date,
    publication_date: record.publication_date || "",
    total_cost: record.total_cost,
    status: record.status,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8081/budget/openaccess/${record.id}`,
        formData
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Błąd podczas aktualizacji:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Open Access Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="publication_title" className="form-label">
                Publication Title
              </label>
              <input
                type="text"
                className="form-control"
                id="publication_title"
                name="publication_title"
                value={formData.publication_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="journal" className="form-label">
                Journal
              </label>
              <input
                type="text"
                className="form-control"
                id="journal"
                name="journal"
                value={formData.journal}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="submission_date" className="form-label">
                Submission Date
              </label>
              <input
                type="date"
                className="form-control"
                id="submission_date"
                name="submission_date"
                value={formData.submission_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="publication_date" className="form-label">
                Publication Date
              </label>
              <input
                type="date"
                className="form-control"
                id="publication_date"
                name="publication_date"
                value={formData.publication_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="total_cost" className="form-label">
                Total Cost (PLN)
              </label>
              <input
                type="number"
                className="form-control"
                id="total_cost"
                name="total_cost"
                value={formData.total_cost}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
              Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpenAccessModal;
