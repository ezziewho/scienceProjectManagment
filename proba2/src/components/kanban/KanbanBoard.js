import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useTasks } from "../../hooks/useTasks"; // Replace with your hooks or task data
import TaskColumn from "./TaskColumn";
import "../../css/KanbanBoard.css"; // Import custom styles for Kanban
import { useAuth } from "../../hooks/AuthContext"; // Import useAuth to get user data

const KanbanBoard = () => {
    const { tasks, updateTask, showAllTasks, setShowAllTasks, loading, error } = useTasks();
    const stages = ["Planning", "In Progress", "Review", "Done"];
    const { currentUser } = useAuth(); // Get current user info

    // Group tasks by stage
    const groupedTasks = stages.reduce((acc, stage) => {
        acc[stage] = tasks.filter((task) => task.stage === stage);
        return acc;
    }, {});

    // Handle Drag-and-Drop logic
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const updatedTasks = [...tasks];
        const movedTask = updatedTasks.find((task) => task.id === Number(draggableId));
        if (movedTask) {
            movedTask.stage = destination.droppableId;
            updateTask(movedTask);
        }
    };

    return (
        <div className="kanban-container">
        {/* Toggle for Show All Tasks */}
        <div className="kanban-controls">
          <label>
            <input
              type="checkbox"
              checked={showAllTasks}
              onChange={(e) => setShowAllTasks(e.target.checked)}
            />
            Show all tasks
          </label>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
                <div className="kanban-columns">
                {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            stages.map((stage, index) => (
                        <TaskColumn
                            key={index}
                            stage={stage}
                            tasks={groupedTasks[stage]}
                            onDrop={(updatedTask) => {
                                updatedTask.stage = stage;
                                updateTask(updatedTask);
                            }}
                        />
            ))
                    )}
                </div>
            </div>
        </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
