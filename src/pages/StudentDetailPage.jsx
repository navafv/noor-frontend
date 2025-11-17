import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Phone, MapPin, User, BookOpen, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  const fetchData = async () => {
    try {
      const [stuRes, enrollRes] = await Promise.all([
        api.get(`/students/${id}/`),
        api.get(`/enrollments/?student=${id}`)
      ]);
      setStudent(stuRes.data);
      setEnrollments(enrollRes.data.results || []);
    } catch (error) {
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post('/enrollments/', { student: id, course: selectedCourse });
      toast.success('Enrolled successfully');
      setIsEnrollModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Enrollment failed. Already enrolled?');
    }
  };

  const openEnrollModal = async () => {
    try {
        const res = await api.get('/courses/?active=true');
        setCourses(res.data.results || []);
        setIsEnrollModalOpen(true);
    } catch (e) { toast.error("Could not load courses"); }
  };

  if (loading || !student) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold mb-3">
          {student.user.first_name[0]}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{student.user.first_name} {student.user.last_name}</h2>
        <p className="text-sm text-gray-500 mb-1">{student.reg_no}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {student.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</h3>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Phone size={18} /></div>
          <div><p className="text-xs text-gray-400">Phone</p><p className="font-medium">{student.user.phone}</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><User size={18} /></div>
          <div><p className="text-xs text-gray-400">Guardian</p><p className="font-medium">{student.guardian_name}</p></div>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><MapPin size={18} /></div>
            <div><p className="text-xs text-gray-400">Address</p><p className="font-medium text-sm">{student.address}</p></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-gray-900">Courses</h3>
            <button onClick={openEnrollModal} className="text-primary-600 text-sm font-medium flex items-center gap-1 cursor-pointer">
                <Plus size={16}/> Enroll
            </button>
        </div>
        {enrollments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">Not enrolled in any courses yet.</p>
        ) : (
            enrollments.map(enroll => (
                <div key={enroll.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><BookOpen size={20}/></div>
                        <div>
                            <p className="font-bold text-gray-800">{enroll.course_title}</p>
                            <p className="text-xs text-gray-500">Joined: {enroll.enrolled_on}</p>
                        </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium capitalize ${enroll.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {enroll.status}
                    </span>
                </div>
            ))
        )}
      </div>

      <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title="Enroll Student">
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select Course</label>
            <select 
                className="w-full p-3 rounded-xl border border-gray-200 outline-none bg-white"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
            >
                <option value="">-- Choose a Course --</option>
                {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.duration_weeks} weeks)</option>
                ))}
            </select>
            <button onClick={handleEnroll} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer">Confirm Enrollment</button>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetailPage;