import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { Calendar as CalendarIcon, Loader2, Info, Plus, Edit, Trash2 } from 'lucide-react'; // <-- NEW
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

// --- Add/Edit Event Modal ---
const AddEventModal = ({ isOpen, onClose, onSuccess, item }) => { // <-- NEW: Added item
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!item; // <-- NEW

  // --- NEW: Populate form if editing ---
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date,
      });
    } else {
      // Reset for 'Add New'
      setFormData({ title: '', description: '', start_date: '', end_date: '' });
    }
  }, [item, isOpen]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // If end_date is not provided, make it same as start_date
    const payload = {
      ...formData,
      end_date: formData.end_date || formData.start_date
    };

    // --- NEW: Use PATCH for edit, POST for create ---
    const promise = isEditing
      ? api.patch(`/events/${item.id}/`, payload)
      : api.post('/events/', payload);

    try {
      await toast.promise(promise, {
        loading: `${isEditing ? 'Updating' : 'Creating'} event...`,
        success: `Event ${isEditing ? 'updated' : 'created'} successfully!`,
        error: (err) => err.response?.data?.detail || 'Failed to save event.'
      });
      
      setFormData({ title: '', description: '', start_date: '', end_date: '' });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Event' : 'Add New Event'}> {/* <-- NEW: Dynamic title */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Event Title" name="title" value={formData.title} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Start Date" name="start_date" value={formData.start_date} onChange={handleChange} type="date" required />
          <FormInput label="End Date (Optional)" name="end_date" value={formData.end_date} onChange={handleChange} type="date" />
        </div>
        <FormTextarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={3} />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : (isEditing ? 'Save Changes' : 'Save Event')} {/* <-- NEW: Dynamic text */}
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
  const [modal, setModal] = useState({ isOpen: false, item: null }); // <-- NEW: Updated state

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

  // --- NEW: Delete Handler ---
  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    const promise = api.delete(`/events/${eventId}/`);
    try {
      await toast.promise(promise, {
        loading: 'Deleting event...',
        success: 'Event deleted.',
        error: 'Failed to delete event.'
      });
      fetchEvents(); // Refetch
    } catch (err) { /* handled by toast */ }
  };

  return (
    <>
      <PageHeader title="Institute Calendar">
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ isOpen: true, item: null })}> {/* <-- NEW */}
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
                  <li key={event.id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="flex items-start gap-4 flex-1">
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
                    </div>
                    {/* --- NEW: Edit/Delete Buttons --- */}
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ isOpen: true, item: event })} className="btn-outline btn-sm">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="btn-outline btn-sm text-destructive hover:bg-destructive/10">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSuccess={fetchEvents}
        item={modal.item} // <-- NEW
      />
    </>
  );
}

export default AdminCalendarPage;