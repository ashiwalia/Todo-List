// Imports
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsFillCalendarDateFill } from "react-icons/bs";

//import styles
import {
  CardContainer,
  StatusBtn,
  Footer,
  Settings,
  IconContainer,
  DateContainer,
} from "./CardTask.styled";

// import components
import DeleteTaskModal from "Components/DeleteTaskModal/DeleteTaskModal";
import TaskModal from "Components/TaskModal/TaskModal";
import formatDate from "Utils/formatDate";
/**
 * Component that displays card task that contains the information of task
 *
 * @param {Object} taskData - The task data object
 * @param {Function} setTasks - Function to set tasks
 * @param {Array} tasks - Array of tasks
 * @param {boolean} viewTask - View mode
 * @param {Function} updateTask - Enhanced function to update a task
 * @param {Function} deleteTask - Enhanced function to delete a task
 * @returns {React.Component}
 */
const CardTask = ({ taskData, setTasks, tasks, viewTask, updateTask, deleteTask }) => {
  //  state that handle task is completed or  not
  const [state, setState] = useState(taskData.completed);
  //  state that handle task is important or not
  const [starTask, setStarTask] = useState(taskData.important);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [showAddNewTask, setShowAddNewTask] = useState(false);

  // handle state change of task progress
  const handleToggleState = async () => {
    const newState = state === "completed" ? "uncompleted" : "completed";
    
    // Use enhanced storage if available, otherwise fallback to localStorage
    if (typeof updateTask === 'function') {
      await updateTask(taskData.id || taskData.title, { completed: newState });
    } else {
      // Fallback to localStorage method
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      const taskToEdit = storedTasks.find((task) => 
        task.id === taskData.id || task.title === taskData.title
      );
      if (taskToEdit) {
        taskToEdit.completed = newState;
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
        if (typeof setTasks === 'function') {
          setTasks(storedTasks);
        }
      }
    }
    
    setState(newState);
  };

  // handle is favorite task or not
  const handleFavoriteTasks = async () => {
    const newImportant = !starTask;
    
    // Use enhanced storage if available, otherwise fallback to localStorage
    if (typeof updateTask === 'function') {
      await updateTask(taskData.id || taskData.title, { important: newImportant });
    } else {
      // Fallback to localStorage method
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      const taskToEdit = storedTasks.find((task) => 
        task.id === taskData.id || task.title === taskData.title
      );
      if (taskToEdit) {
        taskToEdit.important = newImportant;
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
        if (typeof setTasks === 'function') {
          setTasks(storedTasks);
        }
      }
    }
    
    setStarTask(newImportant);
  };

  useEffect(() => {
    setState(taskData.completed);
    setStarTask(taskData.important);
  }, [taskData]);

  return (
    <CardContainer viewTask={viewTask}>
      <Card.Body>
        <Card.Title>{taskData.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-dark">
          {taskData.description}
        </Card.Subtitle>
        <Card.Text>
          <DateContainer>
            <span>
              <BsFillCalendarDateFill />
            </span>
            <span>{formatDate(taskData.date)}</span>
          </DateContainer>
        </Card.Text>
      </Card.Body>
      <hr />
      <Footer viewTask={viewTask}>
        <StatusBtn
          viewTask={viewTask}
          colorState={state}
          onClick={handleToggleState}
        >
          {state}
        </StatusBtn>
        <Settings viewTask={viewTask}>
          {!starTask && (
            <IconContainer>
              <AiOutlineStar onClick={handleFavoriteTasks} size={25} />
            </IconContainer>
          )}
          <IconContainer>
            {starTask && <AiFillStar onClick={handleFavoriteTasks} size={25} />}
          </IconContainer>
          <IconContainer>
            <RiDeleteBinLine onClick={() => setDeleteTaskModal(true)} size={25} />
          </IconContainer>
          <IconContainer>
            <BiDotsVerticalRounded
              onClick={() => setShowAddNewTask(true)}
              size={25}
            />
          </IconContainer>
        </Settings>
      </Footer>
      <DeleteTaskModal
        deleteTask={deleteTaskModal}
        setDeleteTask={setDeleteTaskModal}
        singleTask={true}
        titleTask={taskData.title}
        taskId={taskData.id}
        setTasks={setTasks}
        deleteTaskFunction={deleteTask}
      />
      <TaskModal
        showAddNewTask={showAddNewTask}
        setShowAddNewTask={setShowAddNewTask}
        taskMode={"Edit"}
        titleTask={taskData.title}
        tasks={tasks}
        setTasks={setTasks}
        updateTask={updateTask}
      />
    </CardContainer>
  );
};

export default CardTask;
