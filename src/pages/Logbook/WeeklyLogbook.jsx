import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/card';
import { FiUpload, FiImage, FiSave, FiCalendar, FiEye, FiTrash2 } from 'react-icons/fi';

export default function WeeklyLogbook() {
  const [week, setWeek] = useState(1);
  const [entry, setEntry] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // API call to save logbook
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Logbook entry saved successfully!');
    setSaving(false);
    setEntry('');
    setImages([]);
  };

  const previousEntries = [
    { week: 6, date: '2024-03-10', status: 'approved', supervisor: 'Dr. Johnson', feedback: 'Good documentation' },
    { week: 5, date: '2024-03-03', status: 'pending', supervisor: 'Dr. Johnson', feedback: null },
    { week: 4, date: '2024-02-25', status: 'approved', supervisor: 'Dr. Johnson', feedback: 'Well done' },
    { week: 3, date: '2024-02-18', status: 'approved', supervisor: 'Dr. Johnson', feedback: 'Improve details' },
    { week: 2, date: '2024-02-11', status: 'approved', supervisor: 'Dr. Johnson', feedback: 'Good start' },
    { week: 1, date: '2024-02-04', status: 'approved', supervisor: 'Dr. Johnson', feedback: 'Welcome to SIWES' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Logbook</h1>
          <p className="text-gray-600 mt-2">
            Document your SIWES activities for each week. Entries are reviewed by supervisors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Week Entry Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Week {week} Entry</h3>
                  <p className="text-gray-500 text-sm mt-1">Due: March 15, 2024</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                    <FiCalendar className="mr-2 text-gray-500" />
                    <select
                      value={week}
                      onChange={(e) => setWeek(Number(e.target.value))}
                      className="bg-transparent border-none focus:outline-none text-gray-800"
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>Week {w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Activities Description
                  </label>
                  <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-800"
                    placeholder="Describe your activities, tasks completed, skills learned, challenges faced, and achievements for this week..."
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <FiImage className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-2">
                      Upload photos of your workplace, projects, or any visual documentation
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Max 5 images • JPG, PNG, GIF up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors"
                    >
                      <FiUpload className="mr-2" />
                      Select Images
                    </label>
                  </div>

                  {/* Preview Images */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setImages(images.filter((_, i) => i !== index))}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !entry.trim()}
                    className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSave className="mr-2" />
                    {saving ? 'Submitting...' : 'Submit Logbook Entry'}
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Progress & Guidelines Sidebar */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <Card className="bg-white border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Submission Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Weeks Completed</span>
                    <span className="font-medium text-gray-900">6/13</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-800" style={{ width: '46%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-medium text-gray-900">83%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: '83%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="bg-white border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Logbook Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 mr-3"></div>
                  <span>Submit weekly by Friday 5:00 PM</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 mr-3"></div>
                  <span>Minimum 300 words per entry</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt=1 mr-3"></div>
                  <span>Include specific tasks and achievements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 mr-3"></div>
                  <span>Images should be relevant and clear</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 mr-3"></div>
                  <span>Mention challenges and solutions</span>
                </li>
              </ul>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  View Supervisor Feedback
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Download All Entries
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  View Defense Schedule
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Previous Entries Table */}
        <Card className="mt-8 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Previous Logbook Entries</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Export
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Week</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date Submitted</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Supervisor</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Feedback</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {previousEntries.map((entry) => (
                  <tr key={entry.week} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">Week {entry.week}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{entry.date}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{entry.supervisor}</td>
                    <td className="py-4 px-4">
                      {entry.feedback ? (
                        <span className="text-gray-600 truncate max-w-xs">{entry.feedback}</span>
                      ) : (
                        <span className="text-gray-400">Awaiting feedback</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <FiEye />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <FiUpload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing 1 to 6 of 6 entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-gray-900 text-white border border-gray-900 rounded-lg">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}