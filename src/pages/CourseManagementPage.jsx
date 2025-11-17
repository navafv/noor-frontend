import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Clock, IndianRupee } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', title: '', duration_weeks: '', total_fees: '' });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/');
      setCourses(res.data.results || []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await api.post('/courses/', { ...formData, active: true });
        toast.success('Course added');
        setIsModalOpen(false);
        fetchCourses();
        setFormData({ code: '', title: '', duration_weeks: '', total_fees: '' });
    } catch (error) {
        toast.error('Failed to add course');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700">
            <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : courses.map(course => (
            <div key={course.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{course.code}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Clock size={16}/> {course.duration_weeks} Weeks</div>
                    <div className="flex items-center gap-1"><IndianRupee size={16}/> {course.total_fees}</div>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Course Code (e.g. D3)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            <input required placeholder="Course Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Weeks" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.duration_weeks} onChange={e => setFormData({...formData, duration_weeks: e.target.value})} />
                <input required type="number" placeholder="Fees (₹)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.total_fees} onChange={e => setFormData({...formData, total_fees: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-primary-700">Save Course</button>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManagementPage;