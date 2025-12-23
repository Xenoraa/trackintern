import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS, NAV_ITEMS } from '../../utils/constants.jsx';
import { getInitials } from '../../utils/helpers.jsx';
import { FiLogOut, FiMenu, FiX, FiHome, FiUser, FiSettings } from 'react-icons/fi';
import { MdDashboard, MdBook, MdPeople, MdAssignment, MdGrade } from 'react-icons/md';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const iconMap = {
        Home: FiHome,
        Dashboard: MdDashboard,
        Book: MdBook,
        Users: MdPeople,
        BookOpen: MdBook,
        UserPlus: MdPeople,
        Key: FiSettings,
        Calendar: MdAssignment,
        Award: MdGrade,
        FileText: MdBook,
        User: FiUser,
        PlusCircle: FiHome,
        Shield: FiHome,
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = NAV_ITEMS[user?.role] || [];

    if (!user) {
        return children;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile header */}
            <div className="lg:hidden bg-white shadow-sm border-b">
                <div className="px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user.fullName || user.email}</p>
                            <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold">
                {getInitials(user.fullName || user.email)}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar for desktop */}
                <aside className={`hidden lg:block ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r shadow-sm transition-all duration-300`}>
                    <div className="h-full flex flex-col">
                        {/* Logo */}
                        <div className="p-6 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">IT</span>
                                </div>
                                {isSidebarOpen && (
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">InternTrack</h1>
                                        <p className="text-xs text-gray-500">SIWES Management</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {navItems.map((item) => {
                                    const Icon = iconMap[item.icon];
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                    isActive
                                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                {Icon && <Icon size={20} />}
                                                {isSidebarOpen && <span>{item.label}</span>}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* User profile and logout */}
                        <div className="p-4 border-t">
                            <div className="flex items-center justify-between">
                                {isSidebarOpen && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {getInitials(user.fullName || user.email)}
                      </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.fullName || user.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {ROLE_LABELS[user.role]}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                    title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                                >
                                    <FiMenu size={20} className={isSidebarOpen ? 'transform rotate-180' : ''} />
                                </button>
                            </div>

                            {isSidebarOpen && (
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiLogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Mobile sidebar overlay */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">IT</span>
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold text-gray-900">InternTrack</h1>
                                            <p className="text-xs text-gray-500">SIWES Management</p>
                                        </div>
                                    </div>
                                </div>

                                <nav className="flex-1 p-4">
                                    <ul className="space-y-2">
                                        {navItems.map((item) => {
                                            const Icon = iconMap[item.icon];
                                            const isActive = location.pathname === item.path;

                                            return (
                                                <li key={item.path}>
                                                    <Link
                                                        to={item.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                                            isActive
                                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {Icon && <Icon size={20} />}
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                <div className="p-4 border-t">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {getInitials(user.fullName || user.email)}
                      </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.fullName || user.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {ROLE_LABELS[user.role]}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FiLogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;