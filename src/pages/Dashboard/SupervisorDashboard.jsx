import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/card';
import { useState } from 'react';
import { FiCheckCircle, FiClock, FiMessageSquare, FiUser, FiSearch } from 'react-icons/fi';

export default function SupervisorDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  
  const students = [
    { id: 1, name: 'John Doe', week: 6, submitted: '2024-03-10', status: 'pending' },
    { id: 2, name: 'Aisha Bello', week: 5, submitted: '2024-03-03', status: 'approved' },
    { id: 3, name: 'Samuel Okoro', week: 6, submitted: '2024-03-10', status: 'pending' },
    { id: 4, name: 'Grace Johnson', week: 4, submitted: '2024-02-25', status: 'approved' },
  ];

  const stats = {
    totalStudents: 12,
    pendingReviews: 4,
    avgResponseTime: '2.3 days',
    completionRate: '78%'
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
        <p className="text-gray-600 mt-2">Review and approve student logbook submissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiUser className="text-gray-700" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Assigned Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiClock className="text-gray-700" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiCheckCircle className="text-gray-700" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiMessageSquare className="text-gray-700" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Submissions */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'pending'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pending ({stats.pendingReviews})
                </button>
                <button
                  onClick={() => setActiveTab('reviewed')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'reviewed'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Reviewed
                </button>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              {students
                .filter(student => student.status === activeTab || activeTab === 'pending')
                .map((student) => (
                  <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>Week {student.week}</span>
                          <span>•</span>
                          <span>Submitted {student.submitted}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
                          View Log
                        </button>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                          Add Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Feedback History */}
          <Card className="mt-8 bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback Given</h3>
            <div className="space-y-4">
              {[
                { student: 'John Doe', week: 5, feedback: 'Great improvement in documentation skills', date: '2024-03-08' },
                { student: 'Aisha Bello', week: 4, feedback: 'Need more technical details', date: '2024-03-01' },
                { student: 'Samuel Okoro', week: 3, feedback: 'Excellent project work', date: '2024-02-24' },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.student} - Week {item.week}</h4>
                      <p className="text-gray-600 mt-1">{item.feedback}</p>
                    </div>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="bg-white border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {[
                { title: 'Week 7 Logbook Review', date: 'Mar 15', status: 'high' },
                { title: 'Mid-Term Evaluation', date: 'Mar 22', status: 'medium' },
                { title: 'Progress Reports Due', date: 'Mar 29', status: 'low' },
              ].map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-sm text-gray-500">Due {deadline.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    deadline.status === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : deadline.status === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {deadline.status === 'high' ? 'High' : deadline.status === 'medium' ? 'Medium' : 'Low'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Send Bulk Feedback
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Generate Progress Report
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Export All Reviews
              </button>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Timely Feedback</span>
                  <span className="font-medium text-gray-900">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Student Satisfaction</span>
                  <span className="font-medium text-gray-900">88%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Log Completion</span>
                  <span className="font-medium text-gray-900">95%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}