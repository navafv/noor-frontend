import React, { useState, useEffect } from 'react';
import api from '@/services/api.js';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';

function StudentCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Hits the public /api/v1/events/ endpoint
        const res = await api.get('/events/');
        setEvents(res.data.results || []);
      } catch (err) {
        setError('Failed to load institute calendar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC' // Dates from backend are not timezone-aware
    });
  };

  return (
    <>
      <PageHeader title="Institute Calendar" />
      
      <div className="p-4 max-w-lg mx-auto">
        {error && <p className="form-error mb-4">{error}</p>}
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : events.length === 0 ? (
          <div className="card text-center p-10 text-muted-foreground">
            <Calendar size={40} className="mx-auto" />
            <p className="mt-4 font-semibold">No upcoming events</p>
            <p className="text-sm mt-1">
              There are no holidays or events scheduled at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="card p-4">
                <p className="text-sm font-semibold text-primary">
                  {formatDate(event.start_date)}
                  {event.end_date && event.end_date !== event.start_date && (
                    ` - ${formatDate(event.end_date)}`
                  )}
                </p>
                <h3 className="text-lg font-bold text-foreground mt-1">{event.title}</h3>
                {event.description && (
                  <p className="text-muted-foreground text-sm mt-2">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentCalendarPage;