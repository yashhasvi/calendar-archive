import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Search,
  Plus
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, isGuest, setGuestMode } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGuestLogin = () => {
    setGuestMode(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Calendar Archive</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600 transition-colors duration-200`}
              >
                Calendar
              </Link>
              <Link
                to="/events"
                className={`${
                  isActive('/events') ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600 transition-colors duration-200`}
              >
                Events
              </Link>
              {currentUser && (
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors duration-200`}
                >
                  Dashboard
                </Link>
              )}
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`${
                    isActive('/admin') ? 'text-blue-600' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Profile Menu */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden sm:block">{currentUser.displayName}</span>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {isGuest ? (
                    <button
                      onClick={handleGuestLogin}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                } block px-3 py-2 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link
                to="/events"
                className={`${
                  isActive('/events') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                } block px-3 py-2 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              {currentUser && (
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  } block px-3 py-2 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`${
                    isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  } block px-3 py-2 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Click outside to close menus */}
      {(isMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;