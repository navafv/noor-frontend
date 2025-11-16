import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { Calendar as CalendarIcon, Loader2, Info, Plus } from 'lucide-react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal.jsx';

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// --- Add Event Modal ---
const AddEventModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // If end_date is not provided, make it same as start_date
    const payload = {
      ...formData,
      end_date: formData.end_date || formData.start_date
    };

    const promise = api.post('/events/', payload);

    try {
      await toast.promise(promise, {
        loading: 'Creating event...',
        success: 'Event created successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to create event.'
      });
      setFormData({ title: '', description: '', start_date: '', end_date: '' });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Event Title" name="title" value={formData.title} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Start Date" name="start_date" value={formData.start_date} onChange={handleChange} type="date" required />
          <FormInput label="End Date (Optional)" name="end_date" value={formData.end_date} onChange={handleChange} type="date" />
        </div>
        <FormTextarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={3} />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Event'}
        </button>
      </form>
    </Modal>
  );
};

// Helper components
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);
const FormTextarea = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <textarea id={props.name} {...props} className="form-input" />
  </div>
);

// --- Main Page Component ---
function AdminCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Admin gets all events (past and future)
      const res = await api.get('/events/');
      setEvents(res.data.results || []);
    } catch (err) {
      toast.error('Failed to load institute calendar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <PageHeader title="Institute Calendar">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Event
        </button>
      </PageHeader>
      
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              All Events & Holidays
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
                        {formatDate(event.start_date)}
                        {event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    {/* TODO: Add Edit/Delete buttons here */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No events or holidays are scheduled.
              </p>
            )}
          </div>
        </div>
      </main>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </>
  );
}

export default AdminCalendarPage;