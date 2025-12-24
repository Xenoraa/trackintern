import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { 
  FiUsers, 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiDownload,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPhone,
  FiCalendar
} from 'react-icons/fi';

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form state
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    role: 'student',
    department: '',
    phone: '',
    status: 'active'
  });

  // Mock data for users
  const mockUsers = [
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@baze.edu.ng',
      role: 'student',
      department: 'Computer Science',
      studentId: 'BU/23AJIT/8001',
      phone: '+234 801 234 5678',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-20 14:30',
      logbooksSubmitted: 6
    },
    {
      id: '2',
      fullName: 'Dr. Johnson',
      email: 'johnson@baze.edu.ng',
      role: 'institutionSupervisor',
      department: 'Computer Science',
      phone: '+234 802 345 6789',
      status: 'active',
      createdAt: '2024-01-10',
      lastLogin: '2024-03-21 09:15',
      studentsAssigned: 12
    },
    {
      id: '3',
      fullName: 'Prof. Williams',
      email: 'williams@baze.edu.ng',
      role: 'siwesCoordinator',
      department: 'SIWES Office',
      phone: '+234 803 456 7890',
      status: 'active',
      createdAt: '2024-01-05',
      lastLogin: '2024-03-22 10:45'
    },
    {
      id: '4',
      fullName: 'Aisha Bello',
      email: 'aisha.bello@baze.edu.ng',
      role: 'student',
      department: 'Software Engineering',
      studentId: 'BU/23AJIT/8002',
      phone: '+234 804 567 8901',
      status: 'inactive',
      createdAt: '2024-01-20',
      lastLogin: '2024-03-15 16:20',
      logbooksSubmitted: 3
    },
    {
      id: '5',
      fullName: 'Mr. Smith',
      email: 'smith@techcorp.com',
      role: 'industrySupervisor',
      company: 'Tech Corp',
      phone: '+234 805 678 9012',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '2024-03-18 11:30'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let results = users;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department?.toLowerCase().includes(term) ||
        user.studentId?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      results = results.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(results);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    // Simulate API call
    const newUser = {
      id: String(users.length + 1),
      ...userForm,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    
    setUsers([...users, newUser]);
    setIsAddUserModalOpen(false);
    resetForm();
    alert('User added successfully!');
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    // Simulate API call
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userForm } : u));
    setIsEditUserModalOpen(false);
    resetForm();
    alert('User updated successfully!');
  };

  const handleDeleteUser = async () => {
    // Simulate API call
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
    alert('User deleted successfully!');
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUserForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      status: user.status
    });
    setIsEditUserModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setUserForm({
      fullName: '',
      email: '',
      role: 'student',
      department: '',
      phone: '',
      status: 'active'
    });
    setSelectedUser(null);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      student: { color: 'bg-blue-100 text-blue-800', label: 'Student' },
      institutionSupervisor: { color: 'bg-green-100 text-green-800', label: 'Supervisor' },
      industrySupervisor: { color: 'bg-purple-100 text-purple-800', label: 'Industry' },
      siwesCoordinator: { color: 'bg-orange-100 text-orange-800', label: 'Coordinator' },
      hod: { color: 'bg-red-100 text-red-800', label: 'HOD' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', label: role };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
        <FiUserCheck className="mr-1" />
        Active
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
        <FiUserX className="mr-1" />
        Inactive
      </span>
    );
  };

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'institutionSupervisor', label: 'Institution Supervisor' },
    { value: 'industrySupervisor', label: 'Industry Supervisor' },
    { value: 'siwesCoordinator', label: 'SIWES Coordinator' },
    { value: 'hod', label: 'Head of Department' }
  ];

  const departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Data Science',
    'Cybersecurity',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'SIWES Office',
    'Administration'
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all users in the SIWES system</p>
          </div>
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center"
          >
            <FiUserPlus className="mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FiUsers className="text-gray-700" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.role === 'student').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Supervisors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.filter(u => u.role.includes('Supervisor')).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="secondary" className="flex items-center">
                <FiFilter className="mr-2" />
                More Filters
              </Button>

              <Button variant="secondary" className="flex items-center">
                <FiDownload className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">User</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Department/Company</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Last Login</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-700">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.studentId && (
                            <div className="text-xs text-gray-400">{user.studentId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900">{user.department || user.company || '—'}</div>
                      {user.role === 'student' && user.logbooksSubmitted !== undefined && (
                        <div className="text-xs text-gray-500">
                          {user.logbooksSubmitted} logbooks submitted
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900">
                        {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleViewUser(user)}
                          className="flex items-center"
                        >
                          <FiEye className="mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleEditClick(user)}
                          className="flex items-center"
                        >
                          <FiEdit2 className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="small" disabled>
                Previous
              </Button>
              <Button variant="primary" size="small">
                1
              </Button>
              <Button variant="secondary" size="small">
                2
              </Button>
              <Button variant="secondary" size="small">
                3
              </Button>
              <Button variant="secondary" size="small">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => {
          setIsAddUserModalOpen(false);
          resetForm();
        }}
        title="Add New User"
        subtitle="Create a new user account"
        size="lg"
      >
        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                value={userForm.fullName}
                onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                value={userForm.role}
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                value={userForm.status}
                onChange={(e) => setUserForm({...userForm, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                value={userForm.department}
                onChange={(e) => setUserForm({...userForm, department: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddUserModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          resetForm();
        }}
        title="Edit User"
        subtitle={`Editing ${selectedUser?.fullName}`}
        size="lg"
      >
        {selectedUser && (
          <form onSubmit={handleEditUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  value={userForm.department}
                  onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update User
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete ${selectedUser?.fullName}?`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              This action cannot be undone. All data associated with this user will be permanently deleted.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
        subtitle="View complete user information"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-gray-700 text-xl">
                  {selectedUser.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.fullName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <div className="flex items-center mt-1">
                    <FiMail className="text-gray-400 mr-2" />
                    <span className="text-gray-900">{selectedUser.email}</span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="flex items-center mt-1">
                      <FiPhone className="text-gray-400 mr-2" />
                      <span className="text-gray-900">{selectedUser.phone}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Account Created</label>
                  <div className="flex items-center mt-1">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {selectedUser.role === 'student' ? 'Student ID' : 'Department/Company'}
                  </label>
                  <div className="mt-1">
                    <span className="text-gray-900">
                      {selectedUser.studentId || selectedUser.department || selectedUser.company || '—'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <div className="mt-1">
                    <span className="text-gray-900">
                      {selectedUser.lastLogin === 'Never' ? 'Never logged in' : new Date(selectedUser.lastLogin).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stats based on role */}
                {selectedUser.role === 'student' && selectedUser.logbooksSubmitted !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Logbooks Submitted</label>
                    <div className="mt-1">
                      <span className="text-gray-900 font-medium">{selectedUser.logbooksSubmitted} / 13</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gray-800 h-2 rounded-full" 
                          style={{ width: `${(selectedUser.logbooksSubmitted / 13) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'institutionSupervisor' && selectedUser.studentsAssigned !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Students Assigned</label>
                    <div className="mt-1">
                      <span className="text-gray-900 font-medium">{selectedUser.studentsAssigned} students</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditClick(selectedUser);
                }}
              >
                Edit User
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteClick(selectedUser);
                }}
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;