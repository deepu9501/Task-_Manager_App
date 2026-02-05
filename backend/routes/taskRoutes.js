const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    toggleComplete
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { createTaskValidation, updateTaskValidation } = require('../validators/validators');

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
    .post(createTaskValidation, createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTaskValidation, updateTask)
    .delete(deleteTask);

router.patch('/:id/complete', toggleComplete);

module.exports = router;
