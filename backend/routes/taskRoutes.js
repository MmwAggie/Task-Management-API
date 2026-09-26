/*
This is where the task controllers are called as they are needed for each route.
September 17, 2026
Makell Williams
*/

import express from 'express'; // Import the express module for creating the server
const router = express.Router(); // Create a new router instance to define our routes

import { createTask, getTask, deleteTask, updateTask } from '../controllers/taskControllers.js'; // Import the controller functions for user registration and login
import { authenticateToken } from '../middleware/authMiddleware.js'; // Import the authentication middlewar for these task functions to be protected.
import { validateCreateTask, validateTaskIdParam, validateUpdateTask } from '../middleware/validateTasks.js'; // Import task validation middleware, allowing for only sanitized, valid inputs.

router.use(authenticateToken); // Now use this middleware to protect the routes below. Will always run first to provide authentication and protection.

// Goes authenticateToken -> validateTaskIdParam -> createTask. If the task id param check fails task creation fails.
router.post('/', validateCreateTask, createTask); // Defines the route for task creation for a user. Mapped to the postTask function. Now validates the various inputs for creating a task.

router.get('/', getTask); // Defines the route to find user's tasks. Mapped to the getTask function.

// Goes authenticateToken -> validateTaskIdParam -> validateUpdateTask -> updateTask. If the task id param check fails task updating fails.
router.put('/:id', validateTaskIdParam, validateUpdateTask, updateTask); // Defines the route to update a user's tasks. Needs a task's specfic id. Mapped to the updateTask function. Now runs the task id validation check before updating a task.

// Goes authenticateToken -> validateTaskIdParam -> deleteTask. If the task id param check fails task deletion fails.
router.delete('/:id', validateTaskIdParam, deleteTask); // Defines the route to delete a user's tasks. Needs a task's specific id. Mapped to the deleteTask function. Now runs the task id validation check before deleting task.

export default router; // Export the router so these routes can be used elsewhere.