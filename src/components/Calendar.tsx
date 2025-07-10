import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Event } from '../types';

interface CalendarProps {
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  selectedDate: Date;
  onAddEvent?: (date: Date) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateClick,
  onEventClick,
  selectedDate,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventColor = (event: Event) => {
    if (event.isPersonal) {
      return event.color || 'bg-purple-500';
    }
    return 'bg-blue-500';
  };

  const handleDateClick = (date: Date) => {
    onDateClick(date);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date) => {
          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isTodayDate = isToday(date);
          const isHovered = hoveredDate && isSameDay(date, hoveredDate);

          return (
            <div
              key={date.toString()}
              className={`
                min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer
                transition-all duration-200 hover:shadow-md
                ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}
                ${!isCurrentMonth ? 'opacity-50' : ''}
                ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-medium
                  ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}
                  ${!isCurrentMonth ? 'text-gray-400' : ''}
                `}>
                  {format(date, 'd')}
                </span>
                {currentUser && onAddEvent && (isSelected || isHovered) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddEvent(date);
                    }}
                    className="opacity-0 hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-blue-100"
                  >
                    <Plus className="h-3 w-3 text-blue-600" />
                  </button>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      group relative p-1 rounded text-xs text-white truncate cursor-pointer
                      ${getEventColor(event)} hover:opacity-90 transition-opacity duration-200
                    `}
                    onClick={(e) => handleEventClick(event, e)}
                    title={event.title}
                  >
                    <span className="truncate">{event.title}</span>
                    {event.isPersonal && currentUser && (
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                        {onEditEvent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent(event);
                            }}
                            className="p-1 rounded hover:bg-white hover:bg-opacity-20"
                          >
                            <Edit2 className="h-2 w-2" />
                          </button>
                        )}
                        {onDeleteEvent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(event);
                            }}
                            className="p-1 rounded hover:bg-white hover:bg-opacity-20"
                          >
                            <Trash2 className="h-2 w-2" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;