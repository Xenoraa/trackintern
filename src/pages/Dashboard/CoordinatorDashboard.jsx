import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { useState } from 'react';
import { FiCopy, FiDownload, FiSend, FiUserPlus, FiUpload } from 'react-icons/fi';

export default function CoordinatorDashboard() {
  const [verificationCodes, setVerificationCodes] = useState([
    { code: 'SIWES2024-001', student: 'John Doe', email: 'john@email.com', used: true },
    { code: 'SIWES2024-002', student: 'Aisha Bello', email: 'aisha@email.com', used: true },
    { code: 'SIWES2024-003', student: null, email: null, used: false },
    { code: 'SIWES2024-004', student: null, email: null, used: false },
  ]);

  const generateNewCode = () => {
    const newCode = `SIWES2024-${String(verificationCodes.length + 1).padStart(3, '0')}`;
    setVerificationCodes([...verificationCodes, { 
      code: newCode, 
      student: null, 
      email: null, 
      used: false 
    }]);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">SIWES Coordinator Panel</h1>
        <p className="text-gray-600">Manage verification codes, upload letters, and oversee placements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Total Students" value="245" />
        <Card title="Pending Letters" value="18" />
        <Card title="Active Placements" value="127" />
      </div>

      {/* Verification Codes Section */}
      <Card title="Verification Codes Management" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Generated Codes</h3>
          <button 
            onClick={generateNewCode}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiUserPlus className="mr-2" />
            Generate New Code
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">Verification Code</th>
                <th className="py-3 px-4 text-left">Student</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verificationCodes.map((code) => (
                <tr key={code.code} className="border-b">
                  <td className="py-3 px-4 font-mono">{code.code}</td>
                  <td className="py-3 px-4">{code.student || '—'}</td>
                  <td className="py-3 px-4">{code.email || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      code.used 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {code.used ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700">
                        <FiCopy />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700">
                        <FiSend />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Letters Section */}
      <Card title="Upload SIWES Application Letters">
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <FiUpload className="mx-auto text-gray-400 mb-4" size={48} />
          <h4 className="font-semibold mb-2">Upload Student Placement Letters</h4>
          <p className="text-gray-600 mb-4">
            Upload scanned copies of SIWES application letters. 
            They will be automatically assigned to the correct student.
          </p>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept=".pdf,.jpg,.png"
            multiple
          />
          <button className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Upload Selected Files
          </button>
        </div>
      </Card>
    </DashboardLayout>
  );
}