import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, User, Trash2, Plus, Globe, Filter, Edit } from 'lucide-react';
import { Event, Country } from '../types';

interface EventViewerProps {
  selectedDate: Date;
  events: Event[];
  user: any;
  onDeleteEvent: (eventId: string, isPersonal: boolean) => void;
  onAddEvent: () => void;
  isDark: boolean;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const countries: Country[] = [
  { code: '', name: 'All Countries', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' }
];

const categories = ['Work', 'Personal', 'Holiday', 'Meeting', 'Other'];

const EventViewer: React.FC<EventViewerProps> = ({ selectedDate, events, user, onDeleteEvent, onAddEvent, isDark, selectedCountry, onCountryChange, selectedCategory, onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'personal'>('global');
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const dayEvents = events.filter(event => format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));
  const globalEvents = dayEvents.filter(event => !event.isPersonal);
  const personalEvents = dayEvents.filter(event => event.isPersonal);
  const currentEvents = activeTab === 'global' ? globalEvents : personalEvents;

  const handleEditEvent = (event: Event) => {
    setEditEvent(event);
    onAddEvent(); // Reuse AddEventModal for editing
  };

  return (
    <div className={`rounded-xl shadow-md p-2 h-[650px] flex flex-col overflow-hidden ${isDark ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' : 'bg-white/80 backdrop-blur-sm border border-white/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600'}`}>
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{format(selectedDate, 'MMMM d, yyyy')}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{format(selectedDate, 'EEEE')} • {dayEvents.length} events</p>
          </div>
        </div>
        {user && (
          <button onClick={onAddEvent} className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md">
            <Plus className="h-3 w-3" />
            <span className="text-sm">Add</span>
          </button>
        )}
      </div>
      <div className="mb-2">
        <label className={`flex items-center text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Filter className="h-3 w-3 mr-1 text-blue-500" />
          Filter by Country
        </label>
        <select value={selectedCountry} onChange={(e) => onCountryChange(e.target.value)} className={`w-full px-2 py-1 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/80 border-gray-200 text-gray-900'}`}>
          {countries.map(country => <option key={country.code} value={country.name === 'All Countries' ? '' : country.name}>{country.flag} {country.name}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label className={`flex items-center text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Filter className="h-3 w-3 mr-1 text-purple-500" />
          Filter by Category
        </label>
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className={`w-full px-2 py-1 rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/80 border-gray-200 text-gray-900'}`}>
          <option value="">All Categories</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div className={`flex border-b-2 mb-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button onClick={() => setActiveTab('global')} className={`px-3 py-1 text-sm font-bold border-b-2 ${activeTab === 'global' ? (isDark ? 'border-blue-400 text-blue-400 bg-blue-900/20' : 'border-blue-500 text-blue-600 bg-blue-50') : (isDark ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700' )}`}>
          <div className="flex items-center space-x-1"><Globe className="h-3 w-3" /><span>Global ({globalEvents.length})</span></div>
        </button>
        {user && (
          <button onClick={() => setActiveTab('personal')} className={`px-3 py-1 text-sm font-bold border-b-2 ${activeTab === 'personal' ? (isDark ? 'border-purple-400 text-purple-400 bg-purple-900/20' : 'border-purple-500 text-purple-600 bg-purple-50') : (isDark ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700' )}`}>
            <div className="flex items-center space-x-1"><User className="h-3 w-3" /><span>My ({personalEvents.length})</span></div>
          </button>
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {currentEvents.length > 0 ? (
          currentEvents.map((event: Event) => (
            <div key={event.id} className={`p-2 rounded-md border-l-4 transition-all duration-200 hover:shadow-md ${
              event.isPersonal ? (isDark ? 'border-purple-400 bg-purple-900/20' : 'border-purple-500 bg-purple-50') : (isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</h4>
                  {event.description && <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>}
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1"><Calendar className={`h-3 w-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /><span>{event.category}</span></div>
                    {event.country && <div className="flex items-center space-x-1"><MapPin className={`h-3 w-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} /><span>{event.country}</span></div>}
                    {event.isPersonal && <div className="flex items-center space-x-1"><User className={`h-3 w-3 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} /><span>Personal</span></div>}
                  </div>
                </div>
                {event.isPersonal && user && event.userId === user.uid && (
                  <div className="flex space-x-1">
                    <button onClick={() => handleEditEvent(event)} className={`p-1 rounded-md ${isDark ? 'text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300' : 'text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700'}`}>
                      <Edit className="h-3 w-3" />
                    </button>
                    <button onClick={() => onDeleteEvent(event.id, event.isPersonal)} className={`p-1 rounded-md ${isDark ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' : 'text-red-600 hover:bg-red-100 hover:text-red-700'}`}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <Calendar className={`h-6 w-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h4 className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>No {activeTab} events</h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activeTab === 'personal' && user ? 'Add your first event' : 'No events found'}</p>
            {activeTab === 'personal' && user && (
              <button onClick={onAddEvent} className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-md hover:from-purple-600 hover:to-purple-700">
                <Plus className="h-3 w-3" />
                <span className="text-sm">Add</span>
              </button>
            )}
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${isDark ? '#374151' : '#f1f5f9'}; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#6b7280' : '#cbd5e1'}; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#9ca3af' : '#94a3b8'}; }
        select:focus {
          box-shadow: 0 0 0 2px ${isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)'};
        }
        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default EventViewer;