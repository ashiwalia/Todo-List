/**
 * Task data validation and migration utilities
 * Helps ensure data integrity and handle legacy task formats
 */

/**
 * Validates a single task object
 * @param {Object} task - Task to validate
 * @returns {boolean} True if task is valid
 */
export const isValidTask = (task) => {
  if (!task || typeof task !== 'object') {
    return false;
  }

  // Required fields
  if (!task.id || !task.title) {
    return false;
  }

  // Valid completion status
  const validStatuses = ['completed', 'uncompleted', 'working'];
  if (task.completed && !validStatuses.includes(task.completed)) {
    return false;
  }

  return true;
};

/**
 * Validates an array of tasks
 * @param {Array} tasks - Array of tasks to validate
 * @returns {Array} Array of valid tasks
 */
export const validateTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    console.warn('Tasks is not an array:', typeof tasks);
    return [];
  }

  const validTasks = tasks.filter(task => {
    const valid = isValidTask(task);
    if (!valid) {
      console.warn('Invalid task found:', task);
    }
    return valid;
  });

  if (validTasks.length !== tasks.length) {
    console.log(`Filtered ${tasks.length - validTasks.length} invalid tasks`);
  }

  return validTasks;
};

/**
 * Migrates legacy task format to current format
 * @param {Object} task - Task to migrate
 * @returns {Object} Migrated task
 */
export const migrateTask = (task) => {
  const migrated = { ...task };

  // Ensure required timestamps exist
  if (!migrated.createdAt) {
    migrated.createdAt = new Date().toISOString();
  }

  if (!migrated.updatedAt) {
    migrated.updatedAt = migrated.createdAt;
  }

  // Ensure ID exists
  if (!migrated.id) {
    migrated.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Ensure completion status is valid
  if (!migrated.completed) {
    migrated.completed = 'uncompleted';
  }

  // Ensure important field is boolean
  if (typeof migrated.important !== 'boolean') {
    migrated.important = false;
  }

  return migrated;
};

/**
 * Migrates an array of tasks to current format
 * @param {Array} tasks - Tasks to migrate
 * @returns {Array} Migrated tasks
 */
export const migrateTasks = (tasks) => {
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks.map(migrateTask);
};

/**
 * Sanitizes and prepares tasks for storage
 * @param {Array} tasks - Tasks to sanitize
 * @returns {Array} Sanitized tasks
 */
export const sanitizeTasks = (tasks) => {
  const migrated = migrateTasks(tasks);
  const validated = validateTasks(migrated);
  
  // Remove duplicates based on ID
  const uniqueTasks = validated.reduce((acc, task) => {
    if (!acc.find(t => t.id === task.id)) {
      acc.push(task);
    }
    return acc;
  }, []);

  return uniqueTasks;
};

/**
 * Gets task statistics for debugging
 * @param {Array} tasks - Tasks to analyze
 * @returns {Object} Statistics object
 */
export const getTaskStats = (tasks) => {
  if (!Array.isArray(tasks)) {
    return { total: 0, valid: 0, invalid: 0, duplicates: 0 };
  }

  const validTasks = tasks.filter(isValidTask);
  const uniqueIds = new Set(tasks.map(t => t.id).filter(Boolean));
  const duplicates = tasks.length - uniqueIds.size;

  return {
    total: tasks.length,
    valid: validTasks.length,
    invalid: tasks.length - validTasks.length,
    duplicates: Math.max(0, duplicates),
    completed: validTasks.filter(t => t.completed === 'completed').length,
    uncompleted: validTasks.filter(t => t.completed === 'uncompleted').length,
    working: validTasks.filter(t => t.completed === 'working').length,
    important: validTasks.filter(t => t.important).length
  };
};
