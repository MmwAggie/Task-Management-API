/*
This is where the task specific controllers are defined.
September 17, 2026
Makell Williams
*/

import { pool } from '../config/db.js'; // Import the database connection pool from the db.js file


export const createTask = async (req, res) => { // Logic for creating a new task for a user
    const { title, description, statusID } = req.body; // Info from request

    const userID = req.userID; // User id should be sent with the request since user is logged in.

    if (!title) { // Require a title for each task.
        return res.status(400).json({ message: 'A title is needed for a task!!!' });
    }

    const finalStatus = statusID || 2; // Get status that the user sent with the task, default to in progress if not sent.

    try { // Try to make a new task with the info sent from user request.
        const newTask = await pool.query(`INSERT INTO tasks (title, description, statusID, userID
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [title, description, finalStatus, userID]
        );

        return res.status(201).json({ // If successful, show in response.
            message: 'Task was made successfully!',
            task: newTask.rows[0]
        });
    }

    catch (error) { // Catch errors during these task creations
        console.error('Error during task creation: ', error);
        return res.status(500).json({
            message: 'Internal server error, whoops...'
        });
    }
}

export const getTask = async (req, res) => { // Logic for getting a user's tasks.
    const userID = req.userID;

    try { // Try to select all tasks in the database that have a user id matching the current user's id.
        const getTask = await pool.query(`SELECT * FROM tasks WHERE userID = $1 ORDER BY creation_date DESC`,
            [userID]
        );

        return res.status(201).json({ // Return a success message if it works.
            message: 'Found tasks successfully!!!',
            tasks: getTask.rows
        });
    }

    catch (error) { // Catch errors and log it.
        console.error('Error while trying to find tasks: ', error);
        return res.status(500).json({
            message: 'Internal server error, whoops...'
        });
    }
}

export const deleteTask = async (req, res) => { // Logic for creating deleting an existing task for a user
    const userID = req.userID; // User id should be sent with the request since user is logged in.
    const taskID = req.taskID; // Task id should be sent with the request if user wants to update their task.

    try {
        const removeTask = await pool.query( // Remove tasks that user has selected to be deleted.
            'DELETE FROM tasks WHERE taskID = $1 AND userID = $2 RETURNING *',
            [userID, taskID]
        );

        if (deleteTask.rowCount === 0) { // A simple check to make sure that the selected task even exists. Nearly forgot about this.
            return res.status(404).json({ error: "Task not found or unauthorized." });
        }

        return res.status(201).json({ // Return a success message if it works.
            message: 'Deleted the task successfully!!!',
            task: deleteTask.rows
        });
    }

    catch (error) { // Simple error catcher as ususal.
        console.error('Error while trying to delete tasks: ', error);
        return res.status(500).json({
            message: 'Internal server error, whoops...'
        });
    }
}

export const updateTask = async (req, res) => { // Logic for updating an existing task for a user
    const { title, description, statusID } = req.body; // Info from request

    const userID = req.userID; // User id should be sent with the request since user is logged in.
    const taskID = req.taskID; // Task id should be sent with the request if user wants to update their task.

    try {
        const editTask = await pool.query( // Update the tasks so that all parts will either stay the same or update to new stuff the user submitted.
            `UPDATE tasks
            SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                statusID = COALESCE($3, statusID),
                updated_at = NOW()
                WHERE taskID = $4 AND userID = $5
                RETURNING *
                `,
            [title, description, statusID, userID, taskID]
        );

        if (editTask.rowCount === 0) { // A simple check to make sure that the selected task even exists.
            return res.status(404).json({ error: "Task not found or unauthorized." });
        }

        return res.status(201).json({ // Return a success message if it works.
            message: 'Updated the task successfully!!!',
            task: editTask.rows
        });
    }

    catch (error) { // Simple error catcher as ususal.
        console.error('Error while trying to update user\'s task: ', error);
        return res.status(500).json({
            message: 'Internal server error, whoops...'
        })
    }
}