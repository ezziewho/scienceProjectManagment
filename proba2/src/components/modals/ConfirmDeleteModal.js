import React from "react";

function ConfirmDeleteModal({ user, onClose, onDelete }) {
    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Potwierdź usunięcie</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Czy na pewno chcesz usunąć użytkownika <strong>{user.name}</strong>?</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Anuluj
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => onDelete(user.id)}
                        >
                            Usuń
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
