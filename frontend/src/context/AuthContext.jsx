import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            
            // Login via API
            const { default: ApiService } = await import('../services/apiService');
            const result = await ApiService.login(email, password);
            
            setUser(result.user);
            setIsAuthenticated(true);
            
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            
            // Logout via API
            const { default: ApiService } = await import('../services/apiService');
            await ApiService.logout();
            
            // Clear local storage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            setUser(null);
            setIsAuthenticated(false);
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser,
        setIsAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
