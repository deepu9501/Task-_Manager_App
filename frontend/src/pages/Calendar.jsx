import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/apiService';

const Calendar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Work',
        dueDate: ''
    });

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchTasks();
    }, [currentDate]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch tasks for the current month
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            const data = await ApiService.getTasks({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
            
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setError('Failed to load calendar. Please check your connection.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getTasksForDate = (date) => {
        const dateStr = date.toDateString();
        return tasks.filter(task => {
            if (task.dueDate) {
                return new Date(task.dueDate).toDateString() === dateStr;
            }
            return false;
        });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setNewTask({
            ...newTask,
            dueDate: date.toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleCreateTask = async () => {
        if (newTask.title.trim()) {
            try {
                setLoading(true);
                
                const taskData = {
                    ...newTask,
                    isCompleted: false,
                    createdAt: new Date().toISOString()
                };
                
                const createdTask = await ApiService.createTask(taskData);
                setTasks([...tasks, createdTask]);
                
                setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
                setShowModal(false);
                setSelectedDate(null);
            } catch (error) {
                console.error('Failed to create task:', error);
                setError('Failed to create task. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayTasks = getTasksForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today && !isToday;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isToday ? 'bg-blue-50 border-blue-300' : ''
                    } ${isPast ? 'bg-gray-50' : ''}`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                            isToday ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-900'
                        }`}>
                            {day}
                        </span>
                        {dayTasks.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                {dayTasks.length}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task, index) => (
                            <div
                                key={task._id || index}
                                className={`text-xs p-1 rounded truncate ${
                                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}
                            >
                                {task.title}
                            </div>
                        ))}
                        {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="Go back to dashboard"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Previous month"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-lg font-medium text-gray-900 min-w-[200px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Next month"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Calendar Grid */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7">
                        {renderCalendarDays()}
                    </div>
                </div>

                {/* Task Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Add Task for {selectedDate?.toLocaleDateString()}
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Task title"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Task description"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={newTask.category}
                                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Development">Development</option>
                                            <option value="Meetings">Meetings</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    disabled={!newTask.title.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Calendar;
