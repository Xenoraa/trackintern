// src/pages/Coordinator/ScheduleDefense.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingAPI, studentAPI } from '../../services/api.js';
import { formatDate, formatTime } from '../../utils/helpers.jsx';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ScheduleDefense = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    defenseDate: '',
    defenseTime: '',
    location: '',
    examiners: '',
  });

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['allStudents'],
    queryFn: () => studentAPI.getAll(),
  });

  const { data: defenses, isLoading: defensesLoading } = useQuery({
    queryKey: ['allDefenses'],
    queryFn: () => gradingAPI.getAllDefenses(),
  });

  const scheduleMutation = useMutation({
    mutationFn: (data) => gradingAPI.scheduleDefense(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allDefenses']);
      setShowForm(false);
      setFormData({
        studentId: '',
        defenseDate: '',
        defenseTime: '',
        location: '',
        examiners: '',
      });
      toast.success('Defense scheduled successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to schedule defense');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (studentsLoading || defensesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const upcomingDefenses = defenses?.data?.filter(
    d => new Date(d.defenseDate) > new Date()
  ) || [];

  const pastDefenses = defenses?.data?.filter(
    d => new Date(d.defenseDate) <= new Date()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Defense</h1>
          <p className="text-gray-600 mt-1">
            Manage student defense schedules and appointments
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary inline-flex items-center"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Schedule Defense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Defenses</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingDefenses.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Defenses</p>
              <p className="text-2xl font-bold text-gray-900">{pastDefenses.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiUsers className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Eligible Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {students?.data?.filter(s => s.status === 'ACTIVE' && !s.defenseScheduled).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Defense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select student</option>
                  {students?.data
                    ?.filter(s => s.status === 'ACTIVE' && !s.defenseScheduled)
                    .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.fullName} ({student.matricNumber})
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 101, CS Building"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Defense Date
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    name="defenseDate"
                    value={formData.defenseDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Defense Time
                </label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="time"
                    name="defenseTime"
                    value={formData.defenseTime}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Examiners (comma separated)
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="examiners"
                  value={formData.examiners}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Smith, Prof. Johnson"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={scheduleMutation.isLoading}
                className="btn-primary inline-flex items-center"
              >
                {scheduleMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  'Schedule Defense'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Defenses */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Defenses</h3>
        {upcomingDefenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FiCalendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No upcoming defenses scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingDefenses.map((defense) => (
              <div key={defense.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {defense.student?.fullName?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{defense.student?.fullName}</h4>
                      <p className="text-sm text-gray-600">{defense.student?.matricNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(defense.defenseDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(defense.defenseTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        <span>{defense.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Examiners: {defense.examiners}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.success('Edit defense schedule')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this defense schedule?')) {
                          toast.success('Defense cancelled');
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDefense;