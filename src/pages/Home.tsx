import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Globe, Plus, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import Calendar from '../components/Calendar';
import EventModal from '../components/EventModal';
import AddEventModal from '../components/AddEventModal';
import LoginModal from '../components/LoginModal';
import { Event, Country } from '../types';

const Home: React.FC = () => {
  const { currentUser, isGuest } = useAuth();
  const { events, addEvent, deleteEvent, loading: isLoading, error } = useEvents(currentUser?.uid);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Debug logs
  console.log('User ID:', currentUser?.uid);
  console.log('All events:', events.map(e => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() })));
  console.log('Personal events (unfiltered):', events.filter(e => e.isPersonal).map(e => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() })));

  const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
  ];

  const categories = [
    'holiday',
    'national',
    'religious',
    'cultural',
    'sports',
    'personal',
    'birthday',
    'anniversary',
    'reminder',
    'meeting',
    'event',
    'other',
  ];

  const handleAddEvent = async (eventData: {
    title: string;
    date: Date;
    description?: string;
    category: string;
    color?: string;
    country?: string;
  }) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const eventId = await addEvent({
        title: eventData.title,
        date: eventData.date,
        description: eventData.description || '',
        category: eventData.category || 'personal',
        country: eventData.country || '',
        isPersonal: true,
        userId: currentUser.uid,
        color: eventData.color || '#8b5cf6',
      });
      console.log('Add event submitted, ID:', eventId, 'Data:', { ...eventData, date: eventData.date.toISOString() });
      setIsAddEventModalOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEditEvent = (event: Event) => {
    console.log('Edit event:', event);
    // TODO: Implement edit functionality
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!currentUser || !event.isPersonal || event.userId !== currentUser.uid) {
      console.log('Delete event blocked:', { isPersonal: event.isPersonal, userIdMatch: event.userId === currentUser?.uid });
      return;
    }

    try {
      await deleteEvent(event.id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleAddEventClick = (date: Date) => {
    if (!currentUser && !isGuest) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isGuest) {
      setIsLoginModalOpen(true);
      return;
    }

    setSelectedDate(date);
    setIsAddEventModalOpen(true);
  };

  const filteredEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        !searchTerm ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = !selectedCountry || event.country === selectedCountry;
      const matchesCategory = !selectedCategory || event.category === selectedCategory;

      return matchesSearch && matchesCountry && matchesCategory;
    });
    console.log('Filtered events:', filtered.map(e => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() })));
    return filtered;
  }, [events, searchTerm, selectedCountry, selectedCategory]);

  const todayEvents = useMemo(() => {
    const today = filteredEvents.filter(
      (event) => format(event.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );
    console.log('Today’s events:', today.map(e => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() })));
    return today;
  }, [filteredEvents]);

  const upcomingEvents = useMemo(() => {
    const upcoming = filteredEvents
      .filter((event) => event.date > new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    console.log('Upcoming events:', upcoming.map(e => ({ ...e, date: e.date.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() })));
    return upcoming;
  }, [filteredEvents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p>Error loading events: {error}</p>
          <p>Please check your Firestore configuration and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Debug Section for Personal Events */}
      {currentUser && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug: All Personal Events</h3>
          {events.filter((e) => e.isPersonal).length > 0 ? (
            <div className="space-y-3">
              {events.filter((e) => e.isPersonal).map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-md bg-purple-50 border-l-4 border-purple-600"
                >
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">Date: {format(event.date, 'MMM d, yyyy')}</p>
                  <p className="text-xs text-gray-500">Category: {event.category}</p>
                  <p className="text-xs text-gray-500">Country: {event.country || 'None'}</p>
                  <p className="text-xs text-gray-500">User ID: {event.userId}</p>
                  <p className="text-xs text-gray-500">Created: {format(event.createdAt, 'MMM d, yyyy HH:mm:ss')}</p>
                  <p className="text-xs text-gray-500">Updated: {format(event.updatedAt, 'MMM d, yyyy HH:mm:ss')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No personal events fetched. Try adding one or check Firestore.
            </p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Calendar Archive</h1>
        <p className="text-xl text-gray-600">Discover and manage important dates from around the world</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-blue-600">{filteredEvents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Events</h3>
          <p className="text-3xl font-bold text-green-600">{todayEvents.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Events</h3>
          <p className="text-3xl font-bold text-purple-600">
            {currentUser ? filteredEvents.filter((e) => e.isPersonal).length : 0}
          </p>
          {currentUser && filteredEvents.filter((e) => e.isPersonal).length === 0 && (
            <p className="text-sm text-gray-500 mt-2">No personal events found. Try adding one or check filters.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            selectedDate={selectedDate}
            onAddEvent={handleAddEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-blue-100 transition-colors duration-200 ${
                      event.isPersonal ? 'bg-purple-50 border-l-4 border-purple-600' : 'bg-blue-50'
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      {event.isPersonal && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          Personal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 capitalize">{event.category}</p>
                    {event.country && <p className="text-xs text-gray-500">{event.country}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No events today</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                      event.isPersonal ? 'bg-purple-50 border-l-4 border-purple-600' : 'bg-gray-50'
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      {event.isPersonal && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          Personal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{format(event.date, 'MMM d, yyyy')}</p>
                    <p className="text-xs text-gray-500 capitalize">{event.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleAddEventClick(new Date())}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => {
                    /* Export functionality */
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Calendar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSave={handleAddEvent}
        selectedDate={selectedDate}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          // Navigate to register page
        }}
      />
    </div>
  );
};

export default Home;