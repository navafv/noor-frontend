import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Phone, MapPin, User, BookOpen, Plus, Ruler, History, Edit2, Trash2, Camera } from 'lucide-react';
import Modal from '../components/Modal';
import MeasurementForm from '../components/MeasurementForm';
import MeasurementHistoryModal from '../components/MeasurementHistoryModal';
import { toast } from 'react-hot-toast';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  
  // Edit State
  const [editData, setEditData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchData = async () => {
    try {
      const [stuRes, enrollRes] = await Promise.all([
        api.get(`/students/${id}/`),
        api.get(`/enrollments/?student=${id}`)
      ]);
      setStudent(stuRes.data);
      setEnrollments(enrollRes.data.results || []);
      
      // Init edit form data
      setEditData({
        first_name: stuRes.data.user.first_name,
        last_name: stuRes.data.user.last_name,
        email: stuRes.data.user.email,
        phone: stuRes.data.user.phone,
        guardian_name: stuRes.data.guardian_name,
        guardian_phone: stuRes.data.guardian_phone,
        address: stuRes.data.address,
        active: stuRes.data.active
      });
      setPhotoPreview(stuRes.data.photo);
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

  const handleEdit = async (e) => {
      e.preventDefault();
      const toastId = toast.loading("Updating...");
      try {
          // 1. Update Student Profile (Guardian, Address, Active)
          await api.patch(`/students/${id}/`, {
              guardian_name: editData.guardian_name,
              guardian_phone: editData.guardian_phone,
              address: editData.address,
              active: editData.active
          });

          // 2. Update User Profile (Name, Email, Phone)
          if (student.user?.id) {
              await api.patch(`/users/${student.user.id}/`, {
                  first_name: editData.first_name,
                  last_name: editData.last_name,
                  email: editData.email,
                  phone: editData.phone
              });
          }

          // 3. Upload Photo if changed
          if (photoFile) {
              const formData = new FormData();
              formData.append('photo', photoFile);
              await api.patch(`/students/${id}/`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
          }

          toast.success("Profile updated", { id: toastId });
          setIsEditModalOpen(false);
          setPhotoFile(null);
          fetchData();
      } catch (e) {
          console.error(e);
          toast.error("Update failed", { id: toastId });
      }
  };

  const handleDelete = async () => {
      if(!confirm("Are you sure you want to delete this student? This action cannot be undone.")) return;
      try {
          await api.delete(`/students/${id}/`);
          toast.success("Student deleted");
          navigate('/admin/students');
      } catch (e) {
          toast.error("Delete failed. Remove enrollments first?");
      }
  };

  const openEnrollModal = async () => {
    try {
        const res = await api.get('/courses/?active=true');
        setCourses(res.data.results || []);
        setIsEnrollModalOpen(true);
    } catch (e) { toast.error("Could not load courses"); }
  };

  const handlePhotoSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          setPhotoFile(file);
          setPhotoPreview(URL.createObjectURL(file));
      }
  };

  if (loading || !student) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setIsEditModalOpen(true)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-primary-600 cursor-pointer">
                <Edit2 size={16} />
            </button>
            <button onClick={handleDelete} className="p-2 bg-red-50 rounded-full text-red-400 hover:text-red-600 cursor-pointer">
                <Trash2 size={16} />
            </button>
        </div>
        
        <div className="w-24 h-24 rounded-full mb-3 relative border-4 border-primary-50 overflow-hidden">
            {student.photo ? (
                <img src={student.photo} alt="Student" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {student.user?.first_name?.[0] || 'S'}
                </div>
            )}
        </div>

        <h2 className="text-xl font-bold text-gray-900">{student.user?.first_name} {student.user?.last_name}</h2>
        <p className="text-sm text-gray-500 mb-1">{student.reg_no}</p>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {student.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Actions Row */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setIsMeasureModalOpen(true)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-600"><Ruler size={20}/></div>
            <span className="text-xs font-bold text-gray-700">Add Measure</span>
        </button>
        <button onClick={() => setIsHistoryModalOpen(true)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer">
            <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><History size={20}/></div>
            <span className="text-xs font-bold text-gray-700">View History</span>
        </button>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</h3>
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Phone size={18} /></div>
          <div className="flex-1">
              <p className="text-xs text-gray-400">Phone</p>
              <a href={`tel:${student.user?.phone}`} className="font-medium text-primary-600">{student.user?.phone || 'N/A'}</a>
          </div>
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

      {/* Enrollments */}
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

      {/* Modals */}
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

      <Modal isOpen={isMeasureModalOpen} onClose={() => setIsMeasureModalOpen(false)} title="New Measurement">
        <MeasurementForm studentId={id} onSuccess={() => setIsMeasureModalOpen(false)} />
      </Modal>

      <MeasurementHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        studentId={id} 
      />

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student Profile">
          <form onSubmit={handleEdit} className="space-y-4">
              {/* Photo Upload */}
              <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20">
                      <img src={photoPreview || student.photo} className="w-full h-full rounded-full object-cover border border-gray-200" alt="Profile" />
                      <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full cursor-pointer shadow-md">
                          <Camera size={12} />
                          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoSelect} />
                      </label>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <input placeholder="First Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.first_name} onChange={e => setEditData({...editData, first_name: e.target.value})} />
                  <input placeholder="Last Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.last_name} onChange={e => setEditData({...editData, last_name: e.target.value})} />
              </div>
              <input placeholder="Email" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
              <input placeholder="Phone" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
              
              <hr className="border-gray-100" />
              
              <input placeholder="Guardian Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.guardian_name} onChange={e => setEditData({...editData, guardian_name: e.target.value})} />
              <input placeholder="Guardian Phone" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.guardian_phone} onChange={e => setEditData({...editData, guardian_phone: e.target.value})} />
              <textarea placeholder="Address" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} />
              
              <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editData.active} onChange={e => setEditData({...editData, active: e.target.checked})} className="w-5 h-5 accent-primary-600" />
                  <label className="text-sm text-gray-700">Active Student Status</label>
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg cursor-pointer">Save Changes</button>
          </form>
      </Modal>
    </div>
  );
};

export default StudentDetailPage;