import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('active'); // active, inactive, all
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', password: '',
    email: '', phone: '', guardian_name: '', guardian_phone: '', address: ''
  });

  const fetchStudents = async (url, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    try {
      const res = await api.get(url);
      if (isLoadMore) {
          setStudents(prev => [...prev, ...(res.data.results || [])]);
      } else {
          setStudents(res.data.results || []);
      }
      setNextPage(res.data.next);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { 
      // Build query based on filter
      let params = '';
      if (filter === 'active') params = '?active=true';
      if (filter === 'inactive') params = '?active=false';
      
      fetchStudents(`/students/${params}`); 
  }, [filter]);

  const handleLoadMore = () => {
      if (nextPage) {
          setLoadingMore(true);
          fetchStudents(nextPage, true);
      }
  }

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
      // Refresh list
      const params = filter === 'active' ? '?active=true' : ''; 
      fetchStudents(`/students/${params}`);
      setFormData({ first_name: '', last_name: '', username: '', password: '', email: '', phone: '', guardian_name: '', guardian_phone: '', address: '' });
    } catch (error) {
      toast.error('Failed to create student. Check inputs.');
    }
  };

  const filteredStudents = students.filter(s => {
    const name = s.user?.first_name?.toLowerCase() || '';
    const reg = s.reg_no?.toLowerCase() || '';
    const query = search.toLowerCase();
    return name.includes(query) || reg.includes(query);
  });

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10 space-y-3">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-gray-900">Students</h2>
           <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700">
             <Plus size={24} />
           </button>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {['active', 'inactive', 'all'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {f}
                </button>
            ))}
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

      <div className="space-y-3 pb-20">
        {loading ? <div className="text-center text-gray-400 py-10">Loading...</div> : 
         filteredStudents.length === 0 ? <div className="text-center text-gray-400 py-10">No students found</div> :
         <>
            {filteredStudents.map((student) => (
            <Link to={`/admin/students/${student.id}`} key={student.id} className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg overflow-hidden border-2 border-white shadow-sm">
                        {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" alt="" />
                        ) : (
                            student.user?.first_name?.[0] || 'S'
                        )}
                    </div>
                    <div>
                    <h3 className="font-bold text-gray-900">{student.user?.first_name} {student.user?.last_name}</h3>
                    <p className="text-xs text-gray-500">{student.reg_no || 'Pending Reg'}</p>
                    </div>
                </div>
                <ChevronRight className="text-gray-300" />
                </div>
            </Link>
            ))}
            
            {nextPage && !search && (
                <button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    className="w-full py-3 text-sm font-semibold text-primary-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {loadingMore && <Loader2 size={16} className="animate-spin" />}
                    Load More Students
                </button>
            )}
         </>
        }
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Student">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            <input required placeholder="Last Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <input required placeholder="Username" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
          <input required type="password" placeholder="Password" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <input required placeholder="Phone" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-xs text-gray-400 uppercase mb-2 font-semibold">Guardian Info</p>
            <input required placeholder="Guardian Name" className="w-full p-3 rounded-xl border border-gray-200 outline-none mb-3" value={formData.guardian_name} onChange={e => setFormData({...formData, guardian_name: e.target.value})} />
            <input required placeholder="Guardian Phone" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.guardian_phone} onChange={e => setFormData({...formData, guardian_phone: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors mt-4 cursor-pointer">Create Student</button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentListPage;