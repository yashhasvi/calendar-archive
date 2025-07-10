import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../types';

interface CalendarGridProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isDark: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ events, selectedDate, onDateSelect, isDark }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = useMemo(() => eachDayOfInterval({ start: calendarStart, end: calendarEnd }), [calendarStart, calendarEnd]);

  const getEventsForDate = (date: Date) => events.filter(event => isSameDay(event.date, date));
  const getEventColor = (event: Event) => (event.isPersonal ? (event.color || 'bg-purple-500') : 'bg-blue-500');

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    onDateSelect(today);
  };

  return (
    <div className={`rounded-xl shadow-md p-1 h-[650px] flex flex-col overflow-hidden ${isDark ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' : 'bg-white/80 backdrop-blur-sm border border-white/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center space-x-1">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronLeft className={`h-3 w-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <button onClick={goToToday} className={`px-2 py-1 text-xs font-medium rounded-md ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Today
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className={`p-1 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <ChevronRight className={`h-3 w-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`p-1 text-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{day}</div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 gap-0.5 grid-rows-6 overflow-hidden pb-1 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200'}">
        {calendarDays.map((date) => {
          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isTodayDate = isSameDay(date, new Date());
          return (
            <div
              key={date.toString()}
              className={`min-h-[65px] p-1 border rounded-md cursor-pointer hover:shadow-md ${
                isSelected ? (isDark ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-50 border-blue-300') : (isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white border-gray-200')
              } ${!isCurrentMonth ? 'opacity-50' : ''} ${isTodayDate ? (isDark ? 'ring-1 ring-blue-400' : 'ring-2 ring-blue-500') : ''}`}
              onClick={() => onDateSelect(date)}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`${isTodayDate ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-white' : 'text-gray-900')} ${!isCurrentMonth ? 'text-gray-400' : ''} text-sm font-medium`}>
                  {format(date, 'd')}
                </span>
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className={`p-0.5 rounded text-[8px] text-white truncate ${getEventColor(event)} hover:opacity-90`} title={event.title}>
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && <div className={`text-[8px] text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+{dayEvents.length - 2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;