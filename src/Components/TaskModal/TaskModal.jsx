// Imports
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";

import {
  ModalContainer,
  Label,
  Footer,
  AddTaskBtn,
  ProgressCheck,
  TaskStatus,
  DateStyled,
  DropdownContainer,
  AlertTitle,
} from "./TaskModal.styled";

const newTask = [
  {
    title: "Task 1",
    description: "This is a new task",
    date: "2023-03-01",
    important: true,
    completed: "uncompleted",
  },
  {
    title: "Task 2",
    description: "This is a new task",
    date: "2023-03-03",
    important: false,
    completed: "uncompleted",
  },
  {
    title: "Task 3",
    description: "This is a new task",
    date: "2023-04-24",
    important: true,
    completed: "completed",
  },
];

// Initialize localStorage with default tasks if empty
const initializeLocalStorage = () => {
  try {
    const storedTasks = localStorage.getItem("tasks");
    if (!storedTasks) {
      localStorage.setItem("tasks", JSON.stringify(newTask));
      return newTask;
    }
    return JSON.parse(storedTasks);
  } catch (error) {
    console.error("Error initializing localStorage:", error);
    // If there's an error, reset localStorage
    localStorage.setItem("tasks", JSON.stringify(newTask));
    return newTask;
  }
};

// Initialize tasks in localStorage
const storedTasks = initializeLocalStorage();

/**

* Component that displays task modal which have title ,description ,date and status of task
* @param {boolean} showAddNewTask - A value that contains on or off modal task
* @param {function} setShowAddNewTask - A function that sets value of on or off of task modal
* @param {string} taskMode - A string that indicates whether it is Add or Edit mode
* @param {string} titleTask - A string that contains the title of the task being edited
* @param {function} setTasks - A function that sets the state of the tasks
* @param {array} tasks - An array that contains the list of tasks
* @returns {React.Component}
*/

const TaskModal = ({
  showAddNewTask,
  setShowAddNewTask,
  taskMode,
  titleTask,
  setTasks,
  tasks,
}) => {
  // get all information of task
  const getTaskInfo = (title) => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (!storedTasks) {
        return null;
      }
      const tasks = JSON.parse(storedTasks);
      const task = tasks.find(task => task.title === title);
      if (task) {
        return {
          title: task.title,
          description: task.description,
          date: task.date,
          important: task.important,
          completed: task.completed,
        };
      }
    } catch (error) {
      console.error("Error getting task info:", error);
    }
    return null;
  };

  // Use states
  // const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState(
    taskMode === "Edit" ? getTaskInfo(titleTask)?.title : ""
  );
  const [date, setDate] = useState(
    taskMode === "Edit" ? getTaskInfo(titleTask)?.date : new Date()
  );
  const [description, setDescription] = useState(
    taskMode === "Edit" ? getTaskInfo(titleTask)?.description : ""
  );
  const [important, setImportant] = useState(
    taskMode === "Edit" ? getTaskInfo(titleTask)?.important : false
  );
  const [completed, setCompleted] = useState(
    taskMode === "Edit" ? getTaskInfo(titleTask)?.completed === "completed" : false
  );
  const [titleIsUsed, setTitleIsUsed] = useState(false);
  // const [directory, setDirectory] = useState("Main");

  // functions that handle states
  const handleTitle = (event) => setTitle(event.target.value);
  const handleDate = (event) => {
    setDate(event);
  };
  const handleDescription = (event) => setDescription(event.target.value);
  // const handleDirectory = (event) => setDirectory(event.target.value);

  // handle submition of add task
  const handleSubmitTask = (event) => {
    event.preventDefault();
    
    try {
      // Always get latest tasks from localStorage
      const currentStoredTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      
      const found = currentStoredTasks.find((task) => task.title === title);

      if (found === undefined && title !== "") {
        setTitleIsUsed(false);
        
        const newTaskObj = {
          title: title,
          description: description,
          date: date,
          important: important,
          completed: completed ? "completed" : "uncompleted",
        };
        
        const newTasksArray = [...currentStoredTasks, newTaskObj];
        
        // Update localStorage first
        localStorage.setItem("tasks", JSON.stringify(newTasksArray));
        
        // Then update state if setTasks is available
        if (typeof setTasks === 'function') {
          setTasks(newTasksArray);
        }
        
        clearAllData();
        // close modal window
        setShowAddNewTask(false);
      } else {
        setTitleIsUsed(true);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("There was an error adding the task. Please try again.");
    }
  };

  // Submit editing task
  const handleEditTask = (event) => {
    event.preventDefault();
    
    try {
      // Always get the most recent tasks from localStorage
      const currentTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      
      const editedTask = {
        title: title,
        description: description,
        date: date,
        important: important,
        completed: completed ? "completed" : "uncompleted",
      };
      
      const newTasks = currentTasks.map((task) => {
        if (task.title === titleTask) {
          return editedTask;
        } else {
          return task;
        }
      });
      
      // Update local storage first
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      
      // Then update state if setTasks is available
      if (typeof setTasks === 'function') {
        setTasks(newTasks);
      }
      
      setShowAddNewTask(false);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("There was an error updating the task. Please try again.");
    }
  };

  // clear all data
  const clearAllData = () => {
    setTitle("");
    setDescription("");
    setImportant(false);
    setCompleted(false);
    setTitleIsUsed(false);
  };

  // Use Effects
  useEffect(() => {
    try {
      // Ensure localStorage is initialized
      const tasks = initializeLocalStorage();
      
      // Only update state if setTasks is available
      if (typeof setTasks === 'function') {
        setTasks(tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      // If there's an error, try to reset localStorage
      const defaultTasks = [...newTask];
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
      if (typeof setTasks === 'function') {
        setTasks(defaultTasks);
      }
    }
  }, [setTasks]);

  return (
    <ModalContainer
      show={showAddNewTask}
      onHide={() => setShowAddNewTask(false)}
    >
      <Modal.Header closeButton>
        {taskMode === "Add" && <Modal.Title>Add a task</Modal.Title>}
        {taskMode === "Edit" && <Modal.Title>Edit a task</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="e.g: study for the test"
              autoFocus
              value={title}
              onChange={handleTitle}
              maxLength="100"
              required
            />
            {titleIsUsed && <AlertTitle>Task's Name Used Before</AlertTitle>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Label>Date</Label>
            <DateStyled onChange={handleDate} value={date} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Label>Description (optional)</Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="e.g: study for the test"
              onChange={handleDescription}
              maxLength="500"
              value={description}
            />
          </Form.Group>
        </Form>
        <DropdownContainer>
          <Form.Label>Select a directory</Form.Label>
          <Dropdown.Toggle id="dropdown-basic">Main</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Main</Dropdown.Item>
          </Dropdown.Menu>
        </DropdownContainer>
        <div>
          <ProgressCheck>
            <input
              className="form-check-input w-5vm"
              type="checkbox"
              id="state-one"
              onChange={(e) => setImportant(e.target.checked)}
              checked={important}
            />
            <TaskStatus>Mark as important</TaskStatus>
          </ProgressCheck>
          <ProgressCheck>
            <input
              className="form-check-input w-5vm"
              type="checkbox"
              id="state-two"
              onChange={(e) => setCompleted(e.target.checked)}
              checked={completed}
            />
            <TaskStatus>Mark as completed</TaskStatus>
          </ProgressCheck>
        </div>
      </Modal.Body>
      <Footer>
        {taskMode === "Add" && (
          <AddTaskBtn onClick={handleSubmitTask}>Add a task</AddTaskBtn>
        )}
        {taskMode === "Edit" && (
          <AddTaskBtn onClick={handleEditTask}>Edit a task</AddTaskBtn>
        )}
      </Footer>
    </ModalContainer>
  );
};

export default TaskModal;
