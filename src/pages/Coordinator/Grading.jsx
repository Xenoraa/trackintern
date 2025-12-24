// src/pages/Coordinator/Grading.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingAPI } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.jsx';
import { FiAward, FiSearch, FiFilter, FiCheck, FiX, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Grading = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [grades, setGrades] = useState({
    technical: 0,
    presentation: 0,
    documentation: 0,
    defense: 0,
    comments: '',
  });

  const { data: defenses, isLoading } = useQuery({
    queryKey: ['allDefenses'],
    queryFn: () => gradingAPI.getAllDefenses(),
  });

  const gradeMutation = useMutation({
    mutationFn: ({ defenseId, data }) => gradingAPI.submitGrade(defenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allDefenses']);
      setSelectedDefense(null);
      setGrades({
        technical: 0,
        presentation: 0,
        documentation: 0,
        defense: 0,
        comments: '',
      });
      toast.success('Grade submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to submit grade');
    },
  });

  const filteredDefenses = defenses?.data?.filter(defense => {
    const matchesSearch = defense.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         defense.student?.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         defense.verdict?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedDefense) return;

    const totalScore = (
      grades.technical * 0.4 +
      grades.presentation * 0.2 +
      grades.documentation * 0.25 +
      grades.defense * 0.15
    ).toFixed(1);

    gradeMutation.mutate({
      defenseId: selectedDefense.id,
      data: {
        ...grades,
        totalScore: parseFloat(totalScore),
        verdict: totalScore >= 50 ? 'PASSED' : 'FAILED',
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = {
    total: defenses?.data?.length || 0,
    pending: defenses?.data?.filter(d => d.verdict === 'PENDING').length || 0,
    passed: defenses?.data?.filter(d => d.verdict === 'PASSED').length || 0,
    failed: defenses?.data?.filter(d => d.verdict === 'FAILED').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grading</h1>
        <p className="text-gray-600 mt-1">
          Submit and manage defense grades
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card cursor-pointer" onClick={() => setStatusFilter('all')}>
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiAward className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Defenses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer" onClick={() => setStatusFilter('pending')}>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Grading</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer" onClick={() => setStatusFilter('passed')}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.passed}</p>
            </div>
          </div>
        </div>
        <div className="card cursor-pointer" onClick={() => setStatusFilter('failed')}>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search defenses by student name or matric number..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
            <button className="btn-secondary inline-flex items-center">
              <FiFilter className="mr-2 h-5 w-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Defenses List and Grading Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defenses List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Defenses for Grading</h3>
            {filteredDefenses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiAward className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No defenses found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDefenses.map((defense) => (
                  <div
                    key={defense.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDefense?.id === defense.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => {
                      setSelectedDefense(defense);
                      if (defense.grades) {
                        setGrades(defense.grades);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold">
                            {defense.student?.fullName?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{defense.student?.fullName}</h4>
                          <p className="text-sm text-gray-600">{defense.student?.matricNumber}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`badge ${
                          defense.verdict === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          defense.verdict === 'PASSED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {defense.verdict || 'PENDING'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">{formatDate(defense.defenseDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">{defense.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Examiners</p>
                        <p className="font-medium truncate">{defense.examiners}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Score</p>
                        <p className="font-medium">
                          {defense.totalScore ? `${defense.totalScore}/100` : 'Not graded'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grading Form */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDefense ? `Grade: ${selectedDefense.student?.fullName}` : 'Select a Defense'}
            </h3>
            
            {selectedDefense ? (
              <form onSubmit={handleGradeSubmit} className="space-y-4">
                {selectedDefense.verdict !== 'PENDING' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <FiCheck className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="font-medium text-green-800">Already Graded</p>
                      <p className="text-sm text-green-700 mt-1">
                        Total Score: <span className="font-bold">{selectedDefense.totalScore}/100</span>
                      </p>
                      <p className="text-sm text-green-700">
                        Verdict: <span className="font-bold">{selectedDefense.verdict}</span>
                      </p>
                    </div>
                  </div>
                )
                                 : (
                  <>
                    <div className="space-y-4">
                      {/* Technical Content */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Technical Content (40%)
                          </label>
                          <span className="text-sm font-semibold text-primary-600">
                            {grades.technical}/100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grades.technical}
                          onChange={(e) => setGrades({
                            ...grades,
                            technical: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Presentation Skills */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Presentation Skills (20%)
                          </label>
                          <span className="text-sm font-semibold text-primary-600">
                            {grades.presentation}/100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grades.presentation}
                          onChange={(e) => setGrades({
                            ...grades,
                            presentation: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Documentation */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Documentation (25%)
                          </label>
                          <span className="text-sm font-semibold text-primary-600">
                            {grades.documentation}/100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grades.documentation}
                          onChange={(e) => setGrades({
                            ...grades,
                            documentation: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Defense Performance */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Defense Performance (15%)
                          </label>
                          <span className="text-sm font-semibold text-primary-600">
                            {grades.defense}/100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={grades.defense}
                          onChange={(e) => setGrades({
                            ...grades,
                            defense: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>

                      {/* Total Score Preview */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Total Score</span>
                          <span className="text-2xl font-bold text-primary-600">
                            {(
                              grades.technical * 0.4 +
                              grades.presentation * 0.2 +
                              grades.documentation * 0.25 +
                              grades.defense * 0.15
                            ).toFixed(1)}/100
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-sm font-medium ${
                            (grades.technical * 0.4 +
                             grades.presentation * 0.2 +
                             grades.documentation * 0.25 +
                             grades.defense * 0.15) >= 50
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            Verdict: {
                              (grades.technical * 0.4 +
                               grades.presentation * 0.2 +
                               grades.documentation * 0.25 +
                               grades.defense * 0.15) >= 50
                                ? 'PASSED'
                                : 'FAILED'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments & Feedback
                        </label>
                        <textarea
                          value={grades.comments}
                          onChange={(e) => setGrades({
                            ...grades,
                            comments: e.target.value
                          })}
                          rows="4"
                          className="input-field"
                          placeholder="Provide constructive feedback for the student..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={gradeMutation.isLoading}
                        className="w-full btn-primary inline-flex items-center justify-center"
                      >
                        {gradeMutation.isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Grade'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiAward className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Select a defense from the list to grade</p>
              </div>
            )}
          </div>

          {/* Grading Criteria */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Criteria</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Technical Content (40%):</span>
                <span>Project complexity, innovation, implementation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Presentation Skills (20%):</span>
                <span>Clarity, communication, time management</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Documentation (25%):</span>
                <span>Report quality, completeness, formatting</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Defense Performance (15%):</span>
                <span>Q&A responses, technical understanding</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="font-medium text-primary-600">Passing Score: 50/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grading;