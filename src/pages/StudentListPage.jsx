import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', password: '',
    email: '', phone: '', guardian_name: '', guardian_phone: '', address: ''
  });

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students/');
      setStudents(res.data.results || []);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_payload: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        guardian_name: formData.guardian_name,
        guardian_phone: formData.guardian_phone,
        address: formData.address,
        active: true
      };
      
      await api.post('/students/', payload);
      toast.success('Student created successfully');
      setIsModalOpen(false);
      fetchStudents();
      setFormData({
        first_name: '', last_name: '', username: '', password: '',
        email: '', phone: '', guardian_name: '', guardian_phone: '', address: ''
      });
    } catch (error) {
      toast.error('Failed to create student. Check inputs.');
    }
  };

  const filteredStudents = students.filter(s => 
    s.user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    s.reg_no?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10 space-y-3">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-gray-900">Students</h2>
           <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg">
             <Plus size={24} />
           </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search name or Reg No..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-20">
        {loading ? <div className="text-center text-gray-400 py-10">Loading...</div> : 
         filteredStudents.length === 0 ? <div className="text-center text-gray-400 py-10">No students found</div> :
         filteredStudents.map((student) => (
          <Link to={`/admin/students/${student.id}`} key={student.id} className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                  {student.user.first_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.user.first_name} {student.user.last_name}</h3>
                  <p className="text-xs text-gray-500">{student.reg_no || 'Pending Reg'}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
          </Link>
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Student">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" className="form-input" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            <input required placeholder="Last Name" className="form-input" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <input required placeholder="Username (Login ID)" className="form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          <input required type="password" placeholder="Password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <input type="email" placeholder="Email (Optional)" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input required placeholder="Phone" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">Guardian Info</p>
            <input required placeholder="Guardian Name" className="form-input mb-3" value={formData.guardian_name} onChange={e => setFormData({...formData, guardian_name: e.target.value})} />
            <input required placeholder="Guardian Phone" className="form-input" value={formData.guardian_phone} onChange={e => setFormData({...formData, guardian_phone: e.target.value})} />
          </div>
          <button type="submit" className="w-full btn-primary mt-4">Create Student</button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentListPage;