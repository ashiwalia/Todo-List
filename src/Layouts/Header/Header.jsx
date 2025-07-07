// Imports
import React, { useState, useContext } from "react";
import AuthContext from "Contexts/Toast-Context";
import { Spinner, Badge } from "react-bootstrap";

// import styles
import {
  TaskBtn,
  Container,
  DateContainer,
  NotificationContainer,
  NotificationIcon,
  NotificationBadge,
  SyncStatusContainer,
  SyncIcon,
} from "./Header.styled";

// import components
import SearchBar from "Components/SearchBar/SearchBar";
import TaskModal from "Components/TaskModal/TaskModal";
import ToastModal from "Components/ToastModal/ToastModal";
import formatDate from "Utils/formatDate";
import { MdNotifications } from "react-icons/md";
import { FaCloud, FaCloudDownloadAlt, FaCog, FaHistory } from "react-icons/fa";
import { Button } from "react-bootstrap";

// Get the current date
let currentDate = new Date().toLocaleDateString();

/**
 * Layout that displays header of page which contains search-bar ,date and new task button
 * @param {Object} props - The component props
 * @param {Function} props.setTasks - The function to update the list of tasks
 * @param {Array} props.tasks - The list of tasks
 * @param {Function} props.handleInputChange - The function to handle changes in the search bar
 * @param {string} props.searchTerm - The current search term entered in the search bar
 * @param {string} props.syncStatus - Current sync status
 * @param {boolean} props.cloudEnabled - Whether cloud storage is enabled
 * @param {boolean} props.isSyncing - Whether currently syncing
 * @param {Function} props.onCloudSetup - Function to open cloud setup modal
 * @returns {React.Layout} The header component
 */
const Header = ({
  setTasks,
  tasks,
  handleInputChange,
  searchTerm,
  storedTasks,
  syncStatus = 'offline',
  cloudEnabled = false,
  isSyncing = false,
  onCloudSetup,
  onRecoverFromBackup,
  backupInfo = []
}) => {
  const ctx = useContext(AuthContext);
  const getTodayAndUnCompletedTasks = () => {
    return storedTasks.filter(
      (task) =>
        formatDate(task.date) === formatDate(new Date()) &&
        task.completed === "uncompleted"
    );
  };

  const todayTasks = getTodayAndUnCompletedTasks();

  // State to control the visibility of the add new task modal
  const [showAddNewTask, setShowAddNewTask] = useState(false);

  /**
   * Handle recovery from backup
   */
  const handleRecoveryClick = async () => {
    if (backupInfo.length === 0) {
      alert('No backup data available');
      return;
    }
    
    const latestBackup = backupInfo[0];
    const confirmMessage = `Recover ${latestBackup.taskCount} tasks from backup created on ${new Date(latestBackup.timestamp).toLocaleString()}?\n\nThis will replace your current tasks.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const success = await onRecoverFromBackup();
        if (success) {
          alert('Tasks successfully recovered from backup!');
        } else {
          alert('Failed to recover from backup. Please try again.');
        }
      } catch (error) {
        console.error('Recovery failed:', error);
        alert('Error occurred during recovery. Please try again.');
      }
    }
  };

  /**
   * Get sync status icon and variant
   */
  const getSyncStatusDisplay = () => {
    if (isSyncing) {
      return {
        icon: <Spinner animation="border" size="sm" />,
        variant: 'primary',
        text: 'Syncing...'
      };
    }
    
    switch (syncStatus) {
      case 'synced':
        return {
          icon: <FaCloud />,
          variant: 'success',
          text: cloudEnabled ? 'Firebase Synced' : 'Synced'
        };
      case 'error':
        return {
          icon: <FaCloudDownloadAlt />,
          variant: 'danger',
          text: 'Firebase Error'
        };
      default:
        return {
          icon: <FaCog />,
          variant: 'secondary',
          text: cloudEnabled ? 'Firebase Offline' : 'Configure Firebase'
        };
    }
  };

  const syncDisplay = getSyncStatusDisplay();

  /**
   * Handles the click event for the new task button and shows the add new task modal
   */
  const handleNewTaskClick = () => {
    setShowAddNewTask(true);
  };

  return (
    <Container>
      <SearchBar
        tasks={tasks}
        handleInputChange={handleInputChange}
        searchTerm={searchTerm}
      />
      <DateContainer>{currentDate}</DateContainer>
      
      {/* Sync Status */}
      <SyncStatusContainer onClick={onCloudSetup} title="Click to configure Firebase storage">
        <Badge bg={syncDisplay.variant} className="d-flex align-items-center">
          <SyncIcon className="me-1">
            {syncDisplay.icon}
          </SyncIcon>
          {syncDisplay.text}
        </Badge>
      </SyncStatusContainer>
      
      <NotificationContainer onClick={ctx.setShowToast}>
        <NotificationIcon>
          <MdNotifications size={32} />
          {todayTasks.length > 0 && (
            <NotificationBadge>{todayTasks.length}</NotificationBadge>
          )}
        </NotificationIcon>
        
        {/* Recovery Button - only show if backups exist */}
        {backupInfo.length > 0 && (
          <Button 
            variant="outline-warning" 
            size="sm" 
            onClick={handleRecoveryClick}
            className="me-2"
            title={`Recover from backup (${backupInfo[0].taskCount} tasks available)`}
          >
            <FaHistory className="me-1" />
            Recovery
          </Button>
        )}
        
        <TaskBtn onClick={handleNewTaskClick} variant="primary">
          Add New Task
        </TaskBtn>{" "}
      </NotificationContainer>
      <TaskModal
        showAddNewTask={showAddNewTask}
        setShowAddNewTask={setShowAddNewTask}
        taskMode={"Add"}
        setTasks={setTasks}
        tasks={tasks}
      />
      <ToastModal TasksCount={todayTasks.length} />
    </Container>
  );
};

export default Header;
