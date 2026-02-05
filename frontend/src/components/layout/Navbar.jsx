import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineLogout, HiOutlineUser, HiOutlineClipboardList } from 'react-icons/hi';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Nav Links */}
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <HiOutlineClipboardList className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-800">TaskFlow</span>
                        </Link>

                        <div className="hidden md:flex space-x-1">
                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard')
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/tasks"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/tasks')
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                Tasks
                            </Link>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="hidden sm:block font-medium">{user?.name}</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <HiOutlineLogout className="w-5 h-5" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
