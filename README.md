# Queue Management System

A full-stack queue management system built with React, Vite, Node.js, Express, and MongoDB.

## Project Structure

- `frontend/` – React + Vite frontend
- `backend/` – Express REST API and server logic

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, Axios, Recharts
- Backend: Node.js, Express.js, MongoDB, JWT, bcrypt
- Real-time: Socket.IO (planned for later integration)

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas connection string for the backend

## Setup

1. Open a terminal in the project root.
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```
4. Create a `.env` file inside `backend/` with your MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/queue-management
   ```

## Run the projects

### Frontend
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

### Backend
```bash
cd backend
npm run dev
```

## Default URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Notes

- The backend uses ES modules.
- The health check endpoint confirms the server is running before feature work begins.
- MongoDB connection is optional until a valid `MONGODB_URI` is configured.
