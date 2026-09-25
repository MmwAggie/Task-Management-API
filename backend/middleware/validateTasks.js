/*
Task validation middleware, makes sure that any information for a tasks fits this structure, making it valid and safe.
September 25, 2026
Makell Williams
*/


const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i; // Regex for UUID

const ALLOWED_STATUSES = ['todo', 'in_progress', 'archived', 'finished']; // Valid statuses from the database, only these are allowed.

export const validateCreateTask = (req, res, next) => { // This middleware here will validate the creation of tasks.
    const { title, description, statusID } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) { // Check to ensure title is a string and isn't empty.
        return res.status(400).json({
            message: `Title is required and must be text.`
        });
    }

    if (title.length > 100) { // Check to see if title is longer than 100 characters.
        return res.status(400).json({
            message: `Title CAN'T be longer than 100 characters.`
        });
    }

    if (description !== undefined && description !== null) { // Check to see if a description is provided.
        if (typeof description !== 'string') { // If so, make sure the input is a string.
            return res.status(400).json({
                message: `Description must be text.`
            });
        }

        if (description.length > 400) { // Check to see if description is greater than 400 characters
            return res.status(400).json({
                message: `Description can't be longer than 400 characters.`
            });
        }
    }

    if (statusID && !ALLOWED_STATUSES.includes(statusID)) { // Check to see if provided statusID is allowed.
        return res.status(400).json({
            message: `This statusID is invalid. Must be one of: ${ALLOWED_STATUSES.join(', ')}`
        });
    }

    req.body.title = title.trim(); // Trim the whitespaces of the title

    if (description) {
        req.body.description = description.trim(); // Trim the whitespaces of the description, if provided.
    }

    next(); // If all checks from above are passed, move to the controller.
};

export const validateTaskIdParam = (req, res, next) => { // Middleware to valid route parameters like task id.
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
        return res.status(400).json({
            message: 'Task id is in invalid format. Must be a valid UUID.'
        });
    }

    next(); // If the task id param check is good, move on.
};



