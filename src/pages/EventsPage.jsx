import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Plus, MapPin, Clock, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const EventsPage = () => {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', start_date: '', end_date: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events/', formData);
      toast.success("Event created");
      setIsModalOpen(false);
      setFormData({ title: '', description: '', start_date: '', end_date: '' });
      fetchEvents();
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this event?")) return;
    try {
        await api.delete(`/events/${id}/`);
        toast.success("Event deleted");
        fetchEvents();
    } catch(e) { toast.error("Delete failed"); }
  };

  // Helper to parse YYYY-MM-DD correctly regardless of timezone
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Events & Holidays</h2>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700">
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : 
         events.length === 0 ? <p className="text-center text-gray-400 py-8">No upcoming events.</p> :
         events.map(event => {
            const startDate = parseDate(event.start_date);
            const endDate = event.end_date ? parseDate(event.end_date) : startDate;
            const isPast = endDate < new Date(); // Simple comparison works roughly ok

            return (
                <div key={event.id} className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
                    {/* Date Badge */}
                    <div className="absolute right-0 top-0 bg-primary-50 text-primary-700 px-3 py-2 rounded-bl-2xl font-bold text-xs flex flex-col items-center leading-tight w-16 text-center">
                        <span className="text-lg">{startDate.getDate()}</span>
                        <span className="uppercase">{startDate.toLocaleString('default', { month: 'short' })}</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 pr-16">{event.title}</h3>
                    
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock size={14} className="text-primary-400"/>
                            {event.start_date === event.end_date || !event.end_date 
                                ? 'Single Day' 
                                : `Until ${endDate.toLocaleDateString()}`}
                        </div>
                    </div>

                    {event.description && (
                        <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {event.description}
                        </p>
                    )}

                    {isAdmin && (
                        <button onClick={() => handleDelete(event.id)} className="absolute bottom-4 right-4 text-red-400 hover:text-red-600 p-1 cursor-pointer">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            );
         })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Event">
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Event Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 ml-1">Start Date</label>
                    <input required type="date" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs text-gray-500 ml-1">End Date (Opt)</label>
                    <input type="date" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
            </div>
            <textarea placeholder="Description..." className="w-full p-3 rounded-xl border border-gray-200 outline-none" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-primary-700">Create Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default EventsPage;