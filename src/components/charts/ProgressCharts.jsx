import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart, 
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ProgressCharts = ({ 
  type = 'student', 
  userId = null,
  timeRange = 'month',
  onTimeRangeChange
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [activeChart, setActiveChart] = useState('progress');

  // Mock data generator based on user type
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = generateMockData(type, timeRange);
      setChartData(mockData);
      setLoading(false);
    };

    fetchChartData();
  }, [type, timeRange, userId]);

  const generateMockData = (userType, range) => {
    const baseData = {
      student: {
        progress: Array.from({ length: 13 }, (_, i) => ({
          week: i + 1,
          submitted: Math.random() > 0.2,
          approved: Math.random() > 0.7,
          hours: 35 + Math.floor(Math.random() * 10),
          score: Math.random() > 0.3 ? 3 + Math.random() * 2 : null
        })),
        weeklyHours: Array.from({ length: 13 }, (_, i) => ({
          week: i + 1,
          hours: 30 + Math.floor(Math.random() * 15)
        })),
        supervisorScores: [
          { name: 'Technical Skills', score: 4.2 },
          { name: 'Professionalism', score: 4.5 },
          { name: 'Initiative', score: 3.8 },
          { name: 'Communication', score: 4.0 },
          { name: 'Teamwork', score: 4.3 }
        ],
        submissionTimeline: Array.from({ length: 30 }, (_, i) => ({
          date: `Mar ${i + 1}`,
          submissions: Math.floor(Math.random() * 5)
        }))
      },
      supervisor: {
        studentProgress: Array.from({ length: 12 }, (_, i) => ({
          student: `Student ${i + 1}`,
          progress: Math.floor(Math.random() * 100),
          submissions: Math.floor(Math.random() * 13),
          avgScore: 3 + Math.random() * 2
        })),
        reviewTimeline: Array.from({ length: 30 }, (_, i) => ({
          date: `Mar ${i + 1}`,
          reviews: Math.floor(Math.random() * 8),
          pending: Math.floor(Math.random() * 4)
        })),
        performanceMetrics: [
          { metric: 'Response Time', value: 85, target: 90 },
          { metric: 'Feedback Quality', value: 88, target: 85 },
          { metric: 'Approval Rate', value: 92, target: 85 },
          { metric: 'Student Satisfaction', value: 90, target: 80 }
        ]
      },
      coordinator: {
        departmentStats: [
          { department: 'Computer Science', students: 45, progress: 78, avgScore: 4.2 },
          { department: 'Software Eng.', students: 32, progress: 82, avgScore: 4.1 },
          { department: 'Data Science', students: 28, progress: 75, avgScore: 4.0 },
          { department: 'Cybersecurity', students: 24, progress: 68, avgScore: 3.9 },
          { department: 'IT', students: 36, progress: 71, avgScore: 3.8 }
        ],
        weeklySubmissions: Array.from({ length: 13 }, (_, i) => ({
          week: i + 1,
          submissions: 50 + Math.floor(Math.random() * 50),
          approvals: 40 + Math.floor(Math.random() * 40)
        })),
        systemMetrics: {
          totalUsers: 245,
          activeUsers: 189,
          avgResponseTime: '1.8 days',
          completionRate: 78
        }
      }
    };

    return baseData[userType] || baseData.student;
  };

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  const renderStudentCharts = () => {
    if (!chartData) return null;

    return (
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Submission Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weeks Completed</span>
                <span className="font-bold text-gray-900">
                  {chartData.progress.filter(p => p.submitted).length}/13
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-800" 
                  style={{ 
                    width: `${(chartData.progress.filter(p => p.submitted).length / 13) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Week 1</span>
                <span className="text-gray-500">Week 13</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Approval Rate</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Submissions</span>
                <span className="font-bold text-gray-900">
                  {chartData.progress.filter(p => p.approved).length}/{chartData.progress.filter(p => p.submitted).length || 1}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600" 
                  style={{ 
                    width: `${(chartData.progress.filter(p => p.approved).length / 
                    (chartData.progress.filter(p => p.submitted).length || 1)) * 100}%` 
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((chartData.progress.filter(p => p.approved).length / 
                (chartData.progress.filter(p => p.submitted).length || 1)) * 100)}% success rate
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Average Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Average</span>
                <span className="font-bold text-gray-900">
                  {Math.round(chartData.weeklyHours.reduce((sum, w) => sum + w.hours, 0) / chartData.weeklyHours.length)}h
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600" 
                  style={{ 
                    width: `${Math.min(100, 
                      (chartData.weeklyHours.reduce((sum, w) => sum + w.hours, 0) / chartData.weeklyHours.length) / 40 * 100
                    )}%` 
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">
                Target: 40h/week • {(chartData.weeklyHours.reduce((sum, w) => sum + w.hours, 0) / chartData.weeklyHours.length) >= 40 ? '✓ On track' : '⚠ Below target'}
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Hours Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Weekly Hours Worked</h3>
              <Button variant="ghost" size="small">
                <FiDownload />
              </Button>
            </div>
            <div className="space-y-4">
              {chartData.weeklyHours.slice(-8).map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Week {week.week}</span>
                    <span className="font-medium text-gray-900">{week.hours}h</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full" 
                      style={{ width: `${Math.min(100, (week.hours / 60) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Supervisor Scores Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Supervisor Evaluation</h3>
              <Button variant="ghost" size="small">
                <FiDownload />
              </Button>
            </div>
            <div className="space-y-4">
              {chartData.supervisorScores.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.score.toFixed(1)}/5.0</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full" 
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Submission Timeline */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Submission Timeline</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="small">
                <FiFilter />
              </Button>
              <Button variant="ghost" size="small">
                <FiDownload />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {chartData.submissionTimeline.slice(-14).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                  <div className="relative h-32 w-8">
                    <div 
                      className="absolute bottom-0 w-full bg-gray-800 rounded-t" 
                      style={{ height: `${(day.submissions / 5) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium mt-2">{day.submissions}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Daily logbook submission count
          </div>
        </Card>
      </div>
    );
  };

  const renderSupervisorCharts = () => {
    if (!chartData) return null;

    return (
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartData.performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <h3 className="font-semibold text-gray-900 mb-2">{metric.metric}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}%</span>
                  <span className={`text-sm ${metric.value >= metric.target ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.value >= metric.target ? '✓' : '⚠'} {metric.target}% target
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metric.value >= metric.target ? 'bg-green-600' : 'bg-yellow-600'}`}
                    style={{ width: `${Math.min(100, metric.value)}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Student Progress */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Student Progress Overview</h3>
            <Button variant="ghost" size="small">
              <FiDownload />
            </Button>
          </div>
          <div className="space-y-4">
            {chartData.studentProgress.slice(0, 6).map((student, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{student.student}</span>
                    <span className="text-gray-500">{student.submissions}/13 logs</span>
                  </div>
                  <span className="font-bold text-gray-900">{student.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${student.progress >= 80 ? 'bg-green-600' : student.progress >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg. Score: {student.avgScore.toFixed(1)}/5.0</span>
                  <span>Last updated: Today</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Review Timeline */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Review Activity</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="small">
                <FiFilter />
              </Button>
              <Button variant="ghost" size="small">
                <FiDownload />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Reviews Completed</h4>
              <div className="space-y-3">
                {chartData.reviewTimeline.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">{day.reviews} reviews</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600" 
                          style={{ width: `${Math.min(100, (day.reviews / 10) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Pending Reviews</h4>
              <div className="space-y-3">
                {chartData.reviewTimeline.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">{day.pending} pending</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600" 
                          style={{ width: `${Math.min(100, (day.pending / 5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderCoordinatorCharts = () => {
    if (!chartData) return null;

    return (
      <div className="space-y-6">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{chartData.systemMetrics.totalUsers}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <FiTrendingUp className="text-gray-700" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{chartData.systemMetrics.activeUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBarChart2 className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Response Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{chartData.systemMetrics.avgResponseTime}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCalendar className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{chartData.systemMetrics.completionRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPieChart className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Department Statistics */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Department Performance</h3>
            <Button variant="ghost" size="small">
              <FiDownload />
            </Button>
          </div>
          <div className="space-y-4">
            {chartData.departmentStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900 w-48">{dept.department}</span>
                    <span className="text-gray-500">{dept.students} students</span>
                    <span className="text-gray-500">Avg: {dept.avgScore.toFixed(1)}/5.0</span>
                  </div>
                  <span className="font-bold text-gray-900">{dept.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      dept.progress >= 80 ? 'bg-green-600' : 
                      dept.progress >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${dept.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Submissions Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Submissions Overview</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="small">
                <FiFilter />
              </Button>
              <Button variant="ghost" size="small">
                <FiDownload />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Submissions vs Approvals</h4>
              <div className="space-y-4">
                {chartData.weeklySubmissions.slice(-6).map((week, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Week {week.week}</span>
                      <div className="flex space-x-4">
                        <span className="text-blue-600">{week.submissions} submitted</span>
                        <span className="text-green-600">{week.approvals} approved</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: `${Math.min(100, (week.submissions / 100) * 100)}%` }}
                      />
                      <div 
                        className="h-full bg-green-600" 
                        style={{ width: `${Math.min(100, (week.approvals / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Approval Rate Trend</h4>
              <div className="space-y-4">
                {chartData.weeklySubmissions.slice(-6).map((week, index) => {
                  const approvalRate = Math.round((week.approvals / week.submissions) * 100) || 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Week {week.week}</span>
                        <span className="font-medium text-gray-900">{approvalRate}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            approvalRate >= 80 ? 'bg-green-600' : 
                            approvalRate >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${approvalRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-6">System Health Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">Server Uptime</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">99.8%</div>
              <div className="text-sm text-green-600 mt-1">Excellent</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">Avg. Load Time</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">1.2s</div>
              <div className="text-sm text-green-600 mt-1">Optimal</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">0.2%</div>
              <div className="text-sm text-green-600 mt-1">Low</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            {type === 'student' ? 'Track your SIWES progress' : 
             type === 'supervisor' ? 'Monitor student performance' : 
             'System-wide analytics'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['progress', 'performance', 'system'].map((chartType) => (
              <button
                key={chartType}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                  activeChart === chartType 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveChart(chartType)}
              >
                {chartType}
              </button>
            ))}
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={timeRange}
            onChange={(e) => onTimeRangeChange && onTimeRangeChange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          
          <Button variant="ghost" className="flex items-center">
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Charts based on user type */}
      {type === 'student' && renderStudentCharts()}
      {type === 'supervisor' && renderSupervisorCharts()}
      {type === 'coordinator' && renderCoordinatorCharts()}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-800 rounded mr-2"></div>
          <span className="text-gray-600">Completed/Good</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-600 rounded mr-2"></div>
          <span className="text-gray-600">Average/Needs Attention</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
          <span className="text-gray-600">Below Target/Poor</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
          <span className="text-gray-600">Submitted/Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
          <span className="text-gray-600">Approved/Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;