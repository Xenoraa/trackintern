// src/pages/Coordinator/Reports.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAPI, verificationAPI, gradingAPI } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.jsx';
import { 
  FiBarChart2, 
  FiDownload, 
  FiFileText, 
  FiUsers, 
  FiCalendar,
  FiPieChart,
  FiTrendingUp,
  FiPrinter
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('all');

  const { data: students } = useQuery({
    queryKey: ['allStudents'],
    queryFn: () => studentAPI.getAll(),
  });

  const { data: codes } = useQuery({
    queryKey: ['verificationCodes'],
    queryFn: () => verificationAPI.getAllCodes(),
  });

  const { data: defenses } = useQuery({
    queryKey: ['allDefenses'],
    queryFn: () => gradingAPI.getAllDefenses(),
  });

  const reportTypes = [
    { id: 'overview', icon: FiBarChart2, title: 'Overview', description: 'System overview and key metrics' },
    { id: 'students', icon: FiUsers, title: 'Student Report', description: 'Student registrations and progress' },
    { id: 'codes', icon: FiFileText, title: 'Code Usage', description: 'Verification code statistics' },
    { id: 'defenses', icon: FiCalendar, title: 'Defense Schedule', description: 'Defense schedules and results' },
    { id: 'performance', icon: FiTrendingUp, title: 'Performance', description: 'Student performance analysis' },
    { id: 'department', icon: FiPieChart, title: 'Department', description: 'Department-wise statistics' },
  ];

  const generateReport = (type) => {
    toast.success(`Generating ${type} report...`);
    // In a real app, this would trigger an API call or PDF generation
    setTimeout(() => {
      toast.success(`${type} report generated successfully!`);
    }, 1500);
  };

  const downloadReport = (format) => {
    toast.success(`Downloading report in ${format} format...`);
    // In a real app, this would trigger file download
  };

  // Statistics calculations
  const totalStudents = students?.data?.length || 0;
  const activeStudents = students?.data?.filter(s => s.status === 'ACTIVE').length || 0;
  const completedStudents = students?.data?.filter(s => s.status === 'COMPLETED').length || 0;
  
  const totalCodes = codes?.data?.length || 0;
  const usedCodes = codes?.data?.filter(c => c.isUsed).length || 0;
  const activeCodes = codes?.data?.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date()).length || 0;
  
  const totalDefenses = defenses?.data?.length || 0;
  const pendingDefenses = defenses?.data?.filter(d => d.verdict === 'PENDING').length || 0;
  const passedDefenses = defenses?.data?.filter(d => d.verdict === 'PASSED').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and download system reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className={`card cursor-pointer transition-all hover:shadow-md ${
              selectedReport === report.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <report.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  generateReport(report.title);
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Generate →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Report Display */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {reportTypes.find(r => r.id === selectedReport)?.title} Report
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadReport('PDF')}
                  className="btn-secondary inline-flex items-center"
                >
                  <FiPrinter className="mr-2 h-5 w-5" />
                  PDF
                </button>
                <button
                  onClick={() => downloadReport('Excel')}
                  className="btn-primary inline-flex items-center"
                >
                  <FiDownload className="mr-2 h-5 w-5" />
                  Excel
                </button>
              </div>
            </div>

            {selectedReport === 'overview' && (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active Codes</p>
                    <p className="text-2xl font-bold text-gray-900">{activeCodes}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pending Defenses</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingDefenses}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalDefenses > 0 ? Math.round((passedDefenses / totalDefenses) * 100) : 0}%
                    </p>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="text-center text-gray-500">
                    <FiBarChart2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm mt-1">Showing data for: {dateRange}</p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activities</h4>
                  <div className="space-y-3">
                    {students?.data?.slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 font-semibold">
                              {student.fullName?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.fullName}</p>
                            <p className="text-sm text-gray-600">Registered student</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(student.createdAt, 'MMM dd')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'students' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Defense Date
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students?.data?.slice(0, 10).map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              student.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.defenseDate ? formatDate(student.defenseDate) : 'Not scheduled'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.finalGrade || 'Not graded'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'codes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">Generated</p>
                    <p className="text-2xl font-bold text-green-900">{totalCodes}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">Used</p>
                    <p className="text-2xl font-bold text-blue-900">{usedCodes}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">Active</p>
                    <p className="text-2xl font-bold text-yellow-900">{activeCodes}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Generated
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {codes?.data?.slice(0, 10).map((code) => (
                        <tr key={code.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {code.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {formatDate(code.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {formatDate(code.expiresAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              code.isUsed ? 'bg-green-100 text-green-800' :
                              new Date(code.expiresAt) < new Date() ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {code.isUsed ? 'Used' : new Date(code.expiresAt) < new Date() ? 'Expired' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other report types would have similar content structures */}
            {(selectedReport === 'defenses' || selectedReport === 'performance' || selectedReport === 'department') && (
              <div className="text-center py-12 text-gray-500">
                <FiFileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>{reportTypes.find(r => r.id === selectedReport)?.title} report content</p>
                <p className="text-sm mt-1">Select "Generate" to create this report</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Student Registration Rate</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500"
                      style={{ width: `${(activeStudents / totalStudents) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round((activeStudents / totalStudents) * 100) || 0}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Code Usage Rate</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(usedCodes / totalCodes) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round((usedCodes / totalCodes) * 100) || 0}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Defense Completion</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${((passedDefenses + pendingDefenses) / totalDefenses) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(((passedDefenses + pendingDefenses) / totalDefenses) * 100) || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => downloadReport('PDF')}
                className="w-full btn-secondary inline-flex items-center justify-center"
              >
                <FiPrinter className="mr-2 h-5 w-5" />
                Export as PDF
              </button>
              <button
                onClick={() => downloadReport('Excel')}
                className="w-full btn-primary inline-flex items-center justify-center"
              >
                <FiDownload className="mr-2 h-5 w-5" />
                Export as Excel
              </button>
              <button
                onClick={() => downloadReport('CSV')}
                className="w-full btn-secondary inline-flex items-center justify-center"
              >
                <FiFileText className="mr-2 h-5 w-5" />
                Export as CSV
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Daily Report</span>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Weekly Summary</span>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Monthly Analytics</span>
                <span className="text-sm text-yellow-600 font-medium">Pending</span>
              </div>
              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                Configure Schedule →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;