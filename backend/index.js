/*
This will be the main file for the server.
September 4, 2026
Makell Williams
*/

import express from 'express'; // Import the express module for creating the server
import cors from 'cors'; // Import cross origin resource sharing, allowing for different ports to share stuff.
import dotenv from 'dotenv'; // Import the dotenv module to load environment variables

import { pool } from './config/db.js'; // Import the database connection pool from the db.js file
import authRoutes from './routes/authRoutes.js'; // Import auth routes for authentication functions
import taskRoutes from './routes/taskRoutes.js'; // Import task routes for task handling and manipulation functions.
import { errorHandler } from './middleware/errorMiddleware.js'; // Import the global error handler to catch errors.

dotenv.config(); // Load environment variables from the .env file

const app = express(); // Create our express app instance for use.
app.use(cors())// Enables cross origin requests.
app.use(express.json()) // Allow express to parse incoming JSON requests and make the data available in req.body
app.use('/api/auth', authRoutes); // Use the auth routes to call routes and their respective controllers for users.
app.use("/api/tasks", taskRoutes) // Use the task routes to call routes and their respective controllers for tasks.


app.get('/api/health', async (req, res) => { // Simple health check endpoint to verify database connectivity
    try {

        await pool.query('SELECT NOW()'); // Execute a simple query to test the connection, then release the client back to the pool

        res.status(200).json({
            message: 'Database connection successful',
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            timestamp: new Date().toISOString()
        });
    }

    catch (err) { // Error catching block to handle any issues during the database connection or query execution
        console.error("Error connecting to the database:", err);

        res.status(500).json({ // Gives the error and error message to the user in the response
            status: 'error',
            database: 'disconnected',
            message: err.message
        });
    }
});

app.use((req, res, next) => { // 404 Not Found Handler
    const error = new Error(`Sorry, this route can't be found: ${req.originalUrl}`); // Make a new error for unknown requests.
    res.status(404); // Respond with the status of 404.;
    next(error); // Pass this error to global error handler.
});


app.use(errorHandler) // Imported and using the global error handler. MUST BE THE LAST THING THE APP IS USING IN ORDER TO CATCH ERRORS PROPERLY.

app.listen(process.env.PORT || 5000, () => { // Start the server and listen on the specified port from environment variables
    console.log(`Server is running on port ${process.env.PORT}! LET'S GO!`);
})
