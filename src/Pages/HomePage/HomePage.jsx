import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FiList, FiX, FiMenu } from "react-icons/fi";
import { CiGrid41 } from "react-icons/ci";
import { Form } from 'react-bootstrap';

// Import styles
import {
  Container,
  CenterContainer,
  Section,
  CurrentItem,
  ShapeView,
  ChildView,
  HomeContainer,
  MobileNavToggle,
  MobileNavOverlay,
  MobileNavContainer,
  MobileNavItem,
  MobileNavHeader,
  SortContainer,
} from "./HomePage.styled";

// Import Components
import LeftSideBar from "Components/LeftSideBar/LeftSideBar";
import RightSideBar from "Components/RightSideBar/RightSideBar";
import Header from "Layouts/Header/Header";
import ShowTasks from "Layouts/ShowTasks/ShowTasks";
import FirebaseConfigModal from "Components/FirebaseConfigModal/FirebaseConfigModal";
import formatDate from "Utils/formatDate";

// Import enhanced hooks
import useTaskStorage from "Hooks/useTaskStorage";

// Default tasks
const defaultTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "This is a new task",
    date: "2023-03-01",
    important: true,
    completed: "uncompleted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Task 2",
    description: "This is a new task",
    date: "2023-03-03",
    important: false,
    completed: "uncompleted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Task 3",
    description: "This is a new task",
    date: "2023-04-24",
    important: true,
    completed: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

/**
 * Home page that displays main content of website
 *
 * @param {function handleToggleTheme()} handleToggleTheme  function that toggles the theme
 * @returns {React.Page}
 */
const HomePage = ({ handleToggleTheme, checkedSwitch }) => {
  const {
    tasks,
    isLoading,
    isSyncing,
    syncStatus,
    cloudEnabled,
    saveTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    syncWithCloud,
    getCloudSetupInstructions,
    recoverFromBackup,
    getBackupInfo,
    refresh: refreshTasks
  } = useTaskStorage('tasks', defaultTasks);

  // UI States
  const [viewTask, setViewTask] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("dueDate");
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  
  const location = useLocation();
  const url = location.pathname;
  const navStateTasks = url.split("/")[1];

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewList = () => {
    setViewTask(false);
  };
  
  const handleViewGrid = () => {
    setViewTask(true);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleFirebaseConfig = () => {
    setShowFirebaseConfig(true);
  };

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  const handleFirebaseSync = async () => {
    return await syncWithCloud();
  };

  const handleConfigUpdate = async () => {
    // Instead of a hard refresh, reinitialize tasks gracefully
    try {
      await refreshTasks();
      console.log('Tasks refreshed after Firebase config update');
    } catch (error) {
      console.error('Failed to refresh tasks after config update:', error);
      // Only as a last resort, offer to reload
      if (window.confirm('Firebase configuration updated but failed to refresh tasks. Reload the page?')) {
        window.location.reload();
      }
    }
  };

  // Sorting function
  const sortTasks = (tasks) => {
    switch (sortCriteria) {
      case "dueDate":
        return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "priority":
        return tasks.sort((a, b) => b.important - a.important);
      default:
        return tasks;
    }
  };

  // Get the filtered tasks based on the current URL
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    switch (navStateTasks) {
      case "today-tasks":
        filteredTasks = tasks.filter(
          (task) => formatDate(task.date) === formatDate(new Date())
        );
        break;
      case "important-tasks":
        filteredTasks = tasks.filter((task) => task.important);
        break;
      case "completed-tasks":
        filteredTasks = tasks.filter(
          (task) => task.completed === "completed"
        );
        break;
      case "uncompleted-tasks":
        filteredTasks = tasks.filter(
          (task) => task.completed === "uncompleted"
        );
        break;
      case "working-tasks":
        filteredTasks = tasks.filter(
          (task) => task.completed === "working"
        );
        break;
      default:
        break;
    }

    // Apply sorting
    return sortTasks(filteredTasks);
  };

  const checkUrl = (url) => {
    if (
      !(
        url === "today-tasks" ||
        url === "important-tasks" ||
        url === "today-tasks" ||
        url === "uncompleted-tasks" ||
        url === "working-tasks" ||
        url === "all-tasks"
      )
    ) {
      return "all-tasks";
    }
    return navStateTasks;
  };

  // Set the current tasks to be the active link
  const currentTasksInPageView = getFilteredTasks();

  const filteredTasks = currentTasksInPageView.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed === "completed");
  const numberOfCompletedTasks = completedTasks.length;

  // Loading state
  if (isLoading) {
    return (
      <HomeContainer>
        <Container>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading your tasks...</p>
            </div>
          </div>
        </Container>
      </HomeContainer>
    );
  }
  return (
    <HomeContainer>
      <Container>
        <Section>
          <LeftSideBar 
            setTasks={saveTasks} 
            tasks={tasks}
            addTask={addTask}
          />
        </Section>
        <CenterContainer>
          <Header
            setTasks={saveTasks}
            tasks={tasks}
            handleInputChange={handleInputChange}
            searchTerm={searchTerm}
            storedTasks={tasks}
            syncStatus={syncStatus}
            cloudEnabled={cloudEnabled}
            isSyncing={isSyncing}
            onCloudSetup={handleFirebaseConfig}
            onRecoverFromBackup={recoverFromBackup}
            backupInfo={getBackupInfo()}
          />
          <CurrentItem>
            {checkUrl(navStateTasks)} (
            {tasks && currentTasksInPageView.length} tasks)
          </CurrentItem>
          <SortContainer>
            <Form.Label htmlFor="sort">Sort by:</Form.Label>
            <Form.Select id="sort" value={sortCriteria} onChange={handleSortChange}>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </Form.Select>
          </SortContainer>
          <ShapeView>
            <ChildView onClick={handleViewList}>
              <FiList size={25} />
            </ChildView>
            <ChildView onClick={handleViewGrid}>
              <CiGrid41 size={25} />
            </ChildView>
          </ShapeView>
          <MobileNavToggle onClick={toggleMobileNav}>
            {showMobileNav ? <FiX size={25} /> : <FiMenu size={25} />}
          </MobileNavToggle>
          {showMobileNav && (
            <MobileNavOverlay>
              <MobileNavContainer>
                <MobileNavHeader>
                  <h2>Navigation</h2>
                  <button onClick={toggleMobileNav}>
                    <FiX />
                  </button>
                </MobileNavHeader>
                <div>
                  <MobileNavItem to="/all-tasks" onClick={toggleMobileNav}>
                    All Tasks
                  </MobileNavItem>
                  <MobileNavItem to="/today-tasks" onClick={toggleMobileNav}>
                    Today&apos;s Tasks
                  </MobileNavItem>
                  <MobileNavItem to="/important-tasks" onClick={toggleMobileNav}>
                    Important Tasks
                  </MobileNavItem>
                  <MobileNavItem to="/completed-tasks" onClick={toggleMobileNav}>
                    Completed Tasks
                  </MobileNavItem>
                  <MobileNavItem to="/uncompleted-tasks" onClick={toggleMobileNav}>
                    Uncompleted Tasks
                  </MobileNavItem>
                  <MobileNavItem to="/working-tasks" onClick={toggleMobileNav}>
                    Working Tasks
                  </MobileNavItem>
                </div>
              </MobileNavContainer>
            </MobileNavOverlay>
          )}
          <Routes>
            <Route
              path="all-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="today-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="important-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="completed-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="uncompleted-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="working-tasks"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
            <Route
              path="/*"
              element={
                <ShowTasks
                  filteredTasks={filteredTasks}
                  viewTask={viewTask}
                  setTasks={saveTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              }
            />
          </Routes>
        </CenterContainer>
        <Section>
          <RightSideBar
            handleToggleTheme={handleToggleTheme}
            setTasks={saveTasks}
            checkedSwitch={checkedSwitch}
            numberOfCompletedTasks={numberOfCompletedTasks}
            allTasksLength={tasks.length}
            deleteAllTasks={deleteAllTasks}
          />
        </Section>
      </Container>
      
      {/* Firebase Configuration Modal */}
      <FirebaseConfigModal
        show={showFirebaseConfig}
        onHide={() => setShowFirebaseConfig(false)}
        syncStatus={syncStatus}
        cloudEnabled={cloudEnabled}
        onSync={handleFirebaseSync}
        setupInstructions={getCloudSetupInstructions()}
        onConfigUpdate={handleConfigUpdate}
      />
    </HomeContainer>
  );
};

export default HomePage;
