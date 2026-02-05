const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, description, category, priority, dueDate } = req.body;

        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            category,
            priority,
            dueDate
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const { status, category, priority, search } = req.query;

        // Build query object
        let query = { userId: req.user._id };

        // Filter by completion status
        if (status === 'completed') {
            query.isCompleted = true;
        } else if (status === 'pending') {
            query.isCompleted = false;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Make sure user owns the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Make sure user owns the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        const { title, description, category, priority, dueDate, isCompleted } = req.body;

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, category, priority, dueDate, isCompleted },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Make sure user owns the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task'
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/complete
// @access  Private
exports.toggleComplete = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Make sure user owns the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { isCompleted: !task.isCompleted },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
