import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiCalendar, FiClock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/apiService';

const Analytics = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        stats: {
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            overdueTasks: 0,
            completionRate: 0,
            averageCompletionTime: 0
        },
        weeklyData: [],
        categoryData: [],
        priorityData: []
    });
    const [dateRange, setDateRange] = useState('week');

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            
            // Fetch real analytics data from API
            const data = await ApiService.getAnalyticsData();
            setAnalyticsData(data);
            
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
            setError('Failed to load analytics data. Please check your connection.');
            
            // Set empty state on error
            setAnalyticsData({
                stats: {
                    totalTasks: 0,
                    completedTasks: 0,
                    pendingTasks: 0,
                    overdueTasks: 0,
                    completionRate: 0,
                    averageCompletionTime: 0
                },
                weeklyData: [],
                categoryData: [],
                priorityData: []
            });
        } finally {
            setLoading(false);
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
                    <div className="text-gray-600 text-sm font-medium animate-pulse">Loading Analytics...</div>
                </div>
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
                        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiBarChart2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Tasks</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-gray-900">{analyticsData.stats.totalTasks}</p>
                            <p className="text-sm text-gray-600">All time</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Completed</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-gray-900">{analyticsData.stats.completedTasks}</p>
                            <p className="text-sm text-gray-600">{analyticsData.stats.completionRate}% rate</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FiClock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Pending</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-gray-900">{analyticsData.stats.pendingTasks}</p>
                            <p className="text-sm text-gray-600">{analyticsData.stats.overdueTasks} overdue</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Avg. Time</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-gray-900">{analyticsData.stats.averageCompletionTime}</p>
                            <p className="text-sm text-gray-600">days to complete</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Activity */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FiCalendar className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Weekly Activity</h2>
                        </div>
                        <div className="space-y-4">
                            {analyticsData.weeklyData.map((day, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                            <div 
                                                className="absolute left-0 top-0 h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                                                style={{ width: `${(day.completed / 10) * 100}%` }}
                                            >
                                                <span className="text-xs text-white font-medium">{day.completed}</span>
                                            </div>
                                        </div>
                                        <div className="w-8 text-xs text-gray-500">{day.created}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FiPieChart className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
                        </div>
                        <div className="space-y-4">
                            {analyticsData.categoryData.map((category, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color.replace('bg-', '#').replace('500', '500') }}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900">{category.category}</span>
                                            <span className="text-sm text-gray-600">{category.count} tasks</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-full rounded-full ${category.color}`}
                                                style={{ width: `${(category.count / analyticsData.stats.totalTasks) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Priority Analysis */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FiBarChart2 className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Priority Analysis</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analyticsData.priorityData.map((priority, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 rounded-full ${priority.color} flex items-center justify-center mx-auto mb-3`}>
                                    <span className="text-2xl font-bold text-white">{priority.count}</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">{priority.priority}</h3>
                                <p className="text-sm text-gray-600">tasks</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
