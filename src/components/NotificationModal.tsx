import React, { useState } from 'react';
import { X, Send, Users, MessageSquare } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, type: 'all' | 'users') => void;
  isDark: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onSend, isDark }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'all' | 'users'>('all');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await onSend(message, type);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full border ${
        isDark 
          ? 'bg-gray-800/95 backdrop-blur-md border-gray-700/50' 
          : 'bg-white/95 backdrop-blur-md border-gray-200/50'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600'
            }`}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Send Notification
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Send to
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setType('all')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  type === 'all'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                    : isDark 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500' 
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">All Users</span>
              </button>
              <button
                type="button"
                onClick={() => setType('users')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  type === 'users'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                    : isDark 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500' 
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">Registered Only</span>
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 resize-none ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              placeholder="Enter your notification message..."
              required
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              This message will be sent to {type === 'all' ? 'all users including guests' : 'registered users only'}
            </p>
          </div>

          <div className={`flex items-center justify-end space-x-3 pt-4 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send Notification</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;