import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Download, CheckCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const ReceiptManagementPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form data
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ student: '', course: '', amount: '', mode: 'cash', remarks: '' });

  const fetchReceipts = async () => {
    try {
      const res = await api.get('/finance/receipts/');
      setReceipts(res.data.results || []);
    } catch (error) {
      toast.error('Failed to load receipts');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  const openModal = async () => {
      // Load active students for dropdown
      const res = await api.get('/students/?active=true');
      setStudents(res.data.results || []);
      setIsModalOpen(true);
  };

  const handleStudentChange = async (e) => {
      const studentId = e.target.value;
      setFormData({...formData, student: studentId, course: ''});
      if(studentId) {
          // Load enrollments for selected student to populate Course dropdown
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
          setFormData({ student: '', course: '', amount: '', mode: 'cash', remarks: '' });
      } catch (error) {
          toast.error('Failed to create receipt');
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

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Fee Receipts</h2>
        <button onClick={openModal} className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg">
            <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : receipts.map(receipt => (
            <div key={receipt.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-900">{receipt.student_name}</p>
                        <p className="text-xs text-gray-500">{receipt.course_title}</p>
                    </div>
                    <p className="font-bold text-lg text-green-600">₹{receipt.amount}</p>
                </div>
                <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">{receipt.mode}</span>
                    <div className="flex gap-2">
                        <button onClick={() => handleDownload(receipt.id)} className="text-primary-600 p-1 bg-primary-50 rounded-full">
                            <Download size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Collect Fees">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Student</label>
                <select className="form-input mt-1" value={formData.student} onChange={handleStudentChange} required>
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name} ({s.reg_no})</option>)}
                </select>
            </div>
            
            <div>
                <label className="text-sm font-medium text-gray-700">Course</label>
                <select className="form-input mt-1" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required disabled={!formData.student}>
                    <option value="">Select Course</option>
                    {courses.map(e => <option key={e.course_id} value={e.course_id}>{e.course_title}</option>)}
                </select>
            </div>

            <input type="number" placeholder="Amount (₹)" className="form-input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            
            <select className="form-input" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
            </select>

            <textarea placeholder="Remarks (Optional)" className="form-input" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
            
            <button type="submit" className="w-full btn-primary mt-2">Create Receipt</button>
        </form>
      </Modal>
    </div>
  );
};

export default ReceiptManagementPage;