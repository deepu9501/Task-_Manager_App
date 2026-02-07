# Task Manager App

A full-stack task management application with real-time task tracking, analytics, and user authentication.

## Project Structure

```
Task_Manager_App/
├── backend/          # Node.js/Express REST API
└── frontend/         # React + Vite UI
```

## Features

- **User Authentication**: Secure login and registration with JWT
- **Task Management**: Create, read, update, and delete tasks
- **Dashboard**: Overview of tasks and key metrics
- **Analytics**: Task completion statistics and insights
- **Calendar View**: Visualize tasks on a calendar
- **User Profile**: Manage user information and preferences

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Custom validators

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Analytics
- `GET /api/analytics` - Get analytics data

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Project Components

### Backend Structure
- **controllers/** - Business logic for each feature
- **models/** - MongoDB schemas (User, Task)
- **routes/** - API endpoint definitions
- **middleware/** - Authentication and error handling
- **config/** - Database configuration
- **validators/** - Input validation rules

### Frontend Structure
- **pages/** - Page components (Login, Dashboard, Tasks, Analytics, Calendar, Profile)
- **components/** - Reusable components
- **services/** - API communication
- **context/** - React Context for authentication
- **src/** - Main styles and entry point

## Development

### Debug Mode
To enable debug logging in the backend, set `DEBUG=*` environment variable before starting.

### Hot Module Replacement (HMR)
Frontend uses Vite's HMR for instant updates during development.

## Deployment

### Backend
- Configure environment variables for production
- Use a process manager like PM2
- Deploy to platforms like Heroku, AWS, or DigitalOcean

### Frontend
- Build the project: `npm run build`
- Deploy the `dist` folder to static hosting (Vercel, Netlify, etc.)

## Security Considerations

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Set proper CORS policies
- Validate and sanitize all user inputs
- Use environment variables for sensitive data

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify MongoDB connection string
- Check Node.js version compatibility

### Frontend won't connect to API
- Verify backend is running on correct port
- Check `VITE_API_URL` in `.env`
- Clear browser cache and try again

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to your branch
5. Create a pull request

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
