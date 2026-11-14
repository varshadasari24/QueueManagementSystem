# Queue Management System

A full-stack queue management application for managing service queues, tokens, waiting times, and queue analytics.

## Live GitHub repository

https://github.com/varshadasari24/QueueManagementSystem

## Features

- Manager login and registration
- Queue creation with a name
- Add customer/token entries to queue
- View waiting list
- Reorder tokens up/down in queue
- Assign the first waiting token for service
- Cancel/remove tokens
- Dashboard analytics for waiting time and queue length trends
- Responsive and modern UI

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios, Recharts, Lucide Icons
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project structure

- `frontend/` - React frontend application
- `backend/` - Express backend API
- `README.md` - project documentation

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB instance
- Git (optional, for version control)

## 1. Install dependencies

From the project root:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## 2. Configure environment variables

Create a `.env` file in the `backend/` folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://myuser:myPassword@cluster0.abc123.mongodb.net/queue-management?retryWrites=true&w=majority
```

## 3. Start the application

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

Open a second terminal:

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5174
```

Then open:

- Frontend: http://localhost:5174/
- Backend: http://localhost:5000

## 4. Default login / manager test flow

The application supports manager registration and login through the frontend UI.

You can also test the backend directly with API calls, for example:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Manager","email":"demo@example.com","password":"Password123!"}'
```

Then login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Password123!"}'
```

## 5. Important: MongoDB Atlas IP address issue

This project uses MongoDB Atlas for persistence. If the application suddenly stops connecting to the database, the most common reason is that your public IP address changed.

### Why this happens

MongoDB Atlas has a Network Access setting that allows only certain IP addresses to connect. If your machine is on a different network (for example Wi‑Fi, office network, hotspot, or mobile tether), your public IP can change and Atlas will reject the connection.

### How to fix it

1. Go to your MongoDB Atlas dashboard.
2. Open Network Access.
3. Add the current public IP address.
4. If you are testing with a mobile hotspot, use that connection consistently so the IP remains stable.
5. You can also temporarily allow access from anywhere for testing, but it is less secure.

### Quick check

Run this in PowerShell to see your current public IP:

```powershell
Invoke-RestMethod https://api.ipify.org
```

Then compare that IP with the allowed addresses in MongoDB Atlas.

### When the app is running normally

You should see this in the backend terminal:

```bash
MongoDB connected successfully
```

If you see a connection error or timeout, the DB is likely blocked by Atlas IP restrictions.

## 6. Backend API overview

### Auth routes

- `POST /api/auth/register`
- `POST /api/auth/login`

### Queue routes

- `GET /api/queues`
- `POST /api/queues`
- `GET /api/queues/:id`
- `POST /api/queues/:id/tokens`
- `PATCH /api/queues/:id/tokens/:tokenId/move`
- `PATCH /api/queues/:id/tokens/:tokenId/serve`
- `DELETE /api/queues/:id/tokens/:tokenId`

## 7. Notes

- The app is designed to work with a real MongoDB Atlas connection.
- If MongoDB is unreachable, the frontend may still load, but queue creation and token management will fail until the database connection is restored.
- Use a stable network or add your current IP to Atlas to prevent intermittent disconnects.

## 8. Production and deployment notes

For deployment, you should:

- set a secure environment variable for `MONGODB_URI`
- protect your JWT secret and API credentials
- deploy frontend and backend separately or behind a reverse proxy
- keep Atlas Network Access restricted to trusted IPs

## 9. Troubleshooting

### Frontend not loading

- Make sure the frontend server is running on port 5174
- Check for stale Vite processes on other ports
- Restart with:

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5174
```

### Backend not connecting to MongoDB

- Check your `MONGODB_URI`
- Ensure the current IP is allowed in Atlas
- Use mobile hotspot or a stable network during testing
- Check terminal logs for the MongoDB connection message

### 401 or unauthorized responses

- Make sure you are sending the JWT token from the login response in the Authorization header
- Token must be in the format:

```http
Authorization: Bearer <token>
```

## 10. License

This project is intended for educational and project demonstration use.
