import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logbookAPI } from '../../services/api.js';
import { WEEKS } from '../../utils/constants.jsx';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SubmitLogbook = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const weekFromUrl = parseInt(searchParams.get('week'));
    const defaultWeek = weekFromUrl && weekFromUrl >= 1 && weekFromUrl <= 13 ? weekFromUrl : 1;

    const [formData, setFormData] = useState({
        weekNumber: defaultWeek,
        activityDescription: '',
    });

    const availableWeeks = WEEKS.map(week => ({
        ...week,
        disabled: false, // You can add logic to disable already submitted weeks
    }));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate file size and type
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(`File ${file.name} is too large (max 5MB)`);
                return false;
            }
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} is not an image`);
                return false;
            }
            return true;
        });

        // Create previews
        const newPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const submitMutation = useMutation({
        mutationFn: (data) => logbookAPI.createEntry(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['myLogbook']);
            toast.success('Logbook submitted successfully!');
            navigate('/logbook');
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to submit logbook');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.activityDescription.trim()) {
            toast.error('Please enter activity description');
            return;
        }

        if (formData.activityDescription.length < 50) {
            toast.error('Description should be at least 50 characters');
            return;
        }

        setIsSubmitting(true);

        // In a real app, you would upload images to Cloudinary/server first
        // For MVP, we'll simulate with placeholder URLs
        const uploadedImages = images.length > 0
            ? images.map((_, i) => `https://via.placeholder.com/600x400/3b82f6/ffffff?text=Week+${formData.weekNumber}+Image+${i+1}`)
            : [];

        submitMutation.mutate({
            ...formData,
            images: uploadedImages,
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit Weekly Logbook</h1>
                <p className="text-gray-600 mt-1">
                    Document your SIWES activities for the week
                </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
                    <h2 className="text-xl font-bold text-white">Week {formData.weekNumber} Submission</h2>
                    <p className="text-primary-100 mt-1">
                        Complete all fields below. Your supervisor will review this submission.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Week Selection */}
                    <div>
                        <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Week
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-13 gap-2">
                            {availableWeeks.map((week) => (
                                <button
                                    key={week.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, weekNumber: week.value })}
                                    disabled={week.disabled}
                                    className={`p-3 rounded-lg border text-center transition-colors ${
                                        formData.weekNumber === week.value
                                            ? 'bg-primary-50 border-primary-500 text-primary-700 font-semibold'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                    } ${week.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="text-lg font-bold">{week.value}</div>
                                    <div className="text-xs">Week</div>
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Select the week you're reporting on (1-13)
                        </p>
                    </div>

                    {/* Activity Description */}
                    <div>
                        <label htmlFor="activityDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Activity Description
                        </label>
                        <textarea
                            id="activityDescription"
                            name="activityDescription"
                            rows="8"
                            value={formData.activityDescription}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Describe your activities for this week. Include:
• What you worked on
• Skills you developed
• Challenges faced
• Lessons learned"
                        />
                        <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">
                Minimum 50 characters
              </span>
                            <span className={formData.activityDescription.length < 50 ? 'text-red-500' : 'text-green-500'}>
                {formData.activityDescription.length}/50
              </span>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Images (Optional)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                        <span>Upload images</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB each
                                </p>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({imagePreviews.length})</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX className="h-4 w-4" />
                                            </button>
                                            <div className="text-xs text-gray-500 truncate mt-1">
                                                {preview.file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submission Guidelines */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Submission Guidelines</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Describe your activities in detail (minimum 50 characters)</li>
                            <li>• Be specific about tasks and responsibilities</li>
                            <li>• Mention any challenges and how you overcame them</li>
                            <li>• Upload relevant photos as evidence (optional)</li>
                            <li>• You can only submit one log per week</li>
                            <li>• Once submitted, you cannot edit until supervisor review</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/logbook')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || submitMutation.isLoading}
                            className="btn-primary"
                        >
                            {isSubmitting || submitMutation.isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Logbook'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitLogbook;