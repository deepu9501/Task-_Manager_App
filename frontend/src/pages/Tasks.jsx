import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiList, FiSearch, FiFilter, FiCalendar, FiX, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockTasks = [
                { _id: '1', title: 'Complete project documentation', description: 'Write comprehensive documentation for the new feature', priority: 'High', category: 'Work', isCompleted: false, dueDate: '2024-02-10' },
                { _id: '2', title: 'Review pull requests', description: 'Review and merge pending pull requests', priority: 'Medium', category: 'Development', isCompleted: true, dueDate: '2024-02-08' },
                { _id: '3', title: 'Team meeting preparation', description: 'Prepare slides for weekly team sync', priority: 'High', category: 'Meetings', isCompleted: false, dueDate: '2024-02-09' },
                { _id: '4', title: 'Code review for feature branch', description: 'Review code changes in feature/authentication branch', priority: 'Medium', category: 'Development', isCompleted: false, dueDate: '2024-02-11' },
                { _id: '5', title: 'Update dependencies', description: 'Update all npm packages to latest versions', priority: 'Low', category: 'Development', isCompleted: true, dueDate: '2024-02-07' }
            ];
            
            setTasks(mockTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
                             (filterStatus === 'completed' && task.isCompleted) ||
                             (filterStatus === 'pending' && !task.isCompleted);
        return matchesSearch && matchesFilter;
    });

    const handleCreateTask = () => {
        if (newTask.title.trim()) {
            const task = {
                ...newTask,
                _id: Date.now().toString(),
                isCompleted: false
            };
            
            if (editingTask) {
                setTasks(tasks.map(t => t._id === editingTask._id ? { ...task, _id: editingTask._id } : t));
            } else {
                setTasks([task, ...tasks]);
            }
            
            setNewTask({ title: '', description: '', priority: 'Medium', category: 'Work', dueDate: '' });
            setEditingTask(null);
            setShowModal(false);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            dueDate: task.dueDate
        });
        setShowModal(true);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(t => t._id !== taskId));
    };

    const handleToggleComplete = (taskId) => {
        setTasks(tasks.map(t => 
            t._id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        ));
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
                        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
                        <div className="relative">
                            <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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
                        {filteredTasks.map((task) => (
                            <div
                                key={task._id}
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
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {task.category}
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
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
