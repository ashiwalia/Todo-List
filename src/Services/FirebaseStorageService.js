import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  onSnapshot 
} from 'firebase/firestore';

/**
 * Firebase Cloud Storage Service for persistent task storage
 * 
 * This service uses Firebase Firestore for real-time cloud storage.
 * Firebase credentials can be configured through the UI.
 */
class FirebaseStorageService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isConfigured = false;
    this.tasksCollection = 'tasks';
    this.configCollection = 'config';
    this.userDocId = 'user_tasks'; // Default document ID for tasks
    
    // Try to initialize from localStorage config
    this.initializeFromStoredConfig();
  }

  /**
   * Initialize Firebase from stored configuration in localStorage
   */
  initializeFromStoredConfig() {
    try {
      const storedConfig = localStorage.getItem('firebase_config');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        this.initializeFirebase(config);
      }
    } catch (error) {
      console.warn('Failed to initialize Firebase from stored config:', error);
    }
  }

  /**
   * Initialize Firebase with the provided configuration
   * @param {Object} config - Firebase configuration object
   * @returns {boolean} True if successful, false otherwise
   */
  initializeFirebase(config) {
    try {
      // Validate required fields
      const requiredFields = [
        'apiKey', 
        'authDomain', 
        'projectId', 
        'storageBucket', 
        'messagingSenderId', 
        'appId'
      ];
      
      const missingFields = requiredFields.filter(field => !config[field]);
      if (missingFields.length > 0) {
        console.error('Missing required Firebase config fields:', missingFields);
        return false;
      }

      // Initialize Firebase app
      this.app = initializeApp(config);
      this.db = getFirestore(this.app);
      this.isConfigured = true;
      
      // Store configuration for future use
      localStorage.setItem('firebase_config', JSON.stringify(config));
      
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      this.isConfigured = false;
      return false;
    }
  }

  /**
   * Check if Firebase is properly configured
   * @returns {boolean} True if configured, false otherwise
   */
  isEnabled() {
    return this.isConfigured && this.db !== null;
  }

  /**
   * Get the current Firebase configuration
   * @returns {Object|null} Current config or null if not configured
   */
  getCurrentConfig() {
    try {
      const storedConfig = localStorage.getItem('firebase_config');
      return storedConfig ? JSON.parse(storedConfig) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update Firebase configuration
   * @param {Object} newConfig - New Firebase configuration
   * @returns {boolean} True if successful
   */
  updateConfig(newConfig) {
    return this.initializeFirebase(newConfig);
  }

  /**
   * Clear Firebase configuration
   */
  clearConfig() {
    localStorage.removeItem('firebase_config');
    this.app = null;
    this.db = null;
    this.isConfigured = false;
  }

  /**
   * Get configuration instructions for the user
   * @returns {object} Configuration instructions
   */
  getSetupInstructions() {
    const currentConfig = this.getCurrentConfig();
    
    return {
      steps: [
        "🔥 Firebase Firestore Setup Guide:",
        "",
        "1. Go to https://console.firebase.google.com",
        "2. Create a new project or select an existing one",
        "3. Enable Firestore Database:",
        "   - Go to 'Firestore Database' in the sidebar",
        "   - Click 'Create database'",
        "   - Choose 'Start in test mode' for now (you can secure it later)",
        "   - Select a location close to your users",
        "",
        "4. Get your Firebase config:",
        "   - Go to Project Settings (gear icon)",
        "   - Scroll down to 'Your apps' section",
        "   - Click 'Add app' and select Web (</>) if no web app exists",
        "   - Register your app with a nickname",
        "   - Copy the firebaseConfig object",
        "",
        "5. Configure through the UI:",
        "   - Use the form below to enter your Firebase credentials",
        "   - Click 'Save Configuration' to test and save",
        "",
        "6. Set up Firestore Security Rules (recommended):",
        "   - Go to Firestore Database > Rules",
        "   - Replace with secure rules based on your authentication setup",
        "",
        "✅ Benefits of Firebase:",
        "- ✅ Real-time synchronization across devices",
        "- ✅ Offline support with automatic sync",
        "- ✅ Scalable and reliable infrastructure",
        "- ✅ Free tier with generous limits",
        "- ✅ Advanced security rules",
        "- ✅ Built-in authentication support"
      ],
      currentConfig: {
        isConfigured: this.isConfigured,
        hasConfig: Boolean(currentConfig),
        projectId: currentConfig?.projectId || 'Not configured',
        authDomain: currentConfig?.authDomain || 'Not configured'
      }
    };
  }

  /**
   * Fetch all tasks from Firestore
   * @returns {Promise<Array>} Array of tasks
   */
  async fetchTasks() {
    if (!this.isEnabled()) {
      return [];
    }

    try {
      const tasksRef = collection(this.db, this.tasksCollection);
      const snapshot = await getDocs(tasksRef);
      
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Fetched tasks from Firebase:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks from Firebase:', error);
      return [];
    }
  }

  /**
   * Save all tasks to Firestore (batch operation)
   * @param {Array} tasks - Array of task objects
   * @returns {Promise<boolean>} True if successful
   */
  async saveTasks(tasks) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      // Clear existing tasks and add new ones
      const tasksRef = collection(this.db, this.tasksCollection);
      const snapshot = await getDocs(tasksRef);
      
      // Delete existing tasks
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Add new tasks
      const addPromises = tasks.map(task => {
        const taskData = { ...task };
        if (taskData.id) {
          // Use existing ID as document ID
          const taskId = taskData.id;
          delete taskData.id; // Remove from data since it'll be the document ID
          return setDoc(doc(this.db, this.tasksCollection, taskId), taskData);
        } else {
          // Let Firestore generate ID
          return addDoc(tasksRef, taskData);
        }
      });
      
      await Promise.all(addPromises);
      console.log('Tasks saved to Firebase successfully');
      return true;
    } catch (error) {
      console.error('Error saving tasks to Firebase:', error);
      return false;
    }
  }

  /**
   * Add a single task to Firestore
   * @param {Object} task - Task object
   * @returns {Promise<Object|null>} Added task with ID or null if failed
   */
  async addTask(task) {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const taskData = {
        ...task,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let docRef;
      if (task.id) {
        // Use provided ID
        docRef = doc(this.db, this.tasksCollection, task.id);
        await setDoc(docRef, taskData);
      } else {
        // Let Firestore generate ID
        const tasksRef = collection(this.db, this.tasksCollection);
        docRef = await addDoc(tasksRef, taskData);
      }

      const addedTask = {
        id: docRef.id,
        ...taskData
      };

      console.log('Task added to Firebase:', addedTask.id);
      return addedTask;
    } catch (error) {
      console.error('Error adding task to Firebase:', error);
      return null;
    }
  }

  /**
   * Update a single task in Firestore
   * @param {string} taskId - ID of the task to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} True if successful
   */
  async updateTask(taskId, updates) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      const taskRef = doc(this.db, this.tasksCollection, taskId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(taskRef, updateData);
      console.log('Task updated in Firebase:', taskId);
      return true;
    } catch (error) {
      console.error('Error updating task in Firebase:', error);
      return false;
    }
  }

  /**
   * Delete a task from Firestore
   * @param {string} taskId - ID of task to delete
   * @returns {Promise<boolean>} True if successful
   */
  async deleteTask(taskId) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      const taskRef = doc(this.db, this.tasksCollection, taskId);
      await deleteDoc(taskRef);
      console.log('Task deleted from Firebase:', taskId);
      return true;
    } catch (error) {
      console.error('Error deleting task from Firebase:', error);
      return false;
    }
  }

  /**
   * Delete all tasks from Firestore
   * @returns {Promise<boolean>} True if successful
   */
  async deleteAllTasks() {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      const tasksRef = collection(this.db, this.tasksCollection);
      const snapshot = await getDocs(tasksRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('All tasks deleted from Firebase');
      return true;
    } catch (error) {
      console.error('Error deleting all tasks from Firebase:', error);
      return false;
    }
  }

  /**
   * Set up real-time listener for tasks
   * @param {Function} callback - Function to call when tasks change
   * @returns {Function} Unsubscribe function
   */
  onTasksChange(callback) {
    if (!this.isEnabled()) {
      return () => {};
    }

    try {
      const tasksRef = collection(this.db, this.tasksCollection);
      return onSnapshot(tasksRef, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(tasks);
      });
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      return () => {};
    }
  }

  /**
   * Test Firebase connection with current configuration
   * @returns {Promise<boolean>} True if connection successful
   */
  async testConnection() {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      // Try to read from Firestore
      const tasksRef = collection(this.db, this.tasksCollection);
      await getDocs(tasksRef);
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }

  /**
   * Sync local storage with Firebase
   * @param {Array} localTasks - Tasks from localStorage
   * @returns {Promise<Array>} Merged tasks
   */
  async syncTasks(localTasks = []) {
    if (!this.isEnabled()) {
      return localTasks;
    }

    try {
      const remoteTasks = await this.fetchTasks();
      
      // Simple merge strategy: Firebase tasks take precedence if they exist
      if (remoteTasks.length > 0) {
        console.log('Loaded tasks from Firebase:', remoteTasks.length);
        return remoteTasks;
      } else if (localTasks.length > 0) {
        // If Firebase is empty but local has tasks, upload local tasks
        console.log('Uploading local tasks to Firebase:', localTasks.length);
        const success = await this.saveTasks(localTasks);
        return success ? localTasks : [];
      }
      
      return [];
    } catch (error) {
      console.error('Error syncing tasks with Firebase:', error);
      return localTasks; // Fallback to local tasks
    }
  }
}

// Export singleton instance
const firebaseStorageService = new FirebaseStorageService();
export default firebaseStorageService;
