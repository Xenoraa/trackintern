import { useState } from 'react';
import Button from '../ui/Button';
import { FiUpload, FiImage, FiSave, FiCalendar } from 'react-icons/fi';

const LogbookForm = ({ 
  initialData = {},
  onSubmit,
  loading = false,
  week = 1,
  onWeekChange 
}) => {
  const [formData, setFormData] = useState({
    week: week,
    activities: initialData.activities || '',
    challenges: initialData.challenges || '',
    achievements: initialData.achievements || '',
    hoursWorked: initialData.hoursWorked || 40,
    images: []
  });

  const [selectedImages, setSelectedImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, selectedImages);
  };

  const weeks = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Week Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Week {formData.week} Logbook</h3>
          <p className="text-sm text-gray-600">Document your weekly SIWES activities</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-400" />
          <select
            name="week"
            value={formData.week}
            onChange={(e) => {
              handleChange(e);
              if (onWeekChange) onWeekChange(Number(e.target.value));
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {weeks.map(w => (
              <option key={w} value={w}>Week {w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activities Performed
        </label>
        <textarea
          name="activities"
          value={formData.activities}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
          placeholder="Describe the tasks and activities you performed this week..."
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Be specific about your tasks, technologies used, and responsibilities
        </p>
      </div>

      {/* Challenges */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Challenges Encountered
        </label>
        <textarea
          name="challenges"
          value={formData.challenges}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
          placeholder="Describe any challenges you faced and how you overcame them..."
        />
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Key Achievements
        </label>
        <textarea
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
          placeholder="Highlight your accomplishments and skills learned..."
        />
      </div>

      {/* Hours Worked */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours Worked This Week
        </label>
        <input
          type="number"
          name="hoursWorked"
          value={formData.hoursWorked}
          onChange={handleChange}
          min="1"
          max="60"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Minimum 40 hours per week required
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supporting Images (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FiImage className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">
            Upload photos of your workplace, projects, or activities
          </p>
          <p className="text-sm text-gray-500 mb-4">Max 5 images • JPG, PNG up to 5MB each</p>
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
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer hover:bg-gray-800"
          >
            <FiUpload className="mr-2" />
            Select Images
          </label>
        </div>

        {/* Image Previews */}
        {selectedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="flex items-center"
        >
          <FiSave className="mr-2" />
          Submit Logbook
        </Button>
      </div>
    </form>
  );
};

export default LogbookForm;