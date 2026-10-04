/*
This file will handle the communications between the frontend and backend.
September 27, 2026
Makell Williams
*/

document.addEventListener('DOMContentLoaded', () => { // Event listener for the whole page, will run whenever the page loads.
    const token = 'authToken'; // Get name of the token

    const storedToken = localStorage.getItem(token); // Try to find the token on the user's local storage.

    if (storedToken != null) { // If found, hide the login section and display the task section as the page loads.
        console.log("User token found!");
        document.getElementById('auth-section').style.display = 'none'; // Hide the authentication section once logged in.
        document.getElementById('task-section').style.display = 'block' // And display the task list section.
    }

    else { // Otherwise, load the page normally, as if the user is logged out.
        console.log("User token not found. Please log in.");
    }
});


async function fetchWithAuth(url, options = {}) { // Function that helps with authorized API calls, because task routes need a JWT.
    const token = localStorage.getItem('authToken'); // Get the token

    const headers = { // Header info for the response
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers // ... is being used to gather a varing number of elements/arguments from the options array.
    };

    const response = await fetch(url, {options, headers}); // Wait to get the response.

    if (response.status === 401 || response.status === 403){ // If the token is expired or invalid...
        localStorage.removeItem('authToken'); // ...remove the token from storage,...
        document.getElementById('auth-section').style.display = 'block'; //...display the authentication section again so user can log in again...
        document.getElementById('task-section').style.display = 'none'; //...hide the task section, so user can't mess with tasks anymore...
        throw new Error('Session has expired. Try logging in again.') //...and throw an error.
    }

    return response; // If all goes well, this repsonse should be returned.
}

const API_URL = 'http://localhost:5000/api'; // Base API URL 

const authForm = document.getElementById('auth-form'); // This section will need to change when user gets logged in.
const authError = document.getElementById('auth-error'); // This section will change if an error occurs.


authForm.addEventListener('submit', async (e) => { // Add an event listener to the authform for form submissions.
    e.preventDefault() // Prevents page reloads from happening when the form  is submitted.

    const username = document.getElementById('username').value; // Get the username entered
    const password = document.getElementById('password').value; // Get the password entered

    try { // Try to send a request to login to the backend.
        const response = await fetch(`${API_URL}/auth/login`, { // Fetch the login route...
            method: 'POST', //...set the proper method...
            headers: { 'Content-Type': 'application/json' }, //...use the proper headers, here we need to be ready for json info...
            body: JSON.stringify({ userName: username, password }) //...finally, use the username and password the user gave.
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
