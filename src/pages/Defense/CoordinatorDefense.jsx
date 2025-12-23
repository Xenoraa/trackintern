import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/card';
import Button from '../../components/ui/Button';
import { useState } from 'react';
import { 
  FiCalendar, 
  FiUser, 
  FiCheckCircle, 
  FiClock, 
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
  FiFilter
} from 'react-icons/fi';

export default function CoordinatorDefense() {
  const [defenses, setDefenses] = useState([
    { id: 1, student: 'John Doe', studentId: 'BU/23A/IT/8001', date: '2024-03-15 10:00', venue: 'Room 301', 
      assessors: ['Dr. Johnson', 'Prof. Smith'], status: 'scheduled', score: null, remarks: '' },
    { id: 2, student: 'Aisha Bello', studentId: 'BU/23A/IT/8002', date: '2024-03-16 14:00', venue: 'Room 302', 
      assessors: ['Dr. Williams'], status: 'scheduled', score: null, remarks: '' },
    { id: 3, student: 'Samuel Okoro', studentId: 'BU/23A/IT/8003', date: '2024-03-17 11:00', venue: 'Virtual', 
      assessors: ['Dr. Chen', 'Prof. Adams'], status: 'completed', score: 4.5, remarks: 'Excellent presentation' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredDefenses = defenses.filter(def => 
    filter === 'all' ? true : def.status === filter
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Defense Management</h1>
            <p className="text-gray-600 mt-2">Schedule and manage SIWES defense sessions</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <FiPlus className="mr-2" />
            Schedule Defense
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Defenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{defenses.length}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiCalendar className="text-gray-700" />
            </div>
          </div>
        </card>

        <card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {defenses.filter(d => d.status === 'scheduled').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiClock className="text-blue-600" />
            </div>
          </div>
        </card>

        <card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {defenses.filter(d => d.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" />
            </div>
          </div>
        </card>

        <card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {defenses.filter(d => d.score).reduce((acc, d) => acc + d.score, 0) / 
                 defenses.filter(d => d.score).length || 0}/5.0
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiUser className="text-purple-600" />
            </div>
          </div>
        </card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'secondary'} 
                  size="small"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'scheduled' ? 'primary' : 'secondary'} 
                  size="small"
                  onClick={() => setFilter('scheduled')}
                >
                  Scheduled
                </Button>
                <Button 
                  variant={filter === 'completed' ? 'primary' : 'secondary'} 
                  size="small"
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="small">
                  <FiDownload className="mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="small">
                  <FiFilter />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Student</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date & Time</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Venue</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Score</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDefenses.map((defense) => (
                    <tr key={defense.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg mr-3">
                            <FiUser className="text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{defense.student}</div>
                            <div className="text-sm text-gray-500">{defense.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{defense.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">{defense.venue}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          defense.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {defense.status === 'completed' ? (
                            <>
                              <FiCheckCircle className="mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <FiClock className="mr-1" />
                              Scheduled
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {defense.score ? (
                          <div className="font-medium text-gray-900">{defense.score}/5.0</div>
                        ) : (
                          <div className="text-gray-400">—</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="small">
                            <FiEye />
                          </Button>
                          <Button variant="ghost" size="small">
                            <FiEdit2 />
                          </Button>
                          <Button variant="ghost" size="small" className="text-red-600 hover:text-red-700">
                            <FiTrash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <card>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                Assign Assessors
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                Send Notifications
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                Generate Reports
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                View Calendar
              </Button>
            </div>
          </card>

          {/* Upcoming Defenses */}
          <card>
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Defenses</h3>
            <div className="space-y-3">
              {defenses
                .filter(d => d.status === 'scheduled')
                .slice(0, 3)
                .map((defense) => (
                  <div key={defense.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{defense.student}</p>
                        <p className="text-sm text-gray-600">{defense.date}</p>
                      </div>
                      <span className="text-sm text-gray-500">{defense.venue}</span>
                    </div>
                  </div>
                ))}
            </div>
          </card>
        </div>
      </div>
    </DashboardLayout>
  );
}