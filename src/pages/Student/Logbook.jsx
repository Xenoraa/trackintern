import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logbookAPI } from '../../services/api.js';
import { formatDate, truncateText } from '../../utils/helpers.jsx';
import { LOGBOOK_STATUS, LOGBOOK_STATUS_COLORS, WEEKS } from '../../utils/constants.jsx';
import { FiPlus, FiEdit, FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Logbook = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: logbooks, isLoading } = useQuery({
        queryKey: ['myLogbook'],
        queryFn: () => logbookAPI.getMyLogbook(),
    });

    const deleteMutation = useMutation({
        mutationFn: (logbookId) => logbookAPI.delete(logbookId),
        onSuccess: () => {
            queryClient.invalidateQueries(['myLogbook']);
            toast.success('Logbook entry deleted');
            setIsModalOpen(false);
            setSelectedLog(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete logbook');
        },
    });

    const handleDelete = (logbookId) => {
        if (window.confirm('Are you sure you want to delete this logbook entry?')) {
            deleteMutation.mutate(logbookId);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <FiCheckCircle className="h-5 w-5 text-green-500" />;
            case 'PENDING':
                return <FiClock className="h-5 w-5 text-yellow-500" />;
            case 'NEEDS_REVIEW':
                return <FiXCircle className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const submittedWeeks = new Set(logbooks?.data?.map(log => log.weekNumber) || []);
    const availableWeeks = WEEKS.filter(week => !submittedWeeks.has(week.value));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Logbook</h1>
                    <p className="text-gray-600 mt-1">
                        Track your weekly SIWES activities (Week 1-13)
                    </p>
                </div>
                <div className="flex space-x-3">
                    <a
                        href="/logbook/submit"
                        className="btn-primary inline-flex items-center"
                    >
                        <FiPlus className="mr-2 h-5 w-5" />
                        Submit New Log
                    </a>
                </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiCheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {logbooks?.data?.filter(log => log.status === 'APPROVED').length || 0}
                            </p>
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
                            <p className="text-2xl font-bold text-gray-900">
                                {logbooks?.data?.filter(log => log.status === 'PENDING').length || 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {logbooks?.data?.length || 0}/13
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Submitted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {logbooks?.data?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available weeks for submission */}
            {availableWeeks.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available for Submission</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableWeeks.map((week) => (
                            <a
                                key={week.value}
                                href={`/logbook/submit?week=${week.value}`}
                                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-center group"
                            >
                                <div className="text-lg font-bold text-gray-900 group-hover:text-primary-700">
                                    {week.value}
                                </div>
                                <div className="text-sm text-gray-600 group-hover:text-primary-600">
                                    Week {week.value}
                                </div>
                                <div className="mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    Available
                  </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Logbook entries table */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Logs</h3>

                {logbooks?.data?.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiBook className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="text-xl font-medium text-gray-900 mb-2">No logbooks submitted yet</h4>
                        <p className="text-gray-600 mb-6">
                            Start your SIWES journey by submitting your first weekly log
                        </p>
                        <a
                            href="/logbook/submit"
                            className="btn-primary inline-flex items-center"
                        >
                            <FiPlus className="mr-2 h-5 w-5" />
                            Submit Your First Log
                        </a>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Week
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {logbooks?.data?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-primary-700">
                            {log.weekNumber}
                          </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            Week {log.weekNumber} Activities
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {truncateText(log.activityDescription, 80)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(log.status)}
                                            <span className={`ml-2 badge ${LOGBOOK_STATUS_COLORS[log.status]}`}>
                          {log.status}
                        </span>
                                        </div>
                                        {log.supervisorComment && log.status === 'NEEDS_REVIEW' && (
                                            <div className="text-xs text-red-600 mt-1">
                                                Feedback provided
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(log.dateSubmitted)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedLog(log);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-primary-600 hover:text-primary-900"
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </button>
                                            {log.status === 'NEEDS_REVIEW' && (
                                                <a
                                                    href={`/logbook/edit/${log.id}`}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    <FiEdit className="h-5 w-5" />
                                                </a>
                                            )}
                                            {log.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={deleteMutation.isLoading}
                                                >
                                                    {deleteMutation.isLoading ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                                    ) : (
                                                        'Delete'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Logbook Detail Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Week {selectedLog.weekNumber} Logbook
                                            </h3>
                                            <span className={`badge ${LOGBOOK_STATUS_COLORS[selectedLog.status]}`}>
                        {selectedLog.status}
                      </span>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Activity Description</h4>
                                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-700 whitespace-pre-line">
                                                        {selectedLog.activityDescription}
                                                    </p>
                                                </div>
                                            </div>

                                            {selectedLog.images?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Images</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {selectedLog.images.map((image, index) => (
                                                            <div key={index} className="border rounded-lg overflow-hidden">
                                                                <img
                                                                    src={image}
                                                                    alt={`Week ${selectedLog.weekNumber} - Image ${index + 1}`}
                                                                    className="w-full h-32 object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedLog.supervisorComment && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Supervisor Feedback</h4>
                                                    <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-yellow-800 whitespace-pre-line">
                                                            {selectedLog.supervisorComment}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Submitted:</span>
                                                    <span className="ml-2 font-medium">{formatDate(selectedLog.dateSubmitted)}</span>
                                                </div>
                                                {selectedLog.signedAt && (
                                                    <div>
                                                        <span className="text-gray-500">Approved:</span>
                                                        <span className="ml-2 font-medium">{formatDate(selectedLog.signedAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary w-full sm:ml-3 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logbook;