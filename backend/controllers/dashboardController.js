const Task = require('../models/Task');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all tasks for the user
        const allTasks = await Task.find({ userId });

        // Calculate statistics
        const total = allTasks.length;
        const completed = allTasks.filter(task => task.isCompleted).length;
        const pending = allTasks.filter(task => !task.isCompleted).length;
        
        // Calculate overdue tasks
        const overdue = allTasks.filter(task => 
            !task.isCompleted && 
            task.dueDate && 
            new Date(task.dueDate) < today
        ).length;

        // Calculate today's tasks
        const todayTasks = allTasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        }).length;

        // Calculate in-progress tasks (tasks with progress > 0 and < 100)
        const inProgress = allTasks.filter(task => 
            !task.isCompleted && 
            task.progress && 
            task.progress > 0 && 
            task.progress < 100
        ).length;

        // Get recent tasks (last 5)
        const recentTasks = await Task.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        const stats = {
            total,
            completed,
            pending,
            overdue,
            inProgress,
            todayTasks
        };

        res.status(200).json({
            success: true,
            stats,
            recentTasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
