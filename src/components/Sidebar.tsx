import React from 'react';
import { Calendar, List, User, Shield, Plus, Download, Filter, BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  viewMode: 'calendar' | 'list' | 'admin';
  onViewModeChange: (mode: 'calendar' | 'list' | 'admin') => void;
  onAddEvent: () => void;
  onExport: () => void;
  isDark: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogin,
  onLogout,
  selectedCountry,
  onCountryChange,
  viewMode,
  onViewModeChange,
  onAddEvent,
  onExport,
  isDark
}) => {
  return (
    <div className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 shadow-2xl z-40 overflow-y-auto transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50' 
        : 'bg-white/95 backdrop-blur-md border-r border-gray-200/50'
    }`}>
      <div className="p-6">
        {/* Quick Stats */}
        <div className={`mb-6 p-4 rounded-xl shadow-lg ${
          isDark 
            ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/20' 
            : 'bg-gradient-to-br from-blue-600 to-purple-600'
        }`}>
          <h3 className="font-bold text-white mb-3 text-sm">Global Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-blue-200 mr-1" />
                <p className="text-blue-100 text-xs font-medium">Events</p>
              </div>
              <p className="text-lg font-bold text-white">2,847</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-purple-200 mr-1" />
                <p className="text-purple-100 text-xs font-medium">Countries</p>
              </div>
              <p className="text-lg font-bold text-white">195</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <label className={`flex items-center text-sm font-bold mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Filter className="h-4 w-4 mr-2 text-purple-500" />
            View Mode
          </label>
          <div className={`flex rounded-xl border overflow-hidden ${
            isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-white/50'
          }`}>
            <button
              onClick={() => onViewModeChange('calendar')}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-3 w-3 mr-1.5" />
              Calendar
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : isDark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-3 w-3 mr-1.5" />
              List
            </button>
          </div>
        </div>

        {/* User Section */}
        {user ? (
          <div className={`mb-6 p-4 rounded-xl shadow-lg border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.displayName}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
                  user.role === 'admin' 
                    ? isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                    : isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' && <Shield className="h-2.5 w-2.5 mr-1" />}
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={onAddEvent}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:scale-105 font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>

              <button
                onClick={onExport}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:scale-105 font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>

              {user.role === 'admin' && (
                <button 
                  onClick={() => onViewModeChange('admin')}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg transition-all duration-200 shadow-lg hover:scale-105 font-semibold text-sm ${
                    viewMode === 'admin'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`mb-6 p-4 rounded-xl shadow-lg border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50'
          }`}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className={`font-bold mb-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Calendar Archive
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Sign in to manage personal events
              </p>
            </div>
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:scale-105 font-semibold text-sm"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        {/* My Events Section */}
        {user && (
          <div className="mb-6">
            <h3 className={`flex items-center text-sm font-bold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              My Events
            </h3>
            <div className={`space-y-2 p-3 rounded-lg ${
              isDark ? 'bg-gray-800/30' : 'bg-gray-50'
            }`}>
              {[
                { label: 'Personal', count: 12, color: 'purple', icon: User },
                { label: 'This Month', count: 5, color: 'blue', icon: Calendar },
                { label: 'Upcoming', count: 8, color: 'green', icon: TrendingUp }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      stat.color === 'purple' ? 'bg-purple-500/20 text-purple-500' :
                      stat.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-green-500/20 text-green-500'
                    }`}>
                      <stat.icon className="h-3 w-3" />
                    </div>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {stat.label}
                    </span>
                  </div>
                  <span className={`font-bold text-sm ${
                    stat.color === 'purple' ? 'text-purple-500' :
                    stat.color === 'blue' ? 'text-blue-500' :
                    'text-green-500'
                  }`}>
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Categories */}
        <div className="mb-6">
          <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Popular Categories
          </h3>
          <div className="space-y-2">
            {[
              { name: 'National Holidays', count: 245, color: 'bg-red-500' },
              { name: 'Religious Events', count: 189, color: 'bg-blue-500' },
              { name: 'Cultural Festivals', count: 156, color: 'bg-purple-500' },
              { name: 'International Days', count: 98, color: 'bg-green-500' }
            ].map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${category.color}`} />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className={`p-3 rounded-lg ${
          isDark ? 'bg-gray-800/30' : 'bg-gray-50'
        }`}>
          <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Status
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Database
              </span>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                API Status
              </span>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;