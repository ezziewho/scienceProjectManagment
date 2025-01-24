import React, { useState } from "react";
import TaskCard from "./TaskCard";
import "../../css/TaskColumn.css";

function TaskColumn({ stage, tasks, onDrop, userRole }) {
    const [showModal, setShowModal] = useState(false);

    const handleDrop = (event) => {
        event.preventDefault();
        const task = JSON.parse(event.dataTransfer.getData("task"));

        if (stage === "Done" && userRole !== "admin") {
            setShowModal(true); // Pokazujemy modal
            return;
        }

        onDrop({ ...task, stage }); // Aktualizacja stage taska
    };

    const handleDragOver = (event) => event.preventDefault();

    return (
        <div
            className="task-column"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Modal Bootstrap */}
            {showModal && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Access Denied</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Only admins can move tasks to the "Done" column.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nagłówek kolumny */}
            <div className="task-column-header">
                <h4>{stage}</h4>
            </div>

            {/* Ciało kolumny */}
            <div className="task-column-body">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            isDone={stage === "Done"} // Przekazujemy, czy task jest w kolumnie "Done"
                        />
                    ))
                ) : (
                    <span className="no-tasks">No tasks</span>
                )}
            </div>
        </div>
    );
}

export default TaskColumn;
