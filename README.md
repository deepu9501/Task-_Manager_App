# Task Manager App

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**
  - User registration with email and password
  - Login with JWT token authentication
  - Password hashing with bcrypt
  - Protected routes

- **Task Management (CRUD)**
  - Create, Read, Update, Delete tasks
  - Mark tasks as complete/incomplete
  - Set priority levels (High, Medium, Low)
  - Categorize tasks (Work, Personal, Urgent, Other)
  - Add due dates

- **Task Organization**
  - Filter by status (completed/pending)
  - Filter by category
  - Filter by priority
  - Search tasks by title/description

- **Dashboard**
  - Task statistics overview
  - Upcoming tasks display
  - Quick action buttons

## 🛠️ Tech Stack

**Frontend:**
- React.js (with Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- bcryptjs
- express-validator

## 📁 Project Structure

```
Task_Manager_App/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── taskRoutes.js      # Task endpoints
│   ├── validators/
│   │   └── validators.js      # Input validation
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Register.jsx
    │   │   └── Tasks.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── taskService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Clone Repository

```bash
git clone <repository-url>
cd Task_Manager_App
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tasks` | Create new task | Private |
| GET | `/api/tasks` | Get all tasks | Private |
| GET | `/api/tasks/:id` | Get task by ID | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| PATCH | `/api/tasks/:id/complete` | Toggle completion | Private |

### Query Parameters for Filtering

- `status`: `completed` or `pending`
- `category`: `Work`, `Personal`, `Urgent`, `Other`
- `priority`: `High`, `Medium`, `Low`
- `search`: Search term for title/description

Example: `GET /api/tasks?status=pending&priority=High`

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiration time |

## 📱 Screenshots

*Screenshots will be added here*

## 🧪 Testing

Test the API endpoints using Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 👨‍💻 Author

Your Name

## 📄 License

This project is open source and available under the MIT License.
