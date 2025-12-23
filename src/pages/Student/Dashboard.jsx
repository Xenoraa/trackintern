import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { logbookAPI, gradingAPI } from '../../services/api.js';
import { calculateProgress, formatDate } from '../../utils/helpers.jsx';
import { LOGBOOK_STATUS, LOGBOOK_STATUS_COLORS, WEEKS } from '../../utils/constants.jsx';
import { FiBook, FiCheckCircle, FiClock, FiBarChart2 } from 'react-icons/fi';

const StudentDashboard = () => {
    const { user } = useAuth();

    const { data: logbooks, isLoading: logbooksLoading } = useQuery({
        queryKey: ['myLogbook'],
        queryFn: () => logbookAPI.getMyLogbook(),
    });

    const { data: defenseInfo, isLoading: defenseLoading } = useQuery({
        queryKey: ['myDefense'],
        queryFn: () => gradingAPI.getMyDefense(),
    });

    if (logbooksLoading || defenseLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const approvedLogs = logbooks?.data?.filter(log => log.status === 'APPROVED').length || 0;
    const pendingLogs = logbooks?.data?.filter(log => log.status === 'PENDING').length || 0;
    const needsReview = logbooks?.data?.filter(log => log.status === 'NEEDS_REVIEW').length || 0;
    const progress = calculateProgress(approvedLogs);

    // Get last submitted log
    const lastLog = logbooks?.data?.length > 0
        ? logbooks.data[logbooks.data.length - 1]
        : null;

    // Get weeks that haven't been submitted
    const submittedWeeks = new Set(logbooks?.data?.map(log => log.weekNumber) || []);
    const upcomingWeeks = WEEKS.filter(week => !submittedWeeks.has(week.value));

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.fullName?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Here's your SIWES progress overview
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-primary-100 rounded-lg">
                            <FiBook className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Weeks</p>
                            <p className="text-2xl font-bold text-gray-900">13</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiCheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">{approvedLogs}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiClock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingLogs}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiBarChart2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Progress</p>
                            <p className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="card">
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">SIWES Progress</h3>
                        <span className="text-sm font-medium text-primary-600">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Week 1</span>
                        <span>Week 13</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{approvedLogs}</div>
                        <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{pendingLogs}</div>
                        <div className="text-sm text-gray-600">Pending Review</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{needsReview}</div>
                        <div className="text-sm text-gray-600">Needs Revision</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{13 - approvedLogs - pendingLogs - needsReview}</div>
                        <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    {lastLog ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-medium">Week {lastLog.weekNumber}</span>
                                        <p className="text-sm text-gray-600 mt-1">{lastLog.activityDescription?.substring(0, 100)}...</p>
                                    </div>
                                    <span className={`badge ${LOGBOOK_STATUS_COLORS[lastLog.status]}`}>
                    {lastLog.status}
                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    Submitted on {formatDate(lastLog.dateSubmitted)}
                                </div>
                            </div>

                            <div className="text-center">
                                <a
                                    href="/src/pages/Student/Logbook"
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    View all logbooks →
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FiBook className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>No logbooks submitted yet</p>
                            <a
                                href="/logbook/submit"
                                className="btn-primary inline-block mt-4"
                            >
                                Submit Your First Log
                            </a>
                        </div>
                    )}
                </div>

                {/* Defense Information */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Defense Information</h3>
                    {defenseInfo?.data ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Defense Date</span>
                                    <span className="text-sm font-semibold text-blue-700">
                    {formatDate(defenseInfo.data.defenseDate)}
                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    Assessor: {defenseInfo.data.assessor}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status</span>
                                    <span className={`badge ${
                                        defenseInfo.data.verdict === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : defenseInfo.data.verdict === 'PASS'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                    {defenseInfo.data.verdict}
                  </span>
                                </div>
                            </div>

                            {defenseInfo.data.score > 0 && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-700">
                                            {defenseInfo.data.score}%
                                        </div>
                                        <div className="text-sm text-green-600">Final Score</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FiClock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p>Defense not scheduled yet</p>
                            <p className="text-sm mt-2">Complete more logbooks to be eligible</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Weeks */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Weeks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {upcomingWeeks.slice(0, 6).map((week) => (
                        <a
                            key={week.value}
                            href={`/logbook/submit?week=${week.value}`}
                            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                        >
                            <div className="text-lg font-bold text-gray-900">{week.value}</div>
                            <div className="text-sm text-gray-600">Week</div>
                        </a>
                    ))}
                </div>
                {upcomingWeeks.length > 6 && (
                    <div className="text-center mt-4">
                        <a
                            href="/src/pages/Student/Logbook"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            View all {upcomingWeeks.length} upcoming weeks →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;