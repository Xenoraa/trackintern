import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import ProgressChart from '../../components/charts/ProgressChart';
import Card from '../../components/ui/card';
import { FiCalendar, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';

export default function StudentDashboard() {
  const { user } = useAuth();
  const stats = {
    weeksCompleted: 6,
    totalWeeks: 13,
    pendingReviews: 2,
    supervisorRating: 4.5
  };

  const recentLogs = [
    { week: 6, status: 'Approved', date: '2024-03-10' },
    { week: 5, status: 'Pending', date: '2024-03-03' },
    { week: 4, status: 'Approved', date: '2024-02-25' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your SIWES progress and stay updated with supervisor feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Week Progress</p>
              <p className="text-2xl font-bold">
                {stats.weeksCompleted}/{stats.totalWeeks}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved Logs</p>
              <p className="text-2xl font-bold">{stats.weeksCompleted - stats.pendingReviews}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiFileText className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Supervisor Score</p>
              <p className="text-2xl font-bold">{stats.supervisorRating}/5.0</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <Card title="Weekly Progress Overview">
          <ProgressChart weeks={stats.totalWeeks} completed={stats.weeksCompleted} />
          <div className="mt-4 text-sm text-gray-600">
            <p>You're {Math.round((stats.weeksCompleted/stats.totalWeeks)*100)}% through your SIWES program</p>
          </div>
        </Card>

        {/* Recent Logs */}
        <Card title="Recent Logbook Submissions">
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.week} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Week {log.week}</h4>
                  <p className="text-sm text-gray-500">Submitted {log.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  log.status === 'Approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
          <a href="/dashboard/logbook" className="block mt-4 text-center text-indigo-600 hover:text-indigo-800">
            View All Logs →
          </a>
        </Card>

        {/* SIWES Letter Section */}
        <Card title="SIWES Application Letter" className="lg:col-span-2">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Your SIWES Placement Letter</h4>
                <p className="text-sm text-gray-600">Uploaded by SIWES Coordinator</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                View Letter
              </button>
            </div>
            <p className="text-sm text-gray-600">
              This letter confirms your placement for the SIWES program. 
              Download it for official purposes.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}