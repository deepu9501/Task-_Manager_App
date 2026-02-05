const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API is running' });
});

// TODO: Add routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
