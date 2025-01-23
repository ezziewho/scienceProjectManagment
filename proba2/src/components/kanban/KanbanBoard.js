import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useTasks } from "../../hooks/useTasks"; // Replace with your hooks or task data
import TaskColumn from "./TaskColumn";
import "../../css/KanbanBoard.css"; // Import custom styles for Kanban

const KanbanBoard = () => {
    const { tasks, updateTask } = useTasks();
    const stages = ["Planning", "In Progress", "Review", "Done"];

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
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
                <h1 className="kanban-title">Kanban Board</h1>
                <div className="kanban-columns">
                    {stages.map((stage, index) => (
                        <TaskColumn
                            key={index}
                            stage={stage}
                            tasks={groupedTasks[stage]}
                            onDrop={(updatedTask) => {
                                updatedTask.stage = stage;
                                updateTask(updatedTask);
                            }}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;

/*import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useTasks } from "../../hooks/useTasks"; // Replace with your hooks or task data
import TaskColumn from "./TaskColumn";

const KanbanBoard = () => {
    const { tasks, updateTask } = useTasks(); // Fetch tasks and update logic
    const stages = ["Planning", "In Progress", "Review", "Done"];

    // Group tasks by stage
    const groupedTasks = stages.reduce((acc, stage) => {
        acc[stage] = tasks.filter((task) => task.stage === stage);
        return acc;
    }, {});

    // Handle Drag-and-Drop logic
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // If dropped outside a valid droppable area, do nothing
        if (!destination) return;

        // If dropped in the same position, do nothing
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Update the task stage
        const updatedTasks = [...tasks];
        const movedTask = updatedTasks.find((task) => task.id === Number(draggableId));
        if (movedTask) {
            movedTask.stage = destination.droppableId;
            updateTask(movedTask); // Call API or state update to persist
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="container-fluid mt-4">
                <h1 className="text-center mb-4">Kanban Board</h1>
                <div className="row">
                    {stages.map((stage, index) => (
                        <TaskColumn
                            key={index}
                            stage={stage}
                            tasks={groupedTasks[stage]}
                            onDrop={(updatedTask) => {
                                updatedTask.stage = stage;
                                updateTask(updatedTask);
                            }}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
*/