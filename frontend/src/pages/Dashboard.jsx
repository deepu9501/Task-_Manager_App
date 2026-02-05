import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../services/taskService';
import { HiOutlineClipboardCheck, HiOutlineClock, HiOutlineCheckCircle, HiOutlinePlus, HiOutlineChevronRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            const allTasks = response.data || [];
            setTasks(allTasks);

            // Calculate stats
            const completed = allTasks.filter(task => task.isCompleted).length;
            setStats({
                total: allTasks.length,
                completed,
                pending: allTasks.length - completed,
            });
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    // Get upcoming tasks (not completed, sorted by due date)
    const upcomingTasks = tasks
        .filter(task => !task.isCompleted && task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-700';
            case 'Medium':
                return 'bg-amber-100 text-amber-700';
            case 'Low':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Welcome back, <span className="text-indigo-600">{user?.name}</span>! 👋
                </h1>
                <p className="text-slate-500 mt-1">Here's what's happening with your tasks today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <HiOutlineClipboardCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Completed</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending</p>
                            <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <HiOutlineClock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Tasks */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Upcoming Tasks</h2>
                            <Link
                                to="/tasks"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                            >
                                View all
                                <HiOutlineChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="p-6">
                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-800 truncate">{task.title}</h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-sm text-slate-500">{task.category}</span>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-sm font-medium text-slate-600">{formatDate(task.dueDate)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <HiOutlineClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No upcoming tasks</p>
                                <Link
                                    to="/tasks"
                                    className="inline-flex items-center mt-3 text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    <HiOutlinePlus className="w-4 h-4 mr-1" />
                                    Add your first task
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
                    </div>

                    <div className="p-6 space-y-3">
                        <Link
                            to="/tasks"
                            className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            <HiOutlinePlus className="w-5 h-5 mr-2" />
                            Add New Task
                        </Link>

                        <Link
                            to="/tasks?status=pending"
                            className="flex items-center justify-center w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            <HiOutlineClock className="w-5 h-5 mr-2" />
                            View Pending Tasks
                        </Link>

                        <Link
                            to="/tasks?status=completed"
                            className="flex items-center justify-center w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                            View Completed
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
