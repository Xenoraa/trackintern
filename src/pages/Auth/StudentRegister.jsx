import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS } from '../../utils/constants.jsx';
import { FiMail, FiLock, FiUser, FiHash } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StudentRegister = () => {
    const { studentSignup, verifyEmail } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        verificationCode: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        department: 'Computer Science',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await verifyEmail(formData.email, formData.verificationCode);

        if (result.success) {
            setVerificationResult(result);
            setStep(2);
            toast.success('Verification successful! Complete your registration.');
        }

        setIsLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        const result = await studentSignup({
            fullName: formData.fullName,
            email: formData.email,
            verificationCode: formData.verificationCode,
            password: formData.password,
        });

        if (result.success) {
            navigate('/dashboard');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-primary-600 rounded-xl flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">IT</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Student Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Step {step} of 2: {step === 1 ? 'Verify your code' : 'Complete registration'}
                    </p>

                    {/* Progress steps */}
                    <div className="mt-4 flex items-center justify-center">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                2
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10">
                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleVerifyCode}>
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
                                        placeholder="student@university.edu.ng"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Use the email provided by your institution
                                </p>
                            </div>

                            <div>
                                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiHash className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="verificationCode"
                                        name="verificationCode"
                                        type="text"
                                        required
                                        value={formData.verificationCode}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Enter 8-digit code"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Get this code from your SIWES coordinator
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full flex justify-center py-3"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        'Verify & Continue'
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            {verificationResult && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">
                                                Verified for {formData.email}
                                            </p>
                                            <p className="mt-1 text-sm text-green-700">
                                                Department: {verificationResult.department}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="John Doe"
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

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Minimum 8 characters with letters and numbers
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary flex-1"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="text-center text-sm text-gray-600">
                    <p>Need help? Contact your SIWES coordinator</p>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;