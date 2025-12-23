import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants.jsx';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password, formData.role);

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
              Welcome to InternTrack
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your SIWES management account
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(ROLES).map(([key, value]) => (
                      <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: value })}
                          className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                              formData.role === value
                                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {ROLE_LABELS[value]}
                      </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                  />
                </div>
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
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
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
                      'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to InternTrack?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                    to="/student/register"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Register as Student
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>SIWES Management System © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
  );
};

export default Login;