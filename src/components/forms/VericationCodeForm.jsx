import { useState } from 'react';
import Button from '../ui/Button';
import { FiCopy, FiSend, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const VerificationCodeForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    purpose: 'student_registration',
    expiresIn: 24, // hours
    studentEmail: '',
    studentName: ''
  });

  const [generatedCodes, setGeneratedCodes] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateCodes = (e) => {
    e.preventDefault();
    
    // Generate mock codes
    const codes = Array.from({ length: formData.quantity }, (_, i) => {
      const code = `SIWES-${Date.now().toString().slice(-6)}-${String(i + 1).padStart(4, '0')}`;
      return {
        code,
        purpose: formData.purpose,
        expiresAt: new Date(Date.now() + formData.expiresIn * 60 * 60 * 1000).toISOString(),
        studentEmail: formData.studentEmail || null,
        studentName: formData.studentName || null,
        used: false
      };
    });

    setGeneratedCodes(codes);
    
    if (onSubmit) {
      onSubmit(codes);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleGenerateCodes} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Codes
            </label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5, 10].map(num => (
                <option key={num} value={num}>{num} code{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires In
            </label>
            <select
              name="expiresIn"
              value={formData.expiresIn}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>1 week</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="student_registration">Student Registration</option>
            <option value="supervisor_access">Supervisor Access</option>
            <option value="admin_access">Admin Access</option>
            <option value="emergency">Emergency Access</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                placeholder="student@baze.edu.ng"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Generate Verification Codes
        </Button>
      </form>

      {/* Generated Codes */}
      {generatedCodes.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Codes</h3>
          
          <div className="space-y-4">
            {generatedCodes.map((code, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-gray-900">{code.code}</div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Expires: {new Date(code.expiresAt).toLocaleString()}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${code.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {code.used ? 'Used' : 'Active'}
                      </span>
                    </div>
                    {code.studentName && (
                      <div className="mt-2 text-sm text-gray-700">
                        Assigned to: {code.studentName} ({code.studentEmail})
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => copyToClipboard(code.code)}
                      className="flex items-center"
                    >
                      <FiCopy className="mr-1" />
                      Copy
                    </Button>
                    {code.studentEmail && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => window.location.href = `mailto:${code.studentEmail}?subject=SIWES Verification Code&body=Your verification code is: ${code.code}`}
                        className="flex items-center"
                      >
                        <FiSend className="mr-1" />
                        Email
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="secondary">
              Download as CSV
            </Button>
            <Button onClick={() => setGeneratedCodes([])}>
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Codes are single-use and expire based on selected duration</li>
          <li>• Assign codes to specific students for better tracking</li>
          <li>• Keep codes secure and share only with intended recipients</li>
          <li>• Used codes cannot be regenerated</li>
        </ul>
      </div>
    </div>
  );
};

export default Verification