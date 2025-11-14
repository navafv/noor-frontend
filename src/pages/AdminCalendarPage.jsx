import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Plus, Trash2 } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx';

function AdminCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/events/');
      setEvents(res.data.results || []);
    } catch (err) {
      setError('Could not load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchEvents(); // Refresh list
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setDeletingId(eventId);
      try {
        await api.delete(`/events/${eventId}/`);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (err) {
        setError('Failed to delete event.');
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', timeZone: 'UTC'
    });
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Manage Calendar" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Event
            </button>
          </div>

          {error && <p className="form-error mx-4">{error}</p>}
          
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          
          {!loading && !error && events.length === 0 && (
            <div className="text-center p-10 card">
              <Calendar size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Events Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click "New Event" to add a holiday or announcement.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {events.map((event) => (
                  <li key={event.id} className="p-4 flex justify-between items-start gap-4">
                    <div className="shrink-0 text-center w-16">
                      <p className="text-xs text-primary font-semibold uppercase">
                        {new Date(event.start_date).toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' })}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatDate(event.start_date)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      {event.end_date && event.end_date !== event.start_date && (
                        <p className="text-xs text-muted-foreground">Ends: {formatDate(event.end_date)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                      className="btn-destructive btn-sm"
                    >
                      {deletingId === event.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <EventForm onSaved={handleSaved} />
      </Modal>
    </div>
  );
}

// --- Form Component for the Modal ---
function EventForm({ onSaved }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Send null if end_date is empty
    const payload = {
      ...formData,
      end_date: formData.end_date || null
    };

    try {
      await api.post('/events/', payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.[0] || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div>
        <label htmlFor="title" className="form-label">Event Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="form-input" required placeholder="e.g., Institute Holiday" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} className="form-input" required />
        </div>
        <div>
          <label htmlFor="end_date" className="form-label">End Date (Optional)</label>
          <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} className="form-input" min={formData.start_date} />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" />
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Event'}
      </button>
    </form>
  );
}

export default AdminCalendarPage;