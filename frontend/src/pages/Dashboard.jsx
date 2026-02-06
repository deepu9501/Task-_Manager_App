import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiList, FiPlus, FiTrendingUp, FiHome, FiUser, FiLogOut, FiInbox, FiActivity, FiSearch, FiFilter, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/apiService';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState('week');
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        inProgress: 0,
        todayTasks: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
        
        // Listen for task events
        const handleTaskCreated = () => {
            fetchDashboardData();
        };
        
        const handleTaskUpdated = () => {
            fetchDashboardData();
        };
        
        const handleTaskDeleted = () => {
            fetchDashboardData();
        };
        
        const handleTaskToggled = () => {
            fetchDashboardData();
        };
        
        // Refresh when page becomes visible (navigation back to dashboard)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchDashboardData();
            }
        };
        
        window.addEventListener('taskCreated', handleTaskCreated);
        window.addEventListener('taskUpdated', handleTaskUpdated);
        window.addEventListener('taskDeleted', handleTaskDeleted);
        window.addEventListener('taskToggled', handleTaskToggled);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            window.removeEventListener('taskCreated', handleTaskCreated);
            window.removeEventListener('taskUpdated', handleTaskUpdated);
            window.removeEventListener('taskDeleted', handleTaskDeleted);
            window.removeEventListener('taskToggled', handleTaskToggled);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [dateRange]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch real data from API
            const data = await ApiService.getDashboardStats();
            setStats(data.stats || {
                total: 0,
                completed: 0,
                pending: 0,
                overdue: 0,
                inProgress: 0,
                todayTasks: 0
            });
            setRecentTasks(Array.isArray(data.recentTasks) ? data.recentTasks : []);
            
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setError('Failed to load dashboard data. Please check your connection.');
            
            // Set empty state on error
            setStats({
                total: 0,
                completed: 0,
                pending: 0,
                overdue: 0,
                inProgress: 0,
                todayTasks: 0
            });
            setRecentTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const filteredTasks = recentTasks && Array.isArray(recentTasks) ? recentTasks.filter(task => {
        if (!task || typeof task !== 'object') return false;
        
        const matchesSearch = (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (task.description && task.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' ||
                             (filterStatus === 'completed' && task.isCompleted) ||
                             (filterStatus === 'pending' && !task.isCompleted) ||
                             (filterStatus === 'overdue' && !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date());
        return matchesSearch && matchesFilter;
    }) : [];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
        return date.toLocaleDateString();
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { id: 'tasks', label: 'Tasks', icon: FiList, path: '/tasks' },
        { id: 'analytics', label: 'Analytics', icon: FiTrendingUp, path: '/analytics' },
        { id: 'profile', label: 'Profile', icon: FiUser, path: '/profile' },
    ];

    const quickActions = [
        { id: 'create-task', label: 'Create Task', icon: FiPlus, color: 'bg-blue-600 hover:bg-blue-700' },
        { id: 'view-calendar', label: 'View Calendar', icon: FiCalendar, color: 'bg-purple-600 hover:bg-purple-700' },
        { id: 'export-data', label: 'Export Data', icon: FiMoreVertical, color: 'bg-gray-600 hover:bg-gray-700' }
    ];

    const handleNavClick = (item) => {
        setActiveNav(item.id);
        navigate(item.path);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const handleQuickAction = async (action) => {
        try {
            switch (action.id) {
                case 'create-task':
                    navigate('/tasks', { state: { openModal: true } });
                    break;
                case 'view-calendar':
                    navigate('/calendar');
                    break;
                case 'export-data':
                    // Implement export functionality
                    console.log('Export data functionality');
                    break;
                default:
                    console.log('Unknown action:', action.id);
            }
        } catch (error) {
            console.error('Quick action error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm font-medium animate-pulse">Loading Dashboard...</div>
                    <div className="text-gray-400 text-xs">Preparing your workspace</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Fixed Left Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-40">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FiHome className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeNav === item.id
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64">
                {/* Enhanced Header with Search and Filters */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between gap-6">
                            {/* Left Section - Welcome + Search */}
                            <div className="flex items-center gap-6 flex-1">
                                <div className="text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                        Welcome back, {user?.name?.split(' ')[0]}
                                    </h1>
                                    <p className="text-gray-600 text-sm">
                                        {stats.todayTasks > 0 ? `You have ${stats.todayTasks} tasks today` : 'No tasks for today'}
                                    </p>
                                </div>
                                
                                {/* Search Bar */}
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                            
                            {/* Right Section - Filters + Date Range */}
                            <div className="flex items-center gap-3">
                                {/* Date Range Selector */}
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                </select>
                                
                                {/* Status Filter */}
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="all">All Tasks</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                
                                {/* Quick Actions Toggle */}
                                <button
                                    onClick={() => setShowQuickActions(!showQuickActions)}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Toggle quick actions"
                                >
                                    <FiMoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Quick Actions Bar */}
                        {showQuickActions && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">Quick Actions</div>
                                    <div className="flex items-center gap-2">
                                        {quickActions.map((action) => {
                                            const Icon = action.icon;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => {
                                                        if (action.id === 'create-task') navigate('/tasks', { state: { openModal: true } });
                                                        else if (action.id === 'view-calendar') navigate('/calendar');
                                                        else if (action.id === 'export-data') console.log('Export data');
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${action.color}`}
                                                    aria-label={action.label}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span>{action.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-6xl mx-auto px-8 py-6">
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-12 gap-4 mb-6">
                        {/* Total Tasks Card */}
                        <div className="col-span-3">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiList className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total</span>
                                        <div className="text-xs text-gray-500 mt-1">All tasks</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.total / 10) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{stats.total > 0 ? '10% of workspace' : 'No tasks'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Completed Tasks Card */}
                        <div className="col-span-3">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiCheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Completed</span>
                                        <div className="text-xs text-gray-500 mt-1">Done tasks</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">{stats.completed}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{completionRate}% completion rate</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Tasks Card */}
                        <div className="col-span-3">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiClock className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Pending</span>
                                        <div className="text-xs text-gray-500 mt-1">To-do tasks</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">{stats.pending}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}% of total` : 'No pending tasks'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Tasks Card */}
                        <div className="col-span-3">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <FiCalendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Today</span>
                                        <div className="text-xs text-gray-500 mt-1">Due today</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">{stats.todayTasks}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${stats.total > 0 ? (stats.todayTasks / stats.total) * 100 : 0}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{stats.total > 0 ? `${Math.round((stats.todayTasks / stats.total) * 100)}% of total` : 'No tasks today'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Tasks and Activity Section */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
                                            <p className="text-sm text-gray-600">Your latest task updates</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/tasks')}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View All
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    {recentTasks.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentTasks && Array.isArray(recentTasks) && recentTasks.map((task) => {
                                            if (!task || typeof task !== 'object') return null;
                                            
                                            return (
                                                <div
                                                    key={task._id || Math.random()}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                    onClick={() => navigate('/tasks')}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        task.isCompleted 
                                                            ? 'bg-green-500 border-green-500' 
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {task.isCompleted && (
                                                            <FiCheckCircle className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium text-gray-900 truncate ${
                                                            task.isCompleted ? 'line-through text-gray-500' : ''
                                                        }`}>
                                                            {task.title || 'Untitled Task'}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                                {task.priority || 'Medium'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {task.category || 'General'}
                                                            </span>
                                                            {task.dueDate && (
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FiInbox className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                                            <p className="text-gray-600 mb-4">Create your first task to get started</p>
                                            <button
                                                onClick={() => navigate('/tasks', { state: { openModal: true } })}
                                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <FiPlus className="w-4 h-4 mr-2" />
                                                Create Task
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Activity Sidebar */}
                        <div className="col-span-4">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FiActivity className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-gray-900">{stats.completed}</span> tasks completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-gray-900">{stats.pending}</span> tasks pending
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-gray-900">{completionRate}%</span> completion rate
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
