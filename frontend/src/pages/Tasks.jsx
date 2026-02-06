import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiList, FiSearch, FiFilter, FiCalendar, FiX, FiCheck, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import ApiService from '../services/apiService';

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
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
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch real tasks from API
            const data = await ApiService.getTasks();
            setTasks(Array.isArray(data) ? data : []);
            
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setError('Failed to load tasks. Please check your connection.');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks && Array.isArray(tasks) ? tasks.filter(task => {
        if (!task || typeof task !== 'object') return false;
        
        const matchesSearch = (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' ||
                             (filterStatus === 'completed' && task.isCompleted) ||
                             (filterStatus === 'pending' && !task.isCompleted);
        return matchesSearch && matchesFilter;
    }) : [];

    const handleCreateTask = async () => {
        if (newTask.title.trim()) {
            try {
                setLoading(true);
                
                const taskData = {
                    ...newTask,
                    isCompleted: false,
                    createdAt: new Date().toISOString()
                };
                
                // Create task via API
                const createdTask = await ApiService.createTask(taskData);
                setTasks([createdTask, ...tasks]);
                
                // Clear form and close modal
                setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
                setEditingTask(null);
                setShowModal(false);
                
                // Refresh dashboard data to show new task
                if (window.location.pathname === '/tasks') {
                    // Trigger a custom event to notify dashboard
                    window.dispatchEvent(new CustomEvent('taskCreated', { detail: createdTask }));
                }
                
            } catch (error) {
                console.error('Failed to create task:', error);
                setError('Failed to create task. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditTask = async (task) => {
        try {
            setEditingTask(task);
            setNewTask({
                title: task.title,
                description: task.description,
                priority: task.priority,
                category: task.category,
                dueDate: task.dueDate
            });
            setShowModal(true);
        } catch (error) {
            console.error('Failed to edit task:', error);
            setError('Failed to edit task. Please try again.');
        }
    };

    const handleUpdateTask = async () => {
        if (editingTask && newTask.title.trim()) {
            try {
                setLoading(true);
                
                // Update task via API
                const updatedTask = await ApiService.updateTask(editingTask._id, newTask);
                setTasks(tasks.map(t => t._id === editingTask._id ? updatedTask : t));
                
                setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
                setEditingTask(null);
                setShowModal(false);
                
                // Notify dashboard of task update
                window.dispatchEvent(new CustomEvent('taskUpdated', { detail: updatedTask }));
                
            } catch (error) {
                console.error('Failed to update task:', error);
                setError('Failed to update task. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // Delete task via API
            await ApiService.deleteTask(taskId);
            setTasks(tasks.filter(t => t._id !== taskId));
            
            // Notify dashboard of task deletion
            window.dispatchEvent(new CustomEvent('taskDeleted', { detail: { taskId } }));
            
        } catch (error) {
            console.error('Failed to delete task:', error);
            setError('Failed to delete task. Please try again.');
        }
    };

    const handleToggleComplete = async (taskId) => {
        try {
            const task = tasks.find(t => t._id === taskId);
            if (task) {
                // Update task via API
                const updatedTask = await ApiService.updateTask(taskId, {
                    isCompleted: !task.isCompleted
                });
                setTasks(tasks.map(t => t._id === taskId ? updatedTask : t));
                
                // Notify dashboard of task completion change
                window.dispatchEvent(new CustomEvent('taskToggled', { detail: updatedTask }));
            }
        } catch (error) {
            console.error('Failed to toggle task completion:', error);
            setError('Failed to update task. Please try again.');
        }
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
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="Go back to dashboard"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
                        <div className="relative">
                            <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            Add Task
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-8 py-6">
                {filteredTasks.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredTasks.map((task) => {
                            if (!task || typeof task !== 'object') return null;
                            
                            return (
                            <div
                                key={task._id || Math.random()}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <button
                                            onClick={() => handleToggleComplete(task._id)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                                                task.isCompleted 
                                                    ? 'bg-green-500 border-green-500' 
                                                    : 'border-gray-300 hover:border-green-400'
                                            } transition-colors`}
                                        >
                                            {task.isCompleted && (
                                                <FiCheck className="w-3 h-3 text-white" />
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium text-gray-900 ${
                                                task.isCompleted ? 'line-through text-gray-500' : ''
                                            }`}>
                                                {task.title || 'Untitled Task'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{task.description || 'No description available'}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {task.priority || 'Medium'}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {task.category || 'General'}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FiCalendar className="w-3 h-3" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Edit task"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            aria-label="Delete task"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FiList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiPlus className="w-4 h-4 mr-2" />
                                Create Task
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTask(null);
                                    setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter task title"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Enter task description"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Health">Health</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTask(null);
                                    setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingTask ? 'Update Task' : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
