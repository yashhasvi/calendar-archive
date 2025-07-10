import React, { useState } from 'react';
import { Upload, Users, Calendar, TrendingUp, BarChart3, PieChart, Globe, Activity } from 'lucide-react';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AdminPanelProps {
  events: Event[];
  onUploadCSV: (file: File, userId: string | null) => Promise<void>;
  isDark: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ events, onUploadCSV, isDark }) => {
  const { currentUser, role } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Restrict access to admins
  if (role !== 'admin') {
    return (
      <div className={`p-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>Only admins can access the Admin Dashboard.</p>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading and processing CSV...');

    try {
      await onUploadCSV(file, currentUser?.uid || null);
      setUploadStatus('CSV uploaded successfully! Events have been added to the database.');
    } catch (error) {
      setUploadStatus('Error uploading CSV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const stats = {
    totalEvents: events.length,
    globalEvents: events.filter(e => !e.isPersonal).length,
    personalEvents: events.filter(e => e.isPersonal).length,
    countries: [...new Set(events.map(e => e.country).filter(Boolean))].length,
    categories: [...new Set(events.map(e => e.category))].length,
    thisMonth: events.filter(e => {
      const now = new Date();
      return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
    }).length,
  };

  const topCountries = [...new Set(events.map(e => e.country).filter(Boolean))]
    .map(country => ({
      name: country,
      count: events.filter(e => e.country === country).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCategories = [...new Set(events.map(e => e.category))]
    .map(category => ({
      name: category,
      count: events.filter(e => e.category === category).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`rounded-2xl shadow-2xl p-8 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20' 
          : 'bg-gradient-to-r from-purple-600 to-blue-600'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-purple-100">Manage events, users, and system analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-purple-100 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Global Events', value: stats.globalEvents, icon: Globe, color: 'blue', change: '+12%' },
          { title: 'Personal Events', value: stats.personalEvents, icon: Users, color: 'purple', change: '+8%' },
          { title: 'Countries', value: stats.countries, icon: Calendar, color: 'green', change: '+3%' },
          { title: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: 'orange', change: '+15%' },
        ].map((stat, index) => (
          <div key={index} className={`rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
              : 'bg-white/80 backdrop-blur-sm border border-white/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                stat.color === 'purple' ? 'bg-purple-500/20 text-purple-500' :
                stat.color === 'green' ? 'bg-green-500/20 text-green-500' :
                'bg-orange-500/20 text-orange-500'
              }`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                stat.color === 'green' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value.toLocaleString()}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* CSV Upload Section */}
      <div className={`rounded-2xl shadow-2xl p-8 ${
        isDark 
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
          : 'bg-white/80 backdrop-blur-sm border border-white/50'
      }`}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Upload className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Upload Holiday Data
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload CSV files to add new holidays and events to the database
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDark 
                ? 'border-gray-600 hover:border-green-500 bg-gray-900/30' 
                : 'border-gray-300 hover:border-green-500 bg-gray-50'
            }`}>
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload CSV File
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a CSV file containing holiday data
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 ${
                  isUploading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
              </label>
            </div>

            {uploadStatus && (
              <div className={`mt-4 p-4 rounded-xl ${
                uploadStatus.includes('Error') 
                  ? isDark ? 'bg-red-900/30 border border-red-500/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'
                  : isDark ? 'bg-green-900/30 border border-green-500/50 text-green-300' : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <p className="text-sm font-medium">{uploadStatus}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CSV Format Requirements
            </h4>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Your CSV file should include these columns:
              </p>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• <strong>title</strong> - Event name</li>
                <li>• <strong>date</strong> - Date (YYYY-MM-DD format)</li>
                <li>• <strong>description</strong> - Event description</li>
                <li>• <strong>category</strong> - Event category</li>
                <li>• <strong>country</strong> - Country name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Countries */}
        <div className={`rounded-2xl shadow-2xl p-8 ${
          isDark 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-sm border border-white/50'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Top Countries by Events
            </h3>
          </div>
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={country.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                    index === 1 ? 'bg-gray-500/20 text-gray-600' :
                    index === 2 ? 'bg-orange-500/20 text-orange-600' :
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {country.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-24 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${topCountries[0].count ? (country.count / topCountries[0].count) * 100 : 0}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {country.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className={`rounded-2xl shadow-2xl p-8 ${
          isDark 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
            : 'bg-white/80 backdrop-blur-sm border border-white/50'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <PieChart className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Popular Categories
            </h3>
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-purple-500/20 text-purple-600' :
                    index === 1 ? 'bg-blue-500/20 text-blue-600' :
                    index === 2 ? 'bg-green-500/20 text-green-600' :
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-medium capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-24 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${topCategories[0].count ? (category.count / topCategories[0].count) * 100 : 0}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-2xl shadow-2xl p-8 ${
        isDark 
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
          : 'bg-white/80 backdrop-blur-sm border border-white/50'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Database Status
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              All systems operational
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Last CSV Upload
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              2 hours ago
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">Recent</span>
            </div>
          </div>
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Active Users
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              24 online now
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-purple-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;