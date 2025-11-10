/*
 * UPDATED FILE: src/pages/ExpenseManagementPage.jsx
 *
 * FIX: The ExpenseForm sub-component now correctly sends 'description'
 * instead of 'notes' to match the backend API.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, DollarSign } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import PageHeader from '@/components/PageHeader.jsx';

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
      const res = await api.get('/finance/expenses/'); // FIX: Corrected endpoint
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
    <div className="flex h-full flex-col">
      <PageHeader title="Manage Expenses" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-2xl">

          {/* Total */}
          <div className="mb-4 card p-4">
            <p className="text-sm text-muted-foreground">Total Expenses Logged</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Log New Expense
            </button>
          </div>


          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}

          {!loading && (
            <div className="card">
              <ul className="divide-y divide-border">
                {expenses.length === 0 ? (
                  <p className="p-10 text-center text-muted-foreground">No expenses logged yet.</p>
                ) : (
                  expenses.map(expense => (
                    <li key={expense.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">{expense.category || 'General'}</p>
                        <p className="text-xs text-muted-foreground">
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
    description: '', // <-- FIX: Changed from 'notes'
    amount: '',
    category: 'other',
    date: getTodayDate(),
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
      // FIX: Send 'description', not 'notes'
      await api.post('/finance/expenses/', { // FIX: Corrected endpoint
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
      });
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
      
      <div>
        <label htmlFor="description" className="form-label">Description</label> {/* <-- FIX: Changed from 'Notes' */}
        <input
          type="text" name="description" id="description" // <-- FIX: Changed from 'notes'
          value={formData.description} onChange={handleChange} // <-- FIX: Changed from 'notes'
          className="form-input" required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            type="number" name="amount" id="amount"
            value={formData.amount} onChange={handleChange}
            className="form-input" required step="0.01"
          />
        </div>
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          {/* This select matches the backend CATEGORY_CHOICES */}
          <select
            name="category" id="category"
            value={formData.category} onChange={handleChange}
            className="form-input" required
          >
            <option value="material">Material</option>
            <option value="maintenance">Maintenance</option>
            <option value="salary">Salary</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="date" className="form-label">Date</label>
        <input
          type="date" name="date" id="date"
          value={formData.date} onChange={handleChange}
          className="form-input" required
        />
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Expense'}
      </button>
    </form>
  );
}

export default ExpenseManagementPage;