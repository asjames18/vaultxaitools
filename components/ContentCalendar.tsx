'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Edit3, Eye, EyeOff, TrendingUp, Target, Link, FileText } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'blog' | 'tool-update' | 'news' | 'guide' | 'review';
  status: 'scheduled' | 'published' | 'draft' | 'review';
  publishDate: string;
  publishTime: string;
  author: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  excerpt: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  endDate?: string;
}

interface ContentCalendarProps {
  events: CalendarEvent[];
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete?: (id: string) => void;
  onEventPublish?: (id: string) => void;
  onEventSchedule?: (id: string, publishDate: string, publishTime: string) => void;
}

export default function ContentCalendar({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventPublish,
  onEventSchedule
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateForm, setShowForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const eventTypes = [
    { id: 'blog', name: 'Blog Post', icon: FileText, color: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
    { id: 'tool-update', name: 'Tool Update', icon: TrendingUp, color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    { id: 'news', name: 'News', icon: Target, color: 'bg-purple-500/20 text-purple-600 border-purple-500/30' },
    { id: 'guide', name: 'Guide', icon: FileText, color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
    { id: 'review', name: 'Review', icon: Eye, color: 'bg-orange-500/20 text-orange-600 border-orange-500/30' }
  ];

  const getTypeColor = (typeId: string) => {
    return eventTypes.find(t => t.id === typeId)?.color || 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  };

  const getTypeName = (typeId: string) => {
    return eventTypes.find(t => t.id === typeId)?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.publishDate).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    
    return week;
  };

  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    setShowForm(false);
  };

  const handleScheduleEvent = (eventId: string, publishDate: string, publishTime: string) => {
    if (onEventSchedule) {
      onEventSchedule(eventId, publishDate, publishTime);
    }
    setShowScheduleForm(null);
  };

  const renderMonthView = () => {
    const days = getMonthDays(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-white/60 text-center text-sm font-medium p-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day && day.getMonth() === currentDate.getMonth();

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-white/10 ${
                  isToday ? 'bg-blue-500/20 border-blue-500/30' : ''
                } ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                {day && (
                  <>
                    <div className="text-white/80 text-sm font-medium mb-1">
                      {day.getDate()}
                    </div>
                    
                    {/* Events for this day */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer transition-all hover:opacity-80 ${getTypeColor(event.type)}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{formatTime(event.publishTime)}</div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-white/60 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Week of {weekRange}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Previous Week
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Next Week
            </button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-1">
          {/* Time column */}
          <div className="text-white/60 text-sm font-medium p-2">Time</div>
          
          {/* Day columns */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="text-white/60 text-sm font-medium p-2 text-center">
              <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-xs">{day.getDate()}</div>
            </div>
          ))}

          {/* Time slots */}
          {Array.from({ length: 24 }, (_, hour) => (
            <React.Fragment key={hour}>
              <div className="text-white/40 text-xs p-1 border-t border-white/10">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day).filter(event => {
                  const eventHour = parseInt(event.publishTime.split(':')[0]);
                  return eventHour === hour;
                });

                return (
                  <div key={day.toISOString()} className="min-h-[60px] p-1 border-t border-white/10">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded cursor-pointer transition-all hover:opacity-80 ${getTypeColor(event.type)}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.author}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const dayName = currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{dayName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 1);
                setCurrentDate(newDate);
              }}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Previous Day
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 1);
                setCurrentDate(newDate);
              }}
              className="px-3 py-1 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
            >
              Next Day
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {dayEvents.length > 0 ? (
            dayEvents
              .sort((a, b) => a.publishTime.localeCompare(b.publishTime))
              .map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-white/40 ${getTypeColor(event.type)}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{event.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">{formatTime(event.publishTime)}</div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-2">{event.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>By: {event.author}</span>
                    <span>Category: {event.category}</span>
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <div className="text-white/50 text-lg mb-2">No events scheduled</div>
              <div className="text-white/40 text-sm">Schedule content for this day to see it here</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
          <p className="text-white/70">Schedule and manage content publishing</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Schedule Content
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { id: 'month', label: 'Month', icon: Calendar },
            { id: 'week', label: 'Week', icon: Clock },
            { id: 'day', label: 'Day', icon: Eye }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === view.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Types</option>
            {eventTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
          </select>

          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents
            .filter(event => new Date(event.publishDate) > new Date())
            .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
            .slice(0, 6)
            .map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {getTypeName(event.type)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <h4 className="text-white font-medium mb-2 line-clamp-2">{event.title}</h4>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">{event.excerpt}</p>
                
                <div className="flex items-center justify-between text-white/60 text-xs">
                  <span>By: {event.author}</span>
                  <span>{formatDate(event.publishDate)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-white/80">
                <div><strong>Type:</strong> {getTypeName(selectedEvent.type)}</div>
                <div><strong>Status:</strong> {selectedEvent.status}</div>
                <div><strong>Priority:</strong> {selectedEvent.priority}</div>
                <div><strong>Author:</strong> {selectedEvent.author}</div>
                <div><strong>Category:</strong> {selectedEvent.category}</div>
                <div><strong>Publish Date:</strong> {formatDate(selectedEvent.publishDate)}</div>
                <div><strong>Publish Time:</strong> {formatTime(selectedEvent.publishTime)}</div>
                <div><strong>Excerpt:</strong> {selectedEvent.excerpt}</div>
                {selectedEvent.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowScheduleForm(selectedEvent.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Reschedule
                </button>
                {selectedEvent.status === 'scheduled' && (
                  <button
                    onClick={() => {
                      if (onEventPublish) onEventPublish(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Publish Now
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onEventDelete) onEventDelete(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Reschedule Content</h3>
                <button
                  onClick={() => setShowScheduleForm(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const publishDate = formData.get('publishDate') as string;
                const publishTime = formData.get('publishTime') as string;
                handleScheduleEvent(showScheduleForm, publishDate, publishTime);
              }} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Publish Time
                  </label>
                  <input
                    type="time"
                    name="publishTime"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Update Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(null)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
