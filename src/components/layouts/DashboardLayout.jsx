import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiFileText,
  FiCalendar,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hodNav = [
  { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
  { name: 'Department', icon: FiUsers, href: '/dashboard/department' },
  { name: 'Defense Schedule', icon: FiCalendar, href: '/defense/supervisor' },     
  { name: 'Reports', icon: FiFileText, href: '/dashboard/reports' },
];

  const studentNav = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'My Logbook', icon: FiBook, href: '/dashboard/logbook' },
    { name: 'SIWES Letter', icon: FiFileText, href: '/dashboard/letter' },
    { name: 'Supervisors', icon: FiUsers, href: '/dashboard/supervisors' },
    { name: 'Defense', icon: FiCalendar, href: '/dashboard/defense' },
  ];

  const supervisorNav = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Students', icon: FiUsers, href: '/dashboard/students' },
    { name: 'Logbooks', icon: FiBook, href: '/dashboard/reviews' },
    { name: 'Reports', icon: FiFileText, href: '/dashboard/reports' },
  ];

  const coordinatorNav = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Generate Codes', icon: FiUsers, href: '/dashboard/codes' },
    { name: 'Upload Letters', icon: FiFileText, href: '/dashboard/letters' },
    { name: 'All Students', icon: FiUsers, href: '/dashboard/all-students' },
    { name: 'Assignments', icon: FiUsers, href: '/dashboard/assignments' },
    { name: 'Defense Mgmt', icon: FiCalendar, href: '/dashboard/defense-mgmt' },
  ];

  const getNavItems = () => {
    switch(user?.role) {
      case 'student': return studentNav;
      case 'institutionSupervisor':
      case 'industrySupervisor': return supervisorNav;
      case 'hod': return [...supervisorNav, { name: 'Department', icon: FiUsers, href: '/dashboard/department' }];
      case 'siwesCoordinator': return coordinatorNav;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-gray-600"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-0
        transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">InternTrack</h1>
          <p className="text-sm text-gray-500">SIWES Management System</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {getNavItems().map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <item.icon className="mr-3" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
              <FiLogOut />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {window.location.pathname.split('/').pop() || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <FiSettings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;