import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Calendar } from 'lucide-react'; // Removed Google import
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin, setGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setErrors({ general: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      navigate('/');
    } catch (error: any) {
      setErrors({ general: error.message || 'Google login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    setGuestMode(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
          <Calendar className="h-12 w-12 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100">Sign in to your Calendar Archive account</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {errors.general && <div className="bg-red-50 border border-red-200 rounded-md p-3"><p className="text-sm text-red-600">{errors.general}</p></div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
            <span>Sign in with Google</span> {/* Removed Google icon */}
          </button>
          <div className="text-center"><button type="button" onClick={handleGuestAccess} className="text-sm text-gray-600 hover:text-gray-900 underline hover:no-underline">Continue as Guest</button></div>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Sign up here</Link></p>
            <p className="text-sm"><Link to="/" className="text-gray-600 hover:text-gray-900 underline hover:no-underline">Back to Calendar</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;