import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Download, Trash2, Lock, Loader2, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const ReceiptManagementPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // FIXED: Added 'date' field initialized to today
  const [formData, setFormData] = useState({ 
    student: '', 
    course: '', 
    amount: '', 
    mode: 'cash', 
    date: new Date().toISOString().split('T')[0],
    remarks: '' 
  });

  const fetchReceipts = async (url = '/finance/receipts/') => {
    try {
      const res = await api.get(url);
      if (url === '/finance/receipts/') {
        setReceipts(res.data.results || []);
      } else {
        setReceipts(prev => [...prev, ...(res.data.results || [])]);
      }
      setNextPage(res.data.next);
    } catch (error) {
      toast.error('Failed to load receipts');
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoadingMore(true);
      fetchReceipts(nextPage);
    }
  };

  const openModal = async () => {
      const res = await api.get('/students/?active=true');
      setStudents(res.data.results || []);
      setIsModalOpen(true);
  };

  const handleStudentChange = async (e) => {
      const studentId = e.target.value;
      setFormData({...formData, student: studentId, course: ''});
      if(studentId) {
          const res = await api.get(`/enrollments/?student=${studentId}&status=active`);
          setCourses(res.data.results || []);
      } else {
          setCourses([]);
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/finance/receipts/', formData);
          toast.success('Receipt created');
          setIsModalOpen(false);
          fetchReceipts(); 
          // Reset form
          setFormData({ 
              student: '', 
              course: '', 
              amount: '', 
              mode: 'cash', 
              date: new Date().toISOString().split('T')[0],
              remarks: '' 
          });
      } catch (error) {
          console.error(error);
          toast.error('Failed to create receipt. Check inputs.');
      }
  };

  const handleDownload = async (id) => {
      try {
          const response = await api.get(`/finance/receipts/${id}/download/`, { responseType: 'blob' });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Receipt_${id}.pdf`);
          document.body.appendChild(link);
          link.click();
      } catch (e) {
          toast.error("Download failed");
      }
  };

  const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this receipt?")) return;
      try {
          await api.delete(`/finance/receipts/${id}/`);
          toast.success("Receipt deleted");
          fetchReceipts();
      } catch (e) {
          toast.error("Could not delete (Receipt might be locked)");
      }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Fee Receipts</h2>
        <button onClick={openModal} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-700">
            <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : 
         <>
            {receipts.map(receipt => (
                <div key={receipt.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-900">{receipt.student_name}</p>
                            <p className="text-xs text-gray-500">{receipt.course_title}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <Calendar size={10} /> {receipt.date}
                            </p>
                        </div>
                        <p className="font-bold text-lg text-green-600">₹{receipt.amount}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">
                        <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">{receipt.mode}</span>
                            {receipt.locked && <Lock size={14} className="text-gray-400"/>}
                        </div>
                        <div className="flex gap-2">
                            {!receipt.locked && (
                                <button onClick={() => handleDelete(receipt.id)} className="text-red-500 p-1 hover:bg-red-50 rounded-full cursor-pointer">
                                    <Trash2 size={18} />
                                </button>
                            )}
                            <button onClick={() => handleDownload(receipt.id)} className="text-primary-600 p-1 bg-primary-50 rounded-full cursor-pointer hover:bg-primary-100">
                                <Download size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {nextPage && (
                <button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    className="w-full py-3 text-sm font-semibold text-primary-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {loadingMore && <Loader2 size={16} className="animate-spin" />}
                    Load More Receipts
                </button>
            )}
         </>
        }
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Collect Fees">
        <form onSubmit={handleSubmit} className="space-y-4">
            <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none" value={formData.student} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name}</option>)}
            </select>
            
            <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required disabled={!formData.student}>
                <option value="">Select Course</option>
                {courses.map(e => <option key={e.course_id} value={e.course_id}>{e.course_title}</option>)}
            </select>

            {/* FIXED: Added Date Input */}
            <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Amount (₹)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                <input type="date" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            
            <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
            </select>

            <textarea placeholder="Remarks (Optional)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />

            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-primary-700">Create Receipt</button>
        </form>
      </Modal>
    </div>
  );
};

export default ReceiptManagementPage;