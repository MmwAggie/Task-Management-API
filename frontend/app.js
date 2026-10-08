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
        loadTasks();
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
        ...options.headers // Being used to gather a varing number of elements/arguments from the options array.
    };

    const response = await fetch(url, { ...options, headers }); // Wait to get the response.

    if (response.status === 401 || response.status === 403) { // If the token is expired or invalid...
        localStorage.removeItem('authToken'); // ...remove the token from storage,...
        document.getElementById('auth-section').style.display = 'block'; //...display the authentication section again so user can log in again...
        document.getElementById('task-section').style.display = 'none'; //...hide the task section, so user can't mess with tasks anymore...
        throw new Error('Session has expired. Try logging in again.') //...and throw an error.
    }

    return response; // If all goes well, this repsonse should be returned.
}

const API_URL = 'http://localhost:5000/api'; // Base API URL 

const authForm = document.getElementById('auth-form'); // This section will need to change when user gets logged in.

authForm.addEventListener('submit', async (e) => { // Add an event listener to the authform for form submissions.
    e.preventDefault() // Prevents page reloads from happening when the form  is submitted.

    const authError = document.getElementById('auth-error'); // This section will change if an error occurs.

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

            // Also make sure to load task here after loading the task section.
            authForm.reset();
            loadTasks();
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

const taskList = document.getElementById('task-list'); // List of tasks area that will be filled with user's tasks.

async function loadTasks() { // This function will handle loading a user's tasks
    taskList.innerHTML = '<p>Your tasks are loading...</p>';

    try {
        const response = await fetchWithAuth(`${API_URL}/tasks`); // Fetch the load task route. Using the helper function since this will be using the user's token to load THEIR tasks.
        const data = await response.json(); // Get response data.

        const tasks = data.tasks || data; // Matching formats with the getTask route, so it can either be a bunch of rows or a single task.

        if (tasks.length === 0) { // If no tasks are found
            taskList.innerHTML = '<p>Found no tasks. Make some above.</p>';
            return;
        }

        taskList.innerHTML = ''; // Empty the tasks list before loading in the tasks.

        tasks.forEach(task => { // For each task found, begin to make cards for each of them.
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';

            taskStatus = task.taskstatusid; // Using this status id, I can make them look better when rendered on the webpage.
            // TODO: Make a switch case here for all 4 of the potential statuses. That way the rendered statuses look better.

            // The elements that make up the task cards.
            taskCard.innerHTML = ` 
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <p><strong>Status: </strong>${task.status_id || task.statusid}</p>
            <button class="update-button" data-id="${task.taskid}">Update</button>
            <button class="delete-button" data-id="${task.taskid}">Delete</button>
            `;

            taskList.appendChild(taskCard); // Append the task cards made to the list of tasks.
        });

    }

    catch (error) { // Usual error catcher.
        console.log('Failed to load tasks:', error);
    }
}

async function deleteTask(taskId) { // Function to delete tasks
    if (!confirm("Do you want to delete this task?")) return; // Simple confirm to see if a user wants to delete the selected tasks or not.
    try {
        const response = await fetchWithAuth(`${API_URL}/tasks/${taskId}`, { // Get the delete task route ready.
            method: 'DELETE' // Use the correct method.
        });

        if (response.ok) { // If everything is good, reload the user's task and the one selected to be deleted should be handled and gone.
            loadTasks();
        }

        else { // Otherwise simple error message.
            console.log("Failed to delete task.");
        }
    }

    catch { // Catch any other random issues.
        console.log("Error occured while deleting task: ", error)
    }
}

async function updateTask(taskId) {
    const newTitle = prompt("Put a new title");
    if (!newTitle) return;

    const newDescription = prompt("Put a new description");
    const newStatusId = prompt("Enter status ID, 1 for To do, 2 for in progress, 3 for archived and 4 for finished.");

    try {
        const response = await fetchWithAuth(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: newTitle,
                description: newDescription,
                statusID: parseInt(newStatusId, 10) || 1
            })
        });

        if (response.ok) {
            console.log("Task was updated successfully!");
            loadTasks();
        }

        else {
            const data = await response.json();
            alert(data.message || "Failed to update task.")
        }
    }

    catch (error) {
        console.log("An error occured will updating task:", error);
    }
}

taskList.addEventListener('click', async (e) => { // Listen out for button clicks in the task list.
    if (e.target.classList.contains('delete-button')) { // See if a delete button in the task list was clicked.
        const taskId = e.target.dataset.id; // Get the id from the clicked task.
        await deleteTask(taskId); // Run the delete task function.
    }

    if (e.target.classList.contains('update-button')) { // See if a update button in the task list was clicked.
        const taskId = e.target.dataset.id; // Get the id from the clicked task.
        await updateTask(taskId); // Run the update task function.
    }
});

const taskForm = document.getElementById('task-form'); // This is the section that will be used to submit tasks.
const taskError = document.getElementById('task-error'); // Area that holds the error messages.

taskForm.addEventListener('submit', async (e) => { // Event listener that will handle tasks creation.
    e.preventDefault(); // Stop page reloads from happening on submission.

    // The various parts of the task "needed" to submit it into a database.
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const statusID = document.getElementById('task-status').value;

    try { // Get a response from the create task route
        const response = await fetchWithAuth(`${API_URL}/tasks`, {
            method: 'POST',
            body: JSON.stringify({ title, description, statusID })
        });

        const data = await response.json(); // The response data for this login request.

        if (response.ok) { // Once it's okay, empty the form and error sections. Afterward, load the tasks again, now with the new task included.
            taskForm.reset();
            taskError.textContent = '';
            loadTasks();
        }

        else { // Simple error catcher, will call the validateTask error messages when needed.
            taskError.textContent = data.message || "Error creating task. Please try again!"
        }
    }

    catch (error) {
        console.error('An error occured during task creation:', error); // If a network error occurs display these messages.
        taskError.textContent = "Network error while creating the task!"
    }
});

const logOutButton = document.getElementById("logout-button");

logOutButton.addEventListener('click', () => { // Simple log out feature.
    localStorage.removeItem('authToken'); // Remove JWT, which will log out the user.
    document.getElementById('auth-section').style.display = 'block'; // Show the login section again.
    document.getElementById('task-section').style.display = 'none'; // Hide the task section from user.
    console.log("Successfully logged out.");
});
