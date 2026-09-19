/*
This is where the task controllers are called as they are needed for each route.
September 17, 2026
Makell Williams
*/

import express from 'express'; // Import the express module for creating the server
const router = express.Router(); // Create a new router instance to define our routes

import { createTask, getTask, deleteTask, updateTask } from '../controllers/taskControllers.js'; // Import the controller functions for user registration and login


router.post('/', createTask); // Defines the route for task creation for a user. Mapped to the postTask function.
router.get('/', getTask); // Defines the route to find user's tasks. Mapped to the getTask function.
router.put('/:id', updateTask); // Defines the route to update a user's tasks. Needs a task's specfic id. Mapped to the updateTask function.
router.delete('/:id', deleteTask); // Defines the route to delete a user's tasks. Needs a task's specific id. Mapped to the deleteTask function.

export default router;