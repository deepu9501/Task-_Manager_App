import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar } from 'react-icons/hi';

const Profile = () => {
    const { user } = useAuth();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Profile</h1>
                <p className="text-slate-500 mt-1">Manage your account information</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-4xl font-bold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <HiOutlineUser className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Full Name</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <HiOutlineMail className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email Address</p>
                                <p className="text-lg font-semibold text-slate-800">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <HiOutlineCalendar className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Member Since</p>
                                <p className="text-lg font-semibold text-slate-800">{formatDate(user?.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
