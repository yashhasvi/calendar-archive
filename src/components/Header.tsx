import React, { useState } from 'react';
import { Search, Sun, Moon, User, LogOut, Settings, Shield, Bell } from 'lucide-react';
import NotificationModal from './NotificationModal';

interface HeaderProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  searchTerm,
  onSearchChange,
  isDark,
  onThemeToggle
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSendNotification = async (message: string, type: 'all' | 'users') => {
    console.log('Sending notification:', { message, type });
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Notification sent to ${type === 'all' ? 'all users' : 'registered users'}: ${message}`);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-20 z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between h-full px-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-blue-600 to-purple-700'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
                <line x1="6" y1="7" x2="6" y2="7" strokeWidth="1.5" />
                <line x1="10" y1="7" x2="10" y2="7" strokeWidth="1.5" />
                <line x1="14" y1="7" x2="14" y2="7" strokeWidth="1.5" />
                <line x1="18" y1="7" x2="18" y2="7" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Calendar Archive
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-12">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search events, dates, countries..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Admin Notifications */}
            {user?.role === 'admin' && (
              <button 
                onClick={() => setShowNotificationModal(true)}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 relative ${
                  isDark 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' 
                    : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-600'
                }`}
                title="Send notifications to users"
              >
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                  : 'bg-gray-100/80 hover:bg-gray-200/80'
              }`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-3 rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                      : 'bg-gray-100/80 hover:bg-gray-200/80'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.displayName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.role}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border overflow-hidden z-50 ${
                    isDark 
                      ? 'bg-gray-800/95 backdrop-blur-md border-gray-700/50' 
                      : 'bg-white/95 backdrop-blur-md border-gray-200/50'
                  }`}>
                    <div className={`p-6 border-b ${
                      isDark 
                        ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-gray-700/50' 
                        : 'bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.displayName}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                            user.role === 'admin' 
                              ? isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                              : isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${
                        isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings & Preferences</span>
                      </button>
                      {user.role === 'admin' && (
                        <button className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${
                          isDark ? 'text-purple-300 hover:bg-purple-900/20' : 'text-purple-700 hover:bg-purple-50'
                        }`}>
                          <Shield className="h-5 w-5" />
                          <span className="font-medium">Admin Dashboard</span>
                        </button>
                      )}
                      <hr className={`my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${
                          isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-700 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Click outside to close profile menu */}
        {showProfileMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </header>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onSend={handleSendNotification}
        isDark={isDark}
      />
    </>
  );
};

export default Header;