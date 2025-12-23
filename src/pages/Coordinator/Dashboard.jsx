import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { studentAPI, verificationAPI, gradingAPI } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.jsx';
import { FiUsers, FiKey, FiCalendar, FiAward } from 'react-icons/fi';

const CoordinatorDashboard = () => {
    const { user } = useAuth();

    const { data: students, isLoading: studentsLoading } = useQuery({
        queryKey: ['allStudents'],
        queryFn: () => studentAPI.getAll(),
    });

    const { data: verificationCodes, isLoading: codesLoading } = useQuery({
        queryKey: ['verificationCodes'],
        queryFn: () => verificationAPI.getAllCodes(),
    });

    const { data: defenses, isLoading: defensesLoading } = useQuery({
        queryKey: ['allDefenses'],
        queryFn: () => gradingAPI.getAllDefenses(),
    });

    if (studentsLoading || codesLoading || defensesLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const totalStudents = students?.data?.length || 0;
    const totalCodes = verificationCodes?.data?.length || 0;
    const unusedCodes = verificationCodes?.data?.filter(code => !code.isUsed).length || 0;
    const scheduledDefenses = defenses?.data?.filter(d => d.defenseDate).length || 0;
    const completedDefenses = defenses?.data?.filter(d => d.verdict !== 'PENDING').length || 0;

    // Recent activities
    const recentStudents = students?.data?.slice(0, 5) || [];
    const recentCodes = verificationCodes?.data?.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Coordinator Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                    Welcome, {user?.fullName?.split(' ')[0]}! Manage the SIWES program
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
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiKey className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Verification Codes</p>
                            <p className="text-2xl font-bold text-gray-900">{totalCodes}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiCalendar className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Scheduled Defenses</p>
                            <p className="text-2xl font-bold text-gray-900">{scheduledDefenses}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiAward className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Graded Defenses</p>
                            <p className="text-2xl font-bold text-gray-900">{completedDefenses}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Student Registrations</h3>
                        <a
                            href="/students"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            View all →
                        </a>
                    </div>

                    {recentStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiUsers className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No students registered yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {student.fullName?.substring(0, 2).toUpperCase()}
                      </span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{student.fullName}</h4>
                                            <p className="text-sm text-gray-600">{student.department}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                    {formatDate(student.createdAt, 'MMM dd')}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Verification Codes */}
                <div className="card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Verification Codes</h3>
                        <a
                            href="/verification"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            Generate →
                        </a>
                    </div>

                    {recentCodes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FiKey className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No verification codes generated</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentCodes.slice(0, 5).map((code) => (
                                <div key={code.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div className="font-mono font-medium text-gray-900">{code.code}</div>
                                        <p className="text-sm text-gray-600">{code.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        code.isUsed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                    {code.isUsed ? 'Used' : 'Active'}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/verification"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiKey className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Generate Codes</span>
                    </a>
                    <a
                        href="/defense/schedule"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiCalendar className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Schedule Defense</span>
                    </a>
                    <a
                        href="/grading"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiAward className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">Submit Grades</span>
                    </a>
                    <a
                        href="/reports"
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                        <FiUsers className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                        <span className="font-medium text-gray-900">View Reports</span>
                    </a>
                </div>
            </div>

            {/* System Status */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Verification Codes</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{unusedCodes} unused</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${(unusedCodes / totalCodes) * 100 || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Student Registrations</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{totalStudents} total</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${Math.min((totalStudents / 100) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Defense Completion</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{completedDefenses} graded</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500"
                                    style={{ width: `${(completedDefenses / scheduledDefenses) * 100 || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorDashboard;