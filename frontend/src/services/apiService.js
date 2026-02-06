// API Service for handling all API calls
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    // Auth endpoints
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                throw new Error(`Login failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
            
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout API error:', error);
        }
    }

    static async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            return await response.json();
        } catch (error) {
            console.error('Get current user API error:', error);
            return null;
        }
    }

    // Task endpoints
    static async getTasks(filters = {}) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Build query string from filters
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `${API_BASE_URL}/tasks?${queryParams}` : `${API_BASE_URL}/tasks`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }

            const result = await response.json();
            return result.data; // Return the actual tasks array
        } catch (error) {
            console.error('Get tasks API error:', error);
            throw error;
        }
    }

    static async createTask(taskData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create task: ${response.statusText}`);
            }

            const result = await response.json();
            return result.data; // Return the actual task data
        } catch (error) {
            console.error('Create task API error:', error);
            throw error;
        }
    }

    static async updateTask(taskId, taskData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update task: ${response.statusText}`);
            }

            const result = await response.json();
            return result.data; // Return the actual task data
        } catch (error) {
            console.error('Update task API error:', error);
            throw error;
        }
    }

    static async deleteTask(taskId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete task: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Delete task API error:', error);
            throw error;
        }
    }

    static async getDashboardStats() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }

    static async getAnalyticsData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Analytics data API error:', error);
            throw error;
        }
    }

    static async updateProfile(profileData) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update profile API error:', error);
            throw error;
        }
    }
}

export default ApiService;
