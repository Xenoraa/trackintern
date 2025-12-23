import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiKey, FiMail, FiCheckCircle } from 'react-icons/fi';

export default function VerifyCode() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Request code, 2: Enter code
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const requestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMessage('Verification code has been sent to your email.');
    setStep(2);
    setLoading(false);
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Email verified successfully!');
    navigate('/register');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-gray-900 p-3 rounded-lg">
              <FiCheckCircle className="text-white" size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Request Verification Code' : 'Enter Verification Code'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get your unique code to register for SIWES
          </p>
        </div>

        {step === 1 ? (
          <div className="bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
            <form onSubmit={requestCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  University Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="student@baze.edu.ng"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your university email to receive a verification code
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            <form onSubmit={verifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="text-gray-400" />
                  </div>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="XXXXXX"
                    maxLength="6"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Request a new code
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}