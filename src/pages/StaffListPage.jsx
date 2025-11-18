import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Trash2, Shield, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const StaffListPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', password: '',
    email: '', phone: '', address: ''
  });

  const fetchStaff = async () => {
    try {
      const res = await api.get('/users/?is_staff=true');
      setStaff(res.data.results || []);
    } catch (error) {
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleEdit = (member) => {
      setEditingStaff(member);
      setFormData({
          first_name: member.first_name,
          last_name: member.last_name,
          username: member.username,
          email: member.email,
          phone: member.phone,
          address: member.address,
          password: '' // Leave blank to keep unchanged
      });
      setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, is_staff: true };
    
    // Remove password from payload if empty during edit
    if (editingStaff && !payload.password) {
        delete payload.password;
    }

    try {
      if (editingStaff) {
          await api.patch(`/users/${editingStaff.id}/`, payload);
          toast.success('Staff member updated');
      } else {
          if (!payload.password) {
              toast.error("Password is required for new accounts");
              return;
          }
          await api.post('/users/', payload);
          toast.success('Staff member created');
      }
      closeModal();
      fetchStaff();
    } catch (error) {
      toast.error('Operation failed. Username might be taken.');
    }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingStaff(null);
      setFormData({ first_name: '', last_name: '', username: '', password: '', email: '', phone: '', address: '' });
  };

  const handleDelete = async (id) => {
      if(!confirm("Remove this staff member? They will no longer be able to log in.")) return;
      try {
          await api.delete(`/users/${id}/`);
          toast.success("Staff member removed");
          fetchStaff();
      } catch (e) { toast.error("Delete failed"); }
  };

  const filteredStaff = staff.filter(s => 
    (s.first_name + ' ' + s.last_name).toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700">
            <Plus size={24} />
        </button>
      </div>

      <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search staff..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : 
         filteredStaff.length === 0 ? <p className="text-center text-gray-400">No staff found.</p> :
         filteredStaff.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                        {member.first_name?.[0] || 'A'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-1">
                            {member.first_name} {member.last_name}
                            {member.is_superuser && <Shield size={14} className="text-yellow-500" fill="currentColor"/>}
                        </h3>
                        <p className="text-xs text-gray-500">@{member.username}</p>
                        <p className="text-xs text-gray-400">{member.phone}</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 cursor-pointer">
                        <Edit2 size={18} />
                    </button>
                    {!member.is_superuser && (
                        <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            <input required placeholder="Last Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <input required placeholder="Username" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={!!editingStaff} />
          <input type="password" placeholder={editingStaff ? "New Password (leave empty to keep)" : "Password"} className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <input required placeholder="Email" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input placeholder="Phone" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors cursor-pointer">
              {editingStaff ? "Update Account" : "Create Account"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StaffListPage;