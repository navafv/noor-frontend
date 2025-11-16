import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { Calendar as CalendarIcon, Loader2, Info } from 'lucide-react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function StudentCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Backend filters to only show upcoming events for students
        const res = await api.get('/events/');
        setEvents(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        toast.error('Failed to load institute calendar.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <PageHeader title="Institute Calendar" />
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Upcoming Events & Holidays
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : events.length > 0 ? (
              <ul className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {/* Show date range if start and end are different */}
                        {formatDate(event.start_date)}
                        {event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming events or holidays are scheduled.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default StudentCalendarPage;