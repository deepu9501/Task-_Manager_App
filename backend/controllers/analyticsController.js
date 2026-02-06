const Task = require('../models/Task');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
exports.getAnalyticsData = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();

        // Get all tasks for the user
        const allTasks = await Task.find({ userId });

        // Calculate basic statistics
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.isCompleted).length;
        const pendingTasks = allTasks.filter(task => !task.isCompleted).length;
        
        // Calculate overdue tasks
        const overdueTasks = allTasks.filter(task => 
            !task.isCompleted && 
            task.dueDate && 
            new Date(task.dueDate) < today
        ).length;

        // Calculate completion rate
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Calculate average completion time (in days)
        const completedTasksWithDates = allTasks.filter(task => 
            task.isCompleted && 
            task.createdAt && 
            task.updatedAt
        );
        
        let averageCompletionTime = 0;
        if (completedTasksWithDates.length > 0) {
            const totalDays = completedTasksWithDates.reduce((sum, task) => {
                const created = new Date(task.createdAt);
                const completed = new Date(task.updatedAt);
                const days = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0);
            averageCompletionTime = Math.round((totalDays / completedTasksWithDates.length) * 10) / 10;
        }

        // Weekly data (last 7 days)
        const weeklyData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dayTasks = allTasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate >= date && taskDate < nextDate;
            });
            
            const dayCompleted = dayTasks.filter(task => task.isCompleted).length;
            
            weeklyData.push({
                day: days[date.getDay()],
                completed: dayCompleted,
                created: dayTasks.length
            });
        }

        // Category distribution
        const categoryCounts = {};
        allTasks.forEach(task => {
            const category = task.category || 'General';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            count,
            color: getCategoryColor(category)
        }));

        // Priority distribution
        const priorityCounts = { High: 0, Medium: 0, Low: 0 };
        allTasks.forEach(task => {
            const priority = task.priority || 'Medium';
            if (priorityCounts.hasOwnProperty(priority)) {
                priorityCounts[priority]++;
            }
        });

        const priorityData = Object.entries(priorityCounts).map(([priority, count]) => ({
            priority,
            count,
            color: getPriorityColor(priority)
        }));

        const stats = {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            completionRate,
            averageCompletionTime
        };

        res.status(200).json({
            success: true,
            stats,
            weeklyData,
            categoryData,
            priorityData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Helper function to get category color
function getCategoryColor(category) {
    const colors = {
        'Work': 'bg-blue-500',
        'Personal': 'bg-green-500',
        'Development': 'bg-purple-500',
        'Health': 'bg-red-500',
        'Meetings': 'bg-yellow-500',
        'General': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
}

// Helper function to get priority color
function getPriorityColor(priority) {
    const colors = {
        'High': 'bg-red-500',
        'Medium': 'bg-yellow-500',
        'Low': 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
}
