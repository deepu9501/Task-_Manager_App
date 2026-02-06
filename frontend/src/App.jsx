import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50">
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <PublicRoute>
                                        <Register />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tasks"
                                element={
                                    <ProtectedRoute>
                                        <Tasks />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/calendar"
                                element={
                                    <ProtectedRoute>
                                        <Calendar />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analytics"
                                element={
                                    <ProtectedRoute>
                                        <Analytics />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/dashboard" />}
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
