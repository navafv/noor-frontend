import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Clock, IndianRupee, Edit2, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [formData, setFormData] = useState({ 
    code: '', title: '', duration_weeks: '', total_fees: '', required_attendance_days: '', syllabus: '' 
  });

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

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
        code: course.code,
        title: course.title,
        duration_weeks: course.duration_weeks,
        total_fees: course.total_fees,
        required_attendance_days: course.required_attendance_days || 36,
        syllabus: course.syllabus || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete the course and potentially affect enrollments.")) return;
    try {
        await api.delete(`/courses/${id}/`);
        toast.success("Course deleted");
        fetchCourses();
    } catch (error) {
        toast.error("Failed to delete course");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingCourse) {
            await api.patch(`/courses/${editingCourse.id}/`, formData);
            toast.success('Course updated');
        } else {
            await api.post('/courses/', { ...formData, active: true });
            toast.success('Course added');
        }
        closeModal();
        fetchCourses();
    } catch (error) {
        toast.error(editingCourse ? 'Failed to update' : 'Failed to add course');
    }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({ code: '', title: '', duration_weeks: '', total_fees: '', required_attendance_days: '', syllabus: '' });
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
            <div key={course.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{course.code}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center gap-1"><Clock size={16}/> {course.duration_weeks} Weeks</div>
                    <div className="flex items-center gap-1"><IndianRupee size={16}/> {course.total_fees}</div>
                </div>
                <p className="text-xs text-gray-400">Req. Attendance: {course.required_attendance_days} days</p>
                
                {course.syllabus && (
                    <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 line-clamp-2">
                        {course.syllabus}
                    </div>
                )}

                <div className="flex gap-2 mt-4 pt-2 justify-end">
                    <button onClick={() => handleEdit(course)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(course.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? "Edit Course" : "Add New Course"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Code (e.g. D3)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                <input required placeholder="Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Weeks" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.duration_weeks} onChange={e => setFormData({...formData, duration_weeks: e.target.value})} />
                <input required type="number" placeholder="Fees (₹)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.total_fees} onChange={e => setFormData({...formData, total_fees: e.target.value})} />
            </div>
            <input required type="number" placeholder="Required Attendance Days" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.required_attendance_days} onChange={e => setFormData({...formData, required_attendance_days: e.target.value})} />
            
            <textarea placeholder="Syllabus / Description" className="w-full p-3 rounded-xl border border-gray-200 outline-none" rows="3" value={formData.syllabus} onChange={e => setFormData({...formData, syllabus: e.target.value})} />

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-primary-700">
                {editingCourse ? "Update Course" : "Save Course"}
            </button>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManagementPage;