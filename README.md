# Task Manager App

## A full-stack task management website built with React, Node.js, Express, andMongoDB.

## Project Overview

- Smart Assign: Assigns a task to the user with the fewest active tasks

- Conflict Detection: Handles two different edits and offers overwrite/keep options

- Activity Logs: Task logs with user + timestamp

- Kanban Board: Drag-and-drop tasks between columns

- Search + Filter: By status, priority, or user

- Login/Registration with JWT

- Real-time task updates via WebSocket

- Delete tasks with activity logging

-Custom Animation : Fade-In Animation on Task Cards

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT (Authentication)
- Bcrypt (Password hashing)

### Frontend

- React (Functional Components + Hooks)
- React Router
- Axios
- Custom CSS (No third-party UI libraries)
- Framer Motion (Animations)
- Responsive layout with component-level styling

---

### Development & Test Website

All core logic (smart assign, conflict handling, real-time sync) was first built in a separate test website.

# Live Demo & Deployment

Main App URL:

To access the site with full functionality, since i'm using render it puts my backend to sleep so click on this link to wake it up. It might take 1-2 mins ( https://task-manager-app-1-d5y6.onrender.com)
https://task-manager-app-ka8x.vercel.app/dashboard

Demo Walkthrough Video: https://drive.google.com/file/d/1hNNRTfU2FYHUMfdbh5CuS1choW6pdqAf/view?usp=sharing

Test Logic Site:

To access the site with full functionality, since i'm using render it puts my backend to sleep so click on this link to wake it up. It might take 1-2 mins ( https://test-website-for-task-manager.onrender.com)
https://test-website-for-task-manager.vercel.app/

## Setup & Installation

### 1. Clone the Repository

git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app

### 2. Run the App Locally

# Backend

-cd backend
-npm install
-node server.js

# Frontend

-cd frontend
-npm install
-npm start

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

# Environment Variables

-Frontend

VITE_API_BASE_URL=https://task-manager-app-2-aqnk.onrender.com

-Backend

    PORT=5000
    MONGO_URI=mongodb+srv://fsreal8167:NofKVKrSvHhrIkz8@cluster1.ufda0fo.mongodb.net/
    JWT_SECRET=supersecretkey
    FRONTEND_URL=https://task-manager-app-ka8x.vercel.app
