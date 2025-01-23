import React from "react";
import TaskCard from "./TaskCard";
import "../../css/TaskColumn.css";

function TaskColumn({ stage, tasks, onDrop }) {
    const handleDrop = (event) => {
        event.preventDefault();
        const task = JSON.parse(event.dataTransfer.getData("task"));
        onDrop({ ...task, stage }); // Update the task's stage
    };

    const handleDragOver = (event) => event.preventDefault();

    return (
        <div
            className="task-column"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Nagłówek kolumny */}
            <div className="task-column-header">
                <h4>{stage}</h4>
            </div>

            {/* Ciało kolumny */}
            <div className="task-column-body">
                {tasks.length > 0 ? (
                    tasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                    <span className="no-tasks">No tasks</span>
                )}
            </div>
        </div>
    );
}

export default TaskColumn;
