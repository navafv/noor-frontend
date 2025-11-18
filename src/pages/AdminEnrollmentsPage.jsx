import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, BookOpen, Check, X, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, completed, dropped, all

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const res = await api.get('/enrollments/', { params });
      setEnrollments(res.data.results || []);
    } catch (error) {
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, [filter]);

  const updateStatus = async (id, newStatus) => {
    if (!confirm(`Mark this enrollment as ${newStatus}?`)) return;
    try {
        await api.patch(`/enrollments/${id}/`, { status: newStatus });
        toast.success("Status updated");
        fetchEnrollments();
    } catch(e) { toast.error("Update failed"); }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="sticky top-0 bg-gray-50 pt-2 pb-2 z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enrollments</h2>
        
        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
            {['active', 'completed', 'dropped', 'all'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400 py-8">Loading...</p> : 
         enrollments.length === 0 ? <p className="text-center text-gray-400 py-8">No enrollments found.</p> :
         enrollments.map(enroll => (
            <div key={enroll.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-full font-bold text-sm">
                            {enroll.student_name ? enroll.student_name[0] : 'S'}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{enroll.student_name || 'Unknown Student'}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <BookOpen size={12} /> {enroll.course_title}
                            </p>
                        </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        enroll.status === 'active' ? 'bg-green-100 text-green-700' : 
                        enroll.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {enroll.status}
                    </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-xs text-gray-600 mt-2">
                    <span>Joined: {enroll.enrolled_on}</span>
                    <span>Attendance: <strong>{enroll.present_days}/{enroll.required_days}</strong></span>
                </div>

                {enroll.status === 'active' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                        <button onClick={() => updateStatus(enroll.id, 'completed')} className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-bold hover:bg-green-100 flex justify-center items-center gap-1">
                            <Check size={14}/> Complete
                        </button>
                        <button onClick={() => updateStatus(enroll.id, 'dropped')} className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg text-xs font-bold hover:bg-red-100 flex justify-center items-center gap-1">
                            <X size={14}/> Drop
                        </button>
                    </div>
                )}
            </div>
         ))}
      </div>
    </div>
  );
};

export default AdminEnrollmentsPage;