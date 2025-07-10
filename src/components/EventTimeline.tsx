import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Event } from '../types';

interface EventTimelineProps {
  events: Event[];
  isDark: boolean;
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events, isDark }) => {
  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 20);

  return (
    <div className={`rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
        : 'bg-white/80 backdrop-blur-sm border border-white/50'
    }`}>
      <div className="flex items-center space-x-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
        }`}>
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upcoming Events Timeline
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Next {upcomingEvents.length} events in chronological order
          </p>
        </div>
      </div>
      
      <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
        {upcomingEvents.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-6">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full shadow-lg ${
                event.isPersonal 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`} />
              {index < upcomingEvents.length - 1 && (
                <div className={`w-0.5 h-12 mt-2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              )}
            </div>
            
            <div className={`flex-1 min-w-0 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              event.isPersonal 
                ? isDark
                  ? 'bg-gradient-to-r from-purple-900/20 to-purple-800/10 hover:from-purple-900/30 hover:to-purple-800/20'
                  : 'bg-gradient-to-r from-purple-50 to-purple-25 hover:from-purple-100 hover:to-purple-50'
                : isDark
                  ? 'bg-gradient-to-r from-blue-900/20 to-blue-800/10 hover:from-blue-900/30 hover:to-blue-800/20'
                  : 'bg-gradient-to-r from-blue-50 to-blue-25 hover:from-blue-100 hover:to-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </h4>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {format(event.date, 'MMM d')}
                </span>
              </div>
              
              {event.description && (
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {event.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`capitalize font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {event.category}
                  </span>
                </div>
                {event.country && (
                  <div className="flex items-center space-x-2">
                    <MapPin className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {event.country}
                    </span>
                  </div>
                )}
                {event.isPersonal && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                  }`}>
                    Personal
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#374151' : '#f1f5f9'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#6b7280' : '#cbd5e1'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#9ca3af' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
};

export default EventTimeline;