/*
This will be the main file for the server.
September 4, 2026
Makell Williams
*/

import authRoutes from './routes/authRoutes.js'
import express from 'express'; // Import the express module for creating the server
import { pool } from './config/db.js'; // Import the database connection pool from the db.js file
import dotenv from 'dotenv'; // Import the dotenv module to load environment variables

dotenv.config(); // Load environment variables from the .env file

const app = express(); // Create our express app instance for use.
app.use(express.json()) // Allow express to parse incoming JSON requests and make the data available in req.body
app.use('/api/auth', authRoutes); // Use the newly made auth routes.

app.get('/api/health', async (req,res) => { // Simple health check endpoint to verify database connectivity
    try{
        
        await pool.query('SELECT NOW()'); // Execute a simple query to test the connection, then release the client back to the pool

        res.status(200).json({
            message: 'Database connection successful',
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            timestamp: new Date().toISOString()
        })
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


app.listen(process.env.PORT || 5000, () => { // Start the server and listen on the specified port from environment variables
    console.log(`Server is running on port ${process.env.PORT}! LET'S GO!`);
}) 





