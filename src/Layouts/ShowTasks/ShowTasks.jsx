// Imports
import React from "react";
import CardTask from "Components/CardTask/CardTask";
import { ContainerTasks } from "Pages/HomePage/HomePage.styled";

/**
 * Renders a list of tasks based on the `filteredTasks` prop passed to it.
 * @param {Object} props - The component props.
 * @param {Array} props.filteredTasks - The list of tasks to render.
 * @param {Function} props.setTasks - The function to update the list of tasks.
 * @param {Function} props.viewTask - The function to display a single task.
 * @param {Function} props.updateTask - Enhanced function to update a task.
 * @param {Function} props.deleteTask - Enhanced function to delete a task.
 * @returns {React.Component} A React component that displays a list of tasks.
 */

const ShowTasks = ({ filteredTasks, setTasks, viewTask, updateTask, deleteTask }) => {
  return (
    <>
      <ContainerTasks>
        {filteredTasks.map((task, index) => {
          return (
            <CardTask
              key={task.id || index}
              setTasks={setTasks}
              taskData={task}
              viewTask={viewTask}
              tasks={filteredTasks}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          );
        })}
      </ContainerTasks>
    </>
  );
};

export default ShowTasks;
