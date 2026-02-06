import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiSettings, FiLogOut, FiEdit2, FiArrowLeft, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/apiService';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch real user data from API
            const userData = await ApiService.getCurrentUser();
            setProfileData(userData);
            
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                bio: userData.bio || ''
            });
            
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            setError('Failed to load profile. Please check your connection.');
            
            // Use context user data as fallback
            if (user) {
                setProfileData(user);
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    bio: user.bio || ''
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setUpdateLoading(true);
            
            // Update user profile via API
            const updatedData = await ApiService.updateProfile(formData);
            setProfileData(updatedData);
            setEditing(false);
            
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                bio: profileData.bio || ''
            });
        }
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
                <div className="max-w-4xl mx-auto flex items-center justify-between">
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
                        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                {!editing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Avatar Section */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                                    <p className="text-gray-600">{user?.email}</p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={editing ? formData.name : user?.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!editing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={editing ? formData.email : user?.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!editing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        value={editing ? formData.bio : user?.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!editing}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    {editing ? (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleEdit}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiCalendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Member Since</p>
                                        <p className="font-medium text-gray-900">
                                            {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'January 2024'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Account Type</p>
                                        <p className="font-medium text-gray-900">Premium</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FiSettings className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Settings</p>
                                        <button className="font-medium text-blue-600 hover:text-blue-700">
                                            Configure
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Export Data
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Privacy Settings
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
