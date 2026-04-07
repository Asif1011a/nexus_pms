# Nexus Project Management System

A full-stack project management web application with a React frontend and Node.js/Express/MongoDB backend.

## Structure

```
project_managment_sys/
├── frontend/   # React + Vite + TailwindCSS
└── backend/    # Node.js + Express + MongoDB
```

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env   # fill in your MongoDB URI and JWT secret
npm install
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Auth**: JWT-based with Admin / User roles
