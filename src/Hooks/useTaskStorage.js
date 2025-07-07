import { useState, useEffect, useCallback } from 'react';
import FirebaseStorageService from 'Services/FirebaseStorageService';
import { sanitizeTasks, validateTasks, getTaskStats } from 'Utils/taskValidation';

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

  // Get tasks from localStorage with backup mechanism
  const getLocalTasks = useCallback(() => {
    try {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Validate and sanitize tasks
        const cleanTasks = sanitizeTasks(parsedTasks);
        
        // Log statistics for debugging
        const stats = getTaskStats(parsedTasks);
        if (stats.invalid > 0 || stats.duplicates > 0) {
          console.log('Task validation stats:', stats);
        }
        
        // Update localStorage if we cleaned up the tasks
        if (cleanTasks.length !== parsedTasks.length) {
          console.log(`Cleaned up tasks: ${parsedTasks.length} → ${cleanTasks.length}`);
          localStorage.setItem(storageKey, JSON.stringify(cleanTasks));
        }
        
        return cleanTasks;
      } else {
        // Initialize with default tasks
        const sanitizedDefaults = sanitizeTasks(defaultTasks);
        localStorage.setItem(storageKey, JSON.stringify(sanitizedDefaults));
        return sanitizedDefaults;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      const backupTasks = getBackupTasks();
      return backupTasks ? sanitizeTasks(backupTasks) : sanitizeTasks(defaultTasks);
    }
  }, [storageKey, defaultTasks]);

  // Backup mechanism for tasks
  const createBackup = useCallback((tasks) => {
    try {
      const backupKey = `${storageKey}_backup_${Date.now()}`;
      const backupData = {
        tasks,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Keep only the last 3 backups to avoid storage bloat
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys
        .filter(key => key.startsWith(`${storageKey}_backup_`))
        .sort()
        .reverse();
      
      // Remove old backups (keep only 3 most recent)
      backupKeys.slice(3).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Created backup for', tasks.length, 'tasks');
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }, [storageKey]);

  // Get latest backup tasks
  const getBackupTasks = useCallback(() => {
    try {
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys
        .filter(key => key.startsWith(`${storageKey}_backup_`))
        .sort()
        .reverse();
      
      for (const backupKey of backupKeys) {
        try {
          const backupData = JSON.parse(localStorage.getItem(backupKey));
          if (backupData.tasks && Array.isArray(backupData.tasks)) {
            console.log('Restored from backup:', backupData.timestamp, backupData.tasks.length, 'tasks');
            return backupData.tasks;
          }
        } catch (e) {
          console.warn('Invalid backup data for key:', backupKey);
        }
      }
    } catch (error) {
      console.error('Error retrieving backup:', error);
    }
    return null;
  }, [storageKey]);

  // Initialize tasks from localStorage and Firebase with enhanced error handling
  const initializeTasks = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Check if Firebase storage is configured
      const isFirebaseEnabled = FirebaseStorageService.isEnabled();
      setCloudEnabled(isFirebaseEnabled);

      // Get tasks from localStorage
      const localTasks = getLocalTasks();
      console.log('Loaded local tasks:', localTasks.length);

      // Validate local tasks and create backup
      if (localTasks.length > 0) {
        createBackup(localTasks);
      }

      if (isFirebaseEnabled) {
        // Sync with Firebase with timeout and retry logic
        setIsSyncing(true);
        
        try {
          // Add timeout to Firebase sync
          const syncPromise = FirebaseStorageService.syncTasks(localTasks);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firebase sync timeout')), 10000)
          );
          
          const syncedTasks = await Promise.race([syncPromise, timeoutPromise]);
          
          // Validate synced tasks
          if (Array.isArray(syncedTasks)) {
            // Only update if we have valid data
            if (syncedTasks.length > 0 || localTasks.length === 0) {
              if (JSON.stringify(syncedTasks) !== JSON.stringify(localTasks)) {
                localStorage.setItem(storageKey, JSON.stringify(syncedTasks));
                if (syncedTasks.length > 0) {
                  createBackup(syncedTasks);
                }
              }
              setTasks(syncedTasks);
              setSyncStatus('synced');
            } else {
              // Firebase returned empty but we have local tasks - keep local
              console.log('Firebase empty but local tasks exist, keeping local');
              setTasks(localTasks);
              setSyncStatus('offline');
            }
          } else {
            // Invalid sync result, keep local tasks
            console.warn('Invalid sync result, keeping local tasks');
            setTasks(localTasks);
            setSyncStatus('error');
          }
        } catch (syncError) {
          console.error('Firebase sync failed:', syncError);
          // Always fall back to local tasks on sync failure
          setTasks(localTasks);
          setSyncStatus('error');
        }
        
        setIsSyncing(false);
      } else {
        // Use local tasks only
        setTasks(localTasks);
        setSyncStatus('offline');
      }
    } catch (error) {
      console.error('Error initializing tasks:', error);
      
      // Emergency fallback: try to recover from backup
      const backupTasks = getBackupTasks();
      if (backupTasks && backupTasks.length > 0) {
        console.log('Recovered from backup:', backupTasks.length, 'tasks');
        setTasks(backupTasks);
        localStorage.setItem(storageKey, JSON.stringify(backupTasks));
      } else {
        // Final fallback to default tasks
        setTasks(defaultTasks);
        localStorage.setItem(storageKey, JSON.stringify(defaultTasks));
      }
      
      setSyncStatus('error');
      setIsSyncing(false);
    }
    
    setIsLoading(false);
  }, [storageKey, getLocalTasks, createBackup, getBackupTasks, defaultTasks]);

  // Save tasks to both local and cloud storage with backup
  const saveTasks = useCallback(async (newTasks) => {
    try {
      // Validate and sanitize input
      const cleanTasks = sanitizeTasks(newTasks);
      
      if (cleanTasks.length !== newTasks.length) {
        console.log(`Sanitized tasks before save: ${newTasks.length} → ${cleanTasks.length}`);
      }

      // Create backup before making changes
      const currentTasks = getLocalTasks();
      if (currentTasks.length > 0) {
        createBackup(currentTasks);
      }

      // Always save to localStorage first (immediate)
      localStorage.setItem(storageKey, JSON.stringify(cleanTasks));
      setTasks(cleanTasks);

      // Save to Firebase if enabled (background)
      if (cloudEnabled && FirebaseStorageService.isEnabled()) {
        setIsSyncing(true);
        
        try {
          const success = await FirebaseStorageService.saveTasks(cleanTasks);
          setSyncStatus(success ? 'synced' : 'error');
          
          if (!success) {
            console.warn('Failed to save to Firebase, but local save successful');
          }
        } catch (firebaseError) {
          console.error('Firebase save error:', firebaseError);
          setSyncStatus('error');
        }
        
        setIsSyncing(false);
      }
    } catch (error) {
      console.error('Error saving tasks:', error);
      setSyncStatus('error');
      setIsSyncing(false);
      
      // Try to restore from backup if save failed
      try {
        const backupTasks = getBackupTasks();
        if (backupTasks && backupTasks.length > 0) {
          console.log('Attempting to restore from backup due to save failure');
          const cleanBackupTasks = sanitizeTasks(backupTasks);
          localStorage.setItem(storageKey, JSON.stringify(cleanBackupTasks));
          setTasks(cleanBackupTasks);
        }
      } catch (restoreError) {
        console.error('Failed to restore from backup:', restoreError);
      }
    }
  }, [storageKey, cloudEnabled, getLocalTasks, createBackup, getBackupTasks]);

  // Add a new task
  const addTask = useCallback(async (task) => {
    const taskWithMetadata = {
      ...task,
      id: task.id || generateTaskId(),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentTasks = getLocalTasks();
    const newTasks = [...currentTasks, taskWithMetadata];
    await saveTasks(newTasks);
    
    return taskWithMetadata;
  }, [saveTasks, getLocalTasks]);

  // Update an existing task
  const updateTask = useCallback(async (taskId, updates) => {
    const currentTasks = getLocalTasks();
    const newTasks = currentTasks.map(task => {
      const isMatch = task.id === taskId || task.title === taskId; // Support both ID and title for backward compatibility
      return isMatch 
        ? { 
            ...task, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : task;
    });
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

  // Manual recovery from backup
  const recoverFromBackup = useCallback(async () => {
    try {
      const backupTasks = getBackupTasks();
      if (backupTasks && backupTasks.length > 0) {
        await saveTasks(backupTasks);
        console.log('Successfully recovered', backupTasks.length, 'tasks from backup');
        return true;
      } else {
        console.log('No backup data available');
        return false;
      }
    } catch (error) {
      console.error('Failed to recover from backup:', error);
      return false;
    }
  }, [getBackupTasks, saveTasks]);

  // Get backup info for UI
  const getBackupInfo = useCallback(() => {
    try {
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys
        .filter(key => key.startsWith(`${storageKey}_backup_`))
        .sort()
        .reverse();
      
      const backups = backupKeys.map(key => {
        try {
          const backupData = JSON.parse(localStorage.getItem(key));
          return {
            key,
            timestamp: backupData.timestamp,
            taskCount: backupData.tasks ? backupData.tasks.length : 0,
            version: backupData.version || '1.0'
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
      
      return backups;
    } catch (error) {
      console.error('Error getting backup info:', error);
      return [];
    }
  }, [storageKey]);

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
    
    // Recovery and backup
    recoverFromBackup,
    getBackupInfo,
    
    // Utility
    refresh: initializeTasks
  };
};

export default useTaskStorage;
