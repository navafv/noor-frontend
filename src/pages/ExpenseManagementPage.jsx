import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Calendar, TrendingDown, Trash2, Paperclip } from 'lucide-react';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

const ExpenseManagementPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'other', amount: '', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [image, setImage] = useState(null);

  const categories = [
    { id: 'rent', label: 'Rent' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'salary', label: 'Salary' },
    { id: 'materials', label: 'Materials' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'other', label: 'Other' },
  ];

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/finance/expenses/');
      setExpenses(res.data.results || []);
    } catch (error) { toast.error("Failed to load expenses"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('receipt_image', image);

    try {
      await api.post('/finance/expenses/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Expense recorded');
      setIsModalOpen(false);
      fetchExpenses();
      setFormData({ title: '', category: 'other', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
      setImage(null);
    } catch (error) { toast.error("Failed to save"); }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-red-700">
            <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : expenses.map(expense => (
            <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl"><TrendingDown size={20}/></div>
                        <div>
                            <p className="font-bold text-gray-900">{expense.title}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{expense.category}</p>
                        </div>
                    </div>
                    <p className="font-bold text-lg text-red-600">-₹{expense.amount}</p>
                </div>
                {expense.description && <p className="text-sm text-gray-500 mt-2 ml-12 bg-gray-50 p-2 rounded-lg">{expense.description}</p>}
                <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-2 ml-12">
                    <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={12} />{expense.date}</div>
                    <div className="flex gap-2">
                        {expense.receipt_image && <a href={expense.receipt_image} target="_blank" rel="noopener noreferrer" className="text-blue-500"><Paperclip size={16}/></a>}
                    </div>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Expense Title" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <select className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <input required type="number" placeholder="Amount (₹)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <input type="date" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            <textarea placeholder="Description" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="border border-dashed border-gray-300 rounded-xl p-4">
                <label className="block text-sm text-gray-500 mb-2">Upload Receipt (Optional)</label>
                <input type="file" className="text-sm text-gray-500 w-full" onChange={e => setImage(e.target.files[0])} />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-red-700">Record Expense</button>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseManagementPage;