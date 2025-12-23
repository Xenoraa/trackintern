import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { assignmentAPI, logbookAPI } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.jsx';
import { LOGBOOK_STATUS, LOGBOOK_STATUS_COLORS } from '../../utils/constants.jsx';
import { FiUsers, FiBook, FiCheckCircle, FiClock } from 'react-icons/fi';

const SupervisorDashboard = () => {
    const { user } = useAuth();

    const { data: assignedStudents, isLoading: studentsLoading } = useQuery({
        queryKey: ['supervisorStudents'],
        queryFn: () => assignmentAPI.getSupervisorStudents(),
    });

    const { data: logbooks, isLoading: logbooksLoading } = useQuery({
        queryKey: ['supervisorLogbooks'],
        queryFn: () => logbookAPI.getSupervisorLogbooks(),
    });

    if (studentsLoading || logbooksLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const pendingReviews = logbooks?.data?.filter(log => log.status === 'PENDING').length || 0;
    const totalStudents = assignedStudents?.data?.length || 0;
    const totalLogs = logbooks?.data?.length || 0;
    const approvedLogs = logbooks?.data?.filter(log => log.status === 'APPROVED').length || 0;

    // Get recent pending logs
    const recentPendingLogs = logbooks?.data
        ?.filter(log => log.status === 'PENDING')
        ?.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {user?.fullName?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Institution Supervisor Dashboard
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-primary-100 rounded-lg">
                            <FiUsers className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Assigned Students</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiBook className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Logs</p>
                            <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiClock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiCheckCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">{approvedLogs}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Students */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Students</h3>
                    {totalStudents === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiUsers className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No students assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assignedStudents?.data?.slice(0, 5).map((assignment) => (
                                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{assignment.Student?.fullName}</h4>
                                        <p className="text-sm text-gray-600">{assignment.Student?.department}</p>
                                    </div>
                                    <a
                                        href={`/students/${assignment.studentId}`}
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        View →
                                    </a>
                                </div>
                            ))}
                            {totalStudents > 5 && (
                                <div className="text-center">
                                    <a
                                        href="/students"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        View all {totalStudents} students →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pending Reviews */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
                        <span className="badge badge-warning">{pendingReviews}</span>
                    </div>

                    {pendingReviews === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiCheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No pending reviews</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentPendingLogs.map((log) => (
                                <div key={log.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{log.Student?.fullName}</h4>
                                            <p className="text-sm text-gray-600">Week {log.weekNumber}</p>
                                        </div>
                                        <span className={`badge ${LOGBOOK_STATUS_COLORS[log.status]}`}>
                      {log.status}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-3 truncate">
                                        {log.activityDescription?.substring(0, 100)}...
                                    </p>
                                    <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {formatDate(log.dateSubmitted)}
                    </span>
                                        <a
                                            href={`/logbooks/review/${log.id}`}
                                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            Review →
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {pendingReviews > 5 && (
                                <div className="text-center">
                                    <a
                                        href="/logbooks"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        View all {pendingReviews} pending reviews →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/logbooks"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiBook className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Review Logbooks</span>
                    </a>
                    <a
                        href="/students"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiUsers className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">View Students</span>
                    </a>
                    <a
                        href="/reports"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiBook className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Generate Reports</span>
                    </a>
                    <a
                        href="/profile"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiUsers className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">My Profile</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;