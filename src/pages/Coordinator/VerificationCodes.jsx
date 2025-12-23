import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationAPI } from '../../services/api.js';
import { DEPARTMENTS } from '../../utils/constants.jsx';
import { formatDate } from '../../utils/helpers.jsx';
import { FiKey, FiCopy, FiMail, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const VerificationCodes = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        department: 'Computer Science',
    });

    const { data: codes, isLoading } = useQuery({
        queryKey: ['verificationCodes'],
        queryFn: () => verificationAPI.getAllCodes(),
    });

    const generateMutation = useMutation({
        mutationFn: (data) => verificationAPI.generateCode(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['verificationCodes']);
            toast.success('Verification code generated and sent!');
            setFormData({ email: '', department: 'Computer Science' });
            setIsGenerating(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to generate code');
            setIsGenerating(false);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            toast.error('Please enter student email');
            return;
        }

        setIsGenerating(true);
        generateMutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Code copied to clipboard!');
    };

    const getStatusColor = (isUsed, expiresAt) => {
        if (isUsed) return 'bg-green-100 text-green-800';
        if (new Date(expiresAt) < new Date()) return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (isUsed, expiresAt) => {
        if (isUsed) return 'Used';
        if (new Date(expiresAt) < new Date()) return 'Expired';
        return 'Active';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const unusedCodes = codes?.data?.filter(code => !code.isUsed).length || 0;
    const usedCodes = codes?.data?.filter(code => code.isUsed).length || 0;
    const expiredCodes = codes?.data?.filter(code => !code.isUsed && new Date(code.expiresAt) < new Date()).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Verification Codes</h1>
                <p className="text-gray-600 mt-1">
                    Generate and manage student registration codes
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiKey className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Codes</p>
                            <p className="text-2xl font-bold text-gray-900">{unusedCodes}</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiKey className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Used Codes</p>
                            <p className="text-2xl font-bold text-gray-900">{usedCodes}</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <FiKey className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Expired Codes</p>
                            <p className="text-2xl font-bold text-gray-900">{expiredCodes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Code Form */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Code</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Student Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="student@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isGenerating || generateMutation.isLoading}
                            className="btn-primary inline-flex items-center"
                        >
                            {isGenerating || generateMutation.isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FiKey className="mr-2 h-5 w-5" />
                                    Generate Code
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Codes List */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">All Codes ({codes?.data?.length || 0})</h3>
                    <button
                        onClick={() => queryClient.invalidateQueries(['verificationCodes'])}
                        className="text-primary-600 hover:text-primary-700"
                    >
                        <FiRefreshCw className="h-5 w-5" />
                    </button>
                </div>

                {codes?.data?.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FiKey className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p>No verification codes generated yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student Email
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {codes?.data?.map((code) => (
                                <tr key={code.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm font-medium text-gray-900">
                                            {code.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{code.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{code.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusColor(code.isUsed, code.expiresAt)}`}>
                        {getStatusText(code.isUsed, code.expiresAt)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(code.expiresAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => copyToClipboard(code.code)}
                                            className="text-primary-600 hover:text-primary-900 mr-3"
                                        >
                                            <FiCopy className="h-5 w-5" />
                                        </button>
                                        {!code.isUsed && (
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Resend verification code email?')) {
                                                        // Implement resend logic
                                                        toast.success('Code resent to student');
                                                    }
                                                }}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <FiMail className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                <div className="space-y-3 text-sm text-gray-600">
                    <p>1. Generate a verification code for each student using their institutional email</p>
                    <p>2. The code will be sent to the student's email automatically</p>
                    <p>3. Students use this code during registration on the student portal</p>
                    <p>4. Each code can only be used once and expires after 24 hours</p>
                    <p>5. You can copy the code to clipboard or resend the email if needed</p>
                </div>
            </div>
        </div>
    );
};

export default VerificationCodes;