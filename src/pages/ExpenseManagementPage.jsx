import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, DollarSign } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function ExpenseManagementPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses/');
      setExpenses(res.data.results || []);
    } catch (err) {
      setError('Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((acc, ex) => acc + parseFloat(ex.amount), 0);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link to="/admin/dashboard" className="flex items-center gap-1 text-noor-pink">
            <ChevronLeft size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <h1 className="text-lg font-semibold text-noor-heading">Manage Expenses</h1>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary p-2">
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">

          {/* Total */}
          <div className="mb-4 bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total Expenses Logged</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin text-noor-pink" size={32} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}

          {!loading && (
            <div className="bg-white rounded-xl shadow-sm">
              <ul className="divide-y divide-gray-200">
                {expenses.length === 0 ? (
                  <p className="p-10 text-center text-gray-500">No expenses logged yet.</p>
                ) : (
                  expenses.map(expense => (
                    <li key={expense.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-noor-heading">{expense.name}</p>
                        <p className="text-sm text-gray-500">{expense.category || 'General'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-red-500">
                        -₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Expense">
        <ExpenseForm 
          onClose={() => setIsModalOpen(false)} 
          onSaved={() => {
            fetchExpenses(); // Refresh list after saving
            setIsModalOpen(false);
          }} 
        />
      </Modal>
    </div>
  );
}

// Form component for the modal
function ExpenseForm({ onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: getTodayDate(),
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/expenses/', formData);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="form-label">Expense Name</label>
          <input
            type="text" name="name" id="name"
            value={formData.name} onChange={handleChange}
            className="form-input" required
          />
        </div>
        <div>
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            type="number" name="amount" id="amount"
            value={formData.amount} onChange={handleChange}
            className="form-input" required step="0.01"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text" name="category" id="category"
            value={formData.category} onChange={handleChange}
            className="form-input" placeholder="e.g., Rent, Materials"
          />
        </div>
        <div>
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date" name="date" id="date"
            value={formData.date} onChange={handleChange}
            className="form-input" required
          />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea
          name="notes" id="notes"
          value={formData.notes} onChange={handleChange}
          className="form-input" rows="2"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Expense'}
      </button>
    </form>
  );
}

export default ExpenseManagementPage;