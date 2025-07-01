import { useState, useEffect, useCallback } from 'react';
import FirebaseStorageService from 'Services/FirebaseStorageService';

/**
 * Enhanced hook for managing tasks with Firebase Firestore support
 * 
 * This hook provides:
 * - Local storage as primary storage
 * - Firebase Firestore as cloud storage with real-time sync
 * - Automatic syncing between local and cloud
 * - Offline capabilities with automatic sync when online
 * - UI-configurable Firebase credentials (no environment variables needed)
 * 
 * @param {string} storageKey - Key for localStorage
 * @param {Array} defaultTasks - Default tasks if none exist
 * @returns {Object} Task management functions and state
 */
const useTaskStorage = (storageKey = 'tasks', defaultTasks = []) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('offline'); // 'offline', 'synced', 'error'
  const [cloudEnabled, setCloudEnabled] = useState(false);

  // Get tasks from localStorage
  const getLocalTasks = useCallback(() => {
    try {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks) {
        return JSON.parse(storedTasks);
      } else {
        // Initialize with default tasks
        localStorage.setItem(storageKey, JSON.stringify(defaultTasks));
        return defaultTasks;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultTasks;
    }
  }, [storageKey, defaultTasks]);

  // Initialize tasks from localStorage and Firebase
  const initializeTasks = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Check if Firebase storage is configured
      const isFirebaseEnabled = FirebaseStorageService.isEnabled();
      setCloudEnabled(isFirebaseEnabled);

      // Get tasks from localStorage
      const localTasks = getLocalTasks();

      if (isFirebaseEnabled) {
        // Sync with Firebase
        setIsSyncing(true);
        const syncedTasks = await FirebaseStorageService.syncTasks(localTasks);
        
        // If we got tasks from Firebase and they're different from local, update local
        if (syncedTasks.length > 0 && JSON.stringify(syncedTasks) !== JSON.stringify(localTasks)) {
          localStorage.setItem(storageKey, JSON.stringify(syncedTasks));
          setTasks(syncedTasks);
          setSyncStatus('synced');
        } else {
          setTasks(localTasks);
          setSyncStatus(syncedTasks.length > 0 ? 'synced' : 'offline');
        }
        setIsSyncing(false);
      } else {
        // Use local tasks only
        setTasks(localTasks);
        setSyncStatus('offline');
      }
    } catch (error) {
      console.error('Error initializing tasks:', error);
      // Fallback to local tasks
      const localTasks = getLocalTasks();
      setTasks(localTasks);
      setSyncStatus('error');
      setIsSyncing(false);
    }
    
    setIsLoading(false);
  }, [storageKey, getLocalTasks]);

  // Save tasks to both local and cloud storage
  const saveTasks = useCallback(async (newTasks) => {
    try {
      // Always save to localStorage first (immediate)
      localStorage.setItem(storageKey, JSON.stringify(newTasks));
      setTasks(newTasks);

      // Save to Firebase if enabled (background)
      if (cloudEnabled && FirebaseStorageService.isEnabled()) {
        setIsSyncing(true);
        const success = await FirebaseStorageService.saveTasks(newTasks);
        setSyncStatus(success ? 'synced' : 'error');
        setIsSyncing(false);
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      setSyncStatus('error');
      setIsSyncing(false);
    }
  }, [storageKey, cloudEnabled]);

  // Add a new task
  const addTask = useCallback(async (task) => {
    const taskWithId = {
      ...task,
      id: task.id || generateTaskId(),
      createdAt: task.createdAt || new Date().toISOString()
    };

    const currentTasks = getLocalTasks();
    const newTasks = [...currentTasks, taskWithId];
    await saveTasks(newTasks);
    
    return taskWithId;
  }, [saveTasks, getLocalTasks]);

  // Update an existing task
  const updateTask = useCallback(async (taskId, updates) => {
    const currentTasks = getLocalTasks();
    const newTasks = currentTasks.map(task => 
      task.id === taskId || task.title === taskId // Support both ID and title for backward compatibility
        ? { ...task, ...updates }
        : task
    );
    await saveTasks(newTasks);
  }, [saveTasks, getLocalTasks]);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    const currentTasks = getLocalTasks();
    const newTasks = currentTasks.filter(task => 
      task.id !== taskId && task.title !== taskId // Support both ID and title for backward compatibility
    );
    await saveTasks(newTasks);
  }, [saveTasks, getLocalTasks]);

  // Delete all tasks
  const deleteAllTasks = useCallback(async () => {
    await saveTasks([]);
  }, [saveTasks]);

  // Manual sync with Firebase
  const syncWithCloud = useCallback(async () => {
    if (!cloudEnabled || !FirebaseStorageService.isEnabled()) {
      return false;
    }

    try {
      setIsSyncing(true);
      const localTasks = getLocalTasks();
      const syncedTasks = await FirebaseStorageService.syncTasks(localTasks);
      
      localStorage.setItem(storageKey, JSON.stringify(syncedTasks));
      setTasks(syncedTasks);
      setSyncStatus('synced');
      setIsSyncing(false);
      return true;
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
      setSyncStatus('error');
      setIsSyncing(false);
      return false;
    }
  }, [cloudEnabled, getLocalTasks, storageKey]);

  // Get setup instructions for Firebase storage
  const getCloudSetupInstructions = useCallback(() => {
    return FirebaseStorageService.getSetupInstructions();
  }, []);

  // Generate unique task ID
  const generateTaskId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Initialize on mount
  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  // Auto-sync every 5 minutes if Firebase is enabled
  useEffect(() => {
    if (!cloudEnabled || !FirebaseStorageService.isEnabled()) {
      return;
    }

    const interval = setInterval(() => {
      if (!isSyncing) {
        syncWithCloud();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [cloudEnabled, isSyncing, syncWithCloud]);

  return {
    // State
    tasks,
    isLoading,
    isSyncing,
    syncStatus,
    cloudEnabled,
    
    // Actions
    saveTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    syncWithCloud,
    getCloudSetupInstructions,
    
    // Utility
    refresh: initializeTasks
  };
};

export default useTaskStorage;
