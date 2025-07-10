import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useEvents } from './hooks/useEvents';
import { exportToPDF, exportToICS } from './utils/export';
import { Event } from './types';

const Header = lazy(() => import('./components/Header'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const CalendarGrid = lazy(() => import('./components/CalendarGrid'));
const EventViewer = lazy(() => import('./components/EventViewer'));
const EventTimeline = lazy(() => import('./components/EventTimeline'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const AddEventModal = lazy(() => import('./components/AddEventModal'));
const Chatbot = lazy(() => import('./components/Chatbot'));

function App() {
  const { currentUser, role, loading, login, register, logout, googleLogin } = useAuth();
  const { events, addEvent, deleteEvent, uploadCSV } = useEvents(currentUser?.uid || null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'admin'>('calendar');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [showFallback, setShowFallback] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowFallback(true);
      }
      console.log('App.tsx: Current User:', currentUser ? { uid: currentUser.uid, email: currentUser.email, displayName: currentUser.displayName, role } : 'No user');
      console.log('App.tsx: Events:', events.map((e: Event) => ({ id: e.id, title: e.title, date: e.date.toISOString(), userId: e.userId, isPersonal: e.isPersonal })));
    }, 10000); // 10-second timeout
    return () => clearTimeout(timer);
  }, [currentUser, role, events, loading]);

  const filterEvents = useCallback((event: Event) => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCountry = !selectedCountry || event.country === selectedCountry || !event.country;
    const matchesCategory = !selectedCategory || event.category === selectedCategory || !event.category;
    console.log('App.tsx: Filtering event:', {
      id: event.id,
      title: event.title,
      isPersonal: event.isPersonal,
      matchesSearch,
      matchesCountry,
      matchesCategory
    });
    return matchesSearch && matchesCountry && matchesCategory;
  }, [searchTerm, selectedCountry, selectedCategory]);

  const filteredEvents = useMemo(() => {
    const filtered = events.filter(filterEvents);
    console.log('App.tsx: Filtered Events:', filtered.map((e: Event) => ({
      id: e.id,
      title: e.title,
      isPersonal: e.isPersonal
    })));
    return filtered;
  }, [events, filterEvents]);

  const handleLogin = () => setIsLoginModalOpen(true);
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };
  const handleAddEvent = () => { 
    if (!currentUser) { 
      setIsLoginModalOpen(true); 
      return; 
    } 
    setIsAddEventModalOpen(true); 
  };
  const handleExport = () => {
    if (!currentUser) { 
      setIsLoginModalOpen(true); 
      return; 
    }
    const userEvents = filteredEvents.filter((e: Event) => e.isPersonal && e.userId === currentUser.uid);
    if (userEvents.length === 0) { 
      alert('No personal events to export'); 
      return; 
    }
    const choice = window.confirm('Export as PDF? (Cancel for ICS)');
    if (choice) exportToPDF(userEvents, `${currentUser.displayName}'s Calendar Events`);
    else exportToICS(userEvents, `${currentUser.displayName?.toLowerCase().replace(/\s+/g, '-')}-calendar`);
  };

  if (showFallback || (loading && !currentUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 animate-gradient-x" style={{ animationDuration: '3s' }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin-slow rounded-full h-24 w-24 border-t-4 border-b-4 border-white/20 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0h2m-18 0H3"></path>
              </svg>
            </div>
          </div>
          <p className="text-white font-medium text-lg mt-4 animate-fade-in">Loading is taking longer than expected. Please wait or refresh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? 'dark bg-gradient-to-br from-gray-700 via-blue-800 to-gray-700' : 'bg-gradient-to-br from-blue-50 via-white to-slate-100'}`}>
      <Suspense fallback={<div className={`h-16 ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}></div>}>
        <Header user={currentUser} onLogin={handleLogin} onLogout={logout} searchTerm={searchTerm} onSearchChange={setSearchTerm} isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      </Suspense>
      <Suspense fallback={<div className={`w-64 h-full ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}></div>}>
        <Sidebar user={currentUser} onLogin={handleLogin} onLogout={logout} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} viewMode={viewMode} onViewModeChange={setViewMode} onAddEvent={handleAddEvent} onExport={handleExport} isDark={isDark} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      </Suspense>
      <div className="ml-80 pt-28 px-4">
        {viewMode === 'admin' && role === 'admin' ? (
          <Suspense fallback={<div className={`p-4 rounded ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}>Loading admin panel...</div>}>
            <AdminPanel events={events} onUploadCSV={uploadCSV} isDark={isDark} />
          </Suspense>
        ) : (
          <>
            <div className="min-h-screen grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-4 items-stretch overflow-hidden">
              <div className="h-[650px]">
                {viewMode === 'calendar' ? (
                  <Suspense fallback={<div className={`p-4 rounded h-full ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}>Loading calendar...</div>}>
                    <CalendarGrid events={filteredEvents} selectedDate={selectedDate} onDateSelect={setSelectedDate} isDark={isDark} />
                  </Suspense>
                ) : (
                  <div className={`rounded-xl shadow-md p-2 h-[650px] overflow-y-auto custom-scrollbar ${isDark ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' : 'bg-white/80 backdrop-blur-sm border border-white/50'}`}>
                    <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Events List</h2>
                    <div className="space-y-2">
                      {filteredEvents.length === 0 ? (
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No events found. Try adjusting filters or adding events.</p>
                      ) : (
                        filteredEvents.map((event: Event) => (
                          <div key={event.id} className={`p-2 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${event.isPersonal ? (isDark ? 'border-purple-400 bg-purple-900/20' : 'border-purple-500 bg-purple-50') : (isDark ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50')}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-[650px]">
                <Suspense fallback={<div className={`p-4 rounded h-full ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}>Loading event viewer...</div>}>
                  <EventViewer selectedDate={selectedDate} events={filteredEvents} user={currentUser} onDeleteEvent={deleteEvent} onAddEvent={handleAddEvent} isDark={isDark} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
                </Suspense>
              </div>
            </div>
            {viewMode !== 'admin' && (
              <Suspense fallback={<div className={`p-4 rounded mt-12 ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}`}>Loading timeline...</div>}>
                <EventTimeline events={filteredEvents} isDark={isDark} />
              </Suspense>
            )}
          </>
        )}
      </div>
      <Suspense fallback={null}>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={login} onRegister={register} onGoogleLogin={handleGoogleLogin} isDark={isDark} />
        <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} onSave={addEvent} selectedDate={selectedDate} isDark={isDark} />
        <Chatbot isDark={isDark} />
      </Suspense>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${isDark ? '#374151' : '#f1f5f9'}; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#6b7280' : '#cbd5e1'}; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#9ca3af' : '#94a3b8'}; }
        @media (max-width: 1024px) {
          .xl\\:grid-cols-\\[2\\.5fr_1fr\\] { grid-template-columns: 1fr; }
          .h-\\[650px\\] { height: auto; }
          .ml-80 { margin-left: 0; }
          .pt-28 { padding-top: 1rem; }
          .gap-4 { gap: 2px; }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 0.8s linear infinite; }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default App;