## Smart Assign Logic

# How it works:

-Triggered when a user clicks "Smart Assign" button.

-Backend fetches all users from the database using a User.find() query.

-For each user, the system counts the number of active tasks currently assigned to them.

-The backend sorts the users by task count (ascending) and selects the one with the fewest.

-The selected user’s id is attached to the task’s assignedTo field before saving.

## Conflict Handling Logic

# How it works:

-Each task includes a lastModifiedAt field.

-When a user edits a task:

The user sends the task ID, the changes, and the lastModifiedAt value it originally saw.

-The backend checks whether the lastModifiedAt in the database matches the version sent by the user.

    If it matches: proceed with the update.

    If it doesn’t match: return a 409 Conflict with both:

                    The current version in the DB (conflictData.current)

                    The user’s attempted changes (conflictData.yourChanges)

-The frontend then shows a conflict modal that allows the user to:

        Keep their version.

        Discard their version and accept the latest from the server.

