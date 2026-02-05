import api from './api';

// Get all tasks with optional filters
export const getTasks = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';

    const response = await api.get(url);
    return response.data;
};

// Get single task by ID
export const getTask = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

// Update a task
export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

// Toggle task completion
export const toggleTaskComplete = async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
};
