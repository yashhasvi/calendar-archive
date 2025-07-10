import React, { useState } from 'react';
import { X, Calendar, Type, Tag, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: {
    title: string;
    date: Date;
    description: string;
    category: string;
    country: string;
    isPersonal: boolean;
    userId: string;
    color: string;
  }) => Promise<void>; // Explicitly async
  selectedDate: Date;
  isDark: boolean;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave, selectedDate, isDark }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    country: '',
    color: '#8b5cf6',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'personal',
    'birthday',
    'anniversary',
    'reminder',
    'meeting',
    'other',
  ];

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      console.error('AddEventModal.tsx: Title is required');
      setIsSubmitting(false);
      return;
    }
    if (!currentUser) {
      setError('Please log in to add an event');
      console.error('AddEventModal.tsx: No authenticated user');
      setIsSubmitting(false);
      return;
    }
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      setError('Invalid date');
      console.error('AddEventModal.tsx: Invalid date:', selectedDate);
      setIsSubmitting(false);
      return;
    }

    try {
      const eventData = {
        title: formData.title.trim(),
        date: selectedDate,
        description: formData.description.trim(),
        category: formData.category,
        country: formData.country,
        isPersonal: true,
        userId: currentUser.uid,
        color: formData.color,
      };
      console.log('AddEventModal.tsx: User ID:', currentUser.uid);
      console.log('AddEventModal.tsx: Submitting Event:', {
        ...eventData,
        date: eventData.date.toISOString(),
      });
      await onSave(eventData); // Await the save operation
      console.log('AddEventModal.tsx: Event saved successfully');
      setFormData({ title: '', description: '', category: 'personal', country: '', color: '#8b5cf6' });
      setError(null);
      onClose();
    } catch (error) {
      setError('Failed to save event. Check console for details.');
      console.error('AddEventModal.tsx: Error saving event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto ${
        isDark ? 'bg-gray-800/95 border border-gray-700/50' : 'bg-white/95 border border-gray-200/50'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add New Event
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors hover:bg-gray-700/50 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </label>
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
              }`}>
                <Calendar className="h-4 w-4" />
                <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <div className="relative">
                <Type className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter event title"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <div className="relative">
                <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Country (Optional)
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">None</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                  isDark
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Add a description..."
                disabled={isSubmitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={`w-full h-10 border-2 rounded-lg ${
                  isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-white'
                }`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={`flex items-center justify-end space-x-4 pt-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;