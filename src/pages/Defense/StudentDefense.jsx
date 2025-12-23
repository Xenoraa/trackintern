import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/card';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';

export default function StudentDefense() {
  const defenseInfo = {
    scheduled: true,
    date: '2024-03-15 10:00 AM',
    venue: 'Room 301, Computer Science Building',
    assessors: ['Dr. Johnson (Supervisor)', 'Prof. Smith (External)'],
    status: 'upcoming',
    requirements: [
      'Final SIWES Report',
      'Logbook Summary',
      'Presentation Slides',
      'Company Evaluation Form'
    ],
    previousDefenses: [
      { id: 1, semester: '2023/2024', score: 4.5, remarks: 'Excellent performance' }
    ]
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Defense</h1>
          <p className="text-gray-600 mt-2">
            View your defense schedule, requirements, and results
          </p>
        </div>

        {/* Defense Schedule Card */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Defense Schedule</h3>
            {defenseInfo.scheduled && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <FiCalendar className="mr-1" />
                Scheduled
              </span>
            )}
          </div>

          {defenseInfo.scheduled ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Date & Time</h4>
                  <div className="flex items-center text-gray-900">
                    <FiCalendar className="mr-2" />
                    {defenseInfo.date}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Venue</h4>
                  <p className="text-gray-900">{defenseInfo.venue}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Assessors</h4>
                <ul className="space-y-2">
                  {defenseInfo.assessors.map((assessor, idx) => (
                    <li key={idx} className="flex items-center text-gray-900">
                      <FiUser className="mr-2 text-gray-400" />
                      {assessor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiClock className="mx-auto text-gray-400 mb-4" size={48} />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Defense Not Scheduled</h4>
              <p className="text-gray-600">
                Your defense schedule will be announced by your SIWES coordinator.
              </p>
            </div>
          )}
        </Card>

        {/* Requirements Card */}
        <Card className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Defense Requirements</h3>
          <div className="space-y-4">
            {defenseInfo.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-900">{req}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 font-medium">Submitted</span>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    <FiDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Previous Results */}
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Previous Defense Results</h3>
          {defenseInfo.previousDefenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Semester</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Score</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Remarks</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defenseInfo.previousDefenses.map((defense) => (
                    <tr key={defense.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-900">{defense.semester}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{defense.score}/5.0</span>
                          <div className="ml-2 text-yellow-400">★★★★☆</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600">{defense.remarks}</p>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-gray-600 hover:text-gray-900">
                          <FiDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No previous defense results available.</p>
            </div>
          )}
        </Card>

        {/* Tips & Guidelines */}
        <Card className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Defense Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Preparation Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mr-2 mt-0.5" />
                  <span>Practice your presentation multiple times</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mr-2 mt-0.5" />
                  <span>Prepare for possible questions from assessors</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mr-2 mt-0.5" />
                  <span>Arrive 15 minutes before your scheduled time</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <FiAlertCircle className="text-yellow-500 mr-2 mt-0.5" />
                  <span>Bring printed copies of your final report</span>
                </li>
                <li className="flex items-start">
                  <FiAlertCircle className="text-yellow-500 mr-2 mt-0.5" />
                  <span>Have your logbook available for reference</span>
                </li>
                <li className="flex items-start">
                  <FiAlertCircle className="text-yellow-500 mr-2 mt-0.5" />
                  <span>Company evaluation forms must be submitted</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}