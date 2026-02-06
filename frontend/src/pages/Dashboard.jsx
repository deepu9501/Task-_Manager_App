import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    FiHome, FiInbox, FiUsers, FiBarChart2, FiFolder, FiCalendar,
    FiFileText, FiSettings, FiHelpCircle, FiPlus, FiSearch,
    FiBell, FiCheckCircle, FiLayout, FiTarget, FiGlobe,
    FiChevronRight, FiLogOut
} from 'react-icons/fi';

// Project Card Component
const ProjectCard = ({ icon: Icon, title, description, completed, total, color }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>

            {/* Progress Section */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{completed}/{total} Tasks</span>
                    <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${color}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                View Project
            </button>
        </div>
    );
};

// Task Item Component
const TaskItem = ({ task, onToggle }) => {
    const completed = task.isCompleted ? 100 : Math.floor(Math.random() * 80) + 10;

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Work': return 'bg-indigo-100 text-indigo-700';
            case 'Personal': return 'bg-emerald-100 text-emerald-700';
            case 'Urgent': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 group">
            {/* Checkbox */}
            <button
                onClick={() => onToggle && onToggle(task._id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${task.isCompleted
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
            >
                {task.isCompleted && <FiCheckCircle className="w-full h-full text-white p-0.5" />}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <p className={`font-medium text-gray-900 ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-32 hidden sm:block">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${task.isCompleted ? 100 : completed}%` }}
                    />
                </div>
            </div>

            {/* Avatars */}
            <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                    D
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                    A
                </div>
                {Math.random() > 0.5 && (
                    <div className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                        +2
                    </div>
                )}
            </div>

            {/* Percentage */}
            <span className="text-sm font-medium text-gray-500 w-12 text-right">
                {task.isCompleted ? 100 : completed}%
            </span>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('all');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { id: 'inbox', label: 'Inbox', icon: FiInbox },
        { id: 'team', label: 'Team', icon: FiUsers },
        { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
        { id: 'projects', label: 'Projects', icon: FiFolder, badge: 3, path: '/tasks' },
        { id: 'calendar', label: 'Calendar', icon: FiCalendar },
        { id: 'documents', label: 'Documents', icon: FiFileText },
        { id: 'settings', label: 'Settings', icon: FiSettings, path: '/profile' },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/tasks');
            if (data.success) {
                const taskList = data.data;
                setStats({
                    total: taskList.length,
                    completed: taskList.filter(t => t.isCompleted).length,
                    pending: taskList.filter(t => !t.isCompleted).length,
                });
                setTasks(taskList);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            await api.patch(`/tasks/${taskId}/complete`);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleNavClick = (item) => {
        setActiveNav(item.id);
        if (item.path) navigate(item.path);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'pending') return !task.isCompleted;
        if (activeTab === 'completed') return task.isCompleted;
        return true;
    }).slice(0, 5);

    const userName = user?.name || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Project data based on task categories
    const projects = [
        {
            icon: FiLayout,
            title: 'Design System',
            description: 'Creating a comprehensive design system',
            completed: tasks.filter(t => t.category === 'Work' && t.isCompleted).length,
            total: tasks.filter(t => t.category === 'Work').length || 45,
            color: 'bg-indigo-600'
        },
        {
            icon: FiTarget,
            title: 'Personal Goals',
            description: 'Tracking personal tasks and goals',
            completed: tasks.filter(t => t.category === 'Personal' && t.isCompleted).length,
            total: tasks.filter(t => t.category === 'Personal').length || 45,
            color: 'bg-violet-600'
        },
        {
            icon: FiGlobe,
            title: 'Urgent Tasks',
            description: 'High priority items to complete',
            completed: tasks.filter(t => t.category === 'Urgent' && t.isCompleted).length,
            total: tasks.filter(t => t.category === 'Urgent').length || 45,
            color: 'bg-slate-700'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Dark Navy */}
            <aside className="w-64 bg-slate-900 fixed left-0 top-0 h-full z-40 flex flex-col">
                {/* Logo */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🍃</span>
                        </div>
                        <span className="text-xl font-bold text-white">Breve</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeNav === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                                {item.badge && (
                                    <span className="ml-auto px-2 py-0.5 text-xs bg-indigo-500 text-white rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Help Section */}
                <div className="px-4 pb-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <FiHelpCircle className="w-5 h-5" />
                        Help & Information
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                            {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userName}</p>
                            <p className="text-xs text-slate-500 truncate">Product designer</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-white transition-colors"
                            title="Logout"
                        >
                            <FiLogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
                    <div className="px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                            <div className="flex items-center gap-4">
                                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiSearch className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                                    <FiBell className="w-5 h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                                        {userInitial}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{userName.split(' ')[0]}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/tasks', { state: { openModal: true } })}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {/* Welcome Section */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                Welcome back, {userName.split(' ')[0]}
                            </h2>
                            <p className="text-gray-500">
                                Track team progress here. You're almost at your goal!
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                            <FiCalendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{today}</span>
                        </div>
                    </div>

                    {/* Project Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                        ))}
                    </div>

                    {/* Tasks Section */}
                    <div className="bg-white rounded-2xl border border-gray-100">
                        {/* Tabs Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                {['all', 'pending', 'completed'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab
                                                ? 'bg-slate-900 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {tab === 'all' ? 'All Tasks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/tasks')}
                                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <FiSettings className="w-4 h-4" />
                                Manage Tasks
                            </button>
                        </div>

                        {/* Task List */}
                        <div className="px-6 py-2">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <TaskItem
                                        key={task._id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiCheckCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {activeTab === 'completed'
                                            ? 'Complete some tasks to see them here!'
                                            : 'Create your first task to get started!'
                                        }
                                    </p>
                                    <button
                                        onClick={() => navigate('/tasks', { state: { openModal: true } })}
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
