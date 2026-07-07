# Task Flow Management App

A full-stack productivity app for managing tasks on a drag-and-drop board, with priority levels, due-date tracking, light/dark themes, and visual progress tracking. Created for Senior Project at Palm Beach Atlantic University.

![Task Flow Screenshot](tm3.PNG)

## Live Demo
(https://task-manager-app-mauve-tau.vercel.app/)

## Tech Stack

**Frontend:** React, Recharts, Axios  
**Backend:** Node.js, Express  
**Database:** MongoDB Atlas  
**Auth:** JWT, bcrypt  

## Features

- User registration and login with JWT authentication
- Drag-and-drop status board (To Do / In Progress / Done) — drag a card to change its status
- Quick-capture bar to add a task with a single keystroke (press Enter, or `/` to focus it)
- Inline editing of a task's title, description, priority, and due date — click to edit
- Priority levels (Low, Medium, High) with subtle color coding
- Human-friendly due dates ("Due tomorrow", "Overdue by 2 days") with overdue and due-soon highlighting
- Search, filter by priority or overdue, and group by status, priority, or due date
- Light and dark mode — persists across visits and follows your system preference
- Optimistic updates with an undo option on delete
- Compact progress donut and completion metrics
- Responsive layout that collapses the board on small screens

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET to .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000  
Backend runs on http://localhost:5000

## Project Structure
```
task-manager-app/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route logic
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # Mongoose schemas
│   └── routes/        # API endpoints
└── frontend/
    └── src/
        ├── components/ # TaskForm, TaskList, TaskCard, ProgressChart, AuthForm, ToastHost
        ├── utils/      # shared task helpers (due dates, grouping, sorting, theme colors)
        └── styles/     # CSS design-token system (light/dark themes)
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/tasks | Get all tasks | Yes |
| POST | /api/tasks | Create task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |

## Author
Jackson Elliott — CS Senior, Palm Beach Atlantic University
