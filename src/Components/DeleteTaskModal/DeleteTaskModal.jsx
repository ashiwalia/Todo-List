// Imports
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// imports styles
import { ConfirmBtn } from "./DeleteTaskModal.styled";

/**
 * Component that displays a confirmation modal to delete a certain task or all tasks
 * @param {boolean} deleteTask - Value that is on or off of confirmation modal
 * @param {function} setDeleteTask - Function to set value of deleteTask
 * @param {boolean} singleTask - Value that represents if only a single task is to be deleted or not
 * @param {string} titleTask - Title of the task to be deleted
 * @param {string} taskId - ID of the task to be deleted
 * @param {function} setTasks - Function to update the task list after task deletion
 * @param {function} deleteTaskFunction - Enhanced function to delete a task
 * @returns {React.Component} - Returns the delete task confirmation modal
 */
const DeleteTaskModal = ({
  deleteTask,
  setDeleteTask,
  singleTask,
  titleTask,
  taskId,
  setTasks,
  deleteTaskFunction
}) => {
  /**
   * Function to close the delete task confirmation modal
   */
  const closeDeleteTaskModal = () => {
    setDeleteTask(false);
  };

  /**
   * Function to delete the selected task(s) from the task list
   */
  const handleTaskDelete = async () => {
    try {
      // delete a certain task
      if (singleTask) {
        // Use enhanced storage if available, otherwise fallback to localStorage
        if (typeof deleteTaskFunction === 'function') {
          await deleteTaskFunction(taskId || titleTask);
        } else {
          // Fallback to localStorage method
          const storedTasks = JSON.parse(localStorage.getItem("tasks"));
          const taskIndex = storedTasks.findIndex(
            (task) => (task.id === taskId) || (task.title === titleTask)
          );

          if (taskIndex !== -1) {
            storedTasks.splice(taskIndex, 1);
            localStorage.setItem("tasks", JSON.stringify(storedTasks));
            if (typeof setTasks === 'function') {
              setTasks(storedTasks);
            }
          }
        }
      }
      // delete all tasks
      else {
        if (typeof deleteTaskFunction === 'function') {
          // This would be deleteAllTasks function
          await deleteTaskFunction();
        } else {
          // Fallback to localStorage method
          localStorage.setItem("tasks", JSON.stringify([]));
          if (typeof setTasks === 'function') {
            setTasks([]);
          }
        }
      }

      closeDeleteTaskModal();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("There was an error deleting the task. Please try again.");
    }
  };

  return (
    <Modal
      show={deleteTask}
      onHide={closeDeleteTaskModal}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton>
        {singleTask && (
          <Modal.Title>Are you sure to delete {titleTask}?</Modal.Title>
        )}
        {!singleTask && (
          <Modal.Title>Are you sure to delete all tasks ?</Modal.Title>
        )}
      </Modal.Header>
      {singleTask && (
        <Modal.Body>This task will be deleted permanently.</Modal.Body>
      )}
      {!singleTask && (
        <Modal.Body>All data will be deleted permanently.</Modal.Body>
      )}
      <Modal.Footer>
        <Button variant="transparent" onClick={closeDeleteTaskModal}>
          Cancel
        </Button>
        <ConfirmBtn onClick={handleTaskDelete}>Confirm</ConfirmBtn>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTaskModal;
