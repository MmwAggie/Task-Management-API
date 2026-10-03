/*
This file will handle the communications between the frontend and backend.
September 27, 2026
Makell Williams
*/


const API_URL = 'http://localhost:3000/api'; // Base API URL 

const authForm = document.getElementById('auth-form'); // This section will need to change when user gets logged in.
const authError = document.getElementById('auth-error'); // This section will change if an error occurs.


authForm.addEventListener('submit', async (e) => { // Add an event listener to the authform for form submissions.
    e.preventDefault() // Prevents page reloads from happening when the form  is submitted.

    const username = document.getElementById('username').value; // Get the username entered
    const password = document.getElementById('password').value; // Get the password entered

    try { // Try to send a request to login in to the backend.
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password })
        });

        const data = await response.json(); // The response data for this login request.

        if (response.ok) { // If a response is gotten
            localStorage.setItem('authToken', data.token); // Store authentication token on user's browser.
            console.log("Sucessfully logged in! Token saved:", data.token);

            document.getElementById('auth-section').style.display = 'none'; // Hide the authentication section once logged in.
            document.getElementById('task-section').style.display = 'block' // And display the task list section.

            // TODO: Also make sure to load task here after loading the task section.
        }

        else {
            authError.textContent = data.message || 'Login failed, please review your credentials.' // Throw an error message if the response isn't obtained.
        }
    }

    catch (error) { // Normal error catcher
        console.error('A network error occured during authentication:', error); // If a network error occurs display these messages.
        authError.textContent = "Unable to connect to the server. Make sure Express application is running and try again!"
    }
});
