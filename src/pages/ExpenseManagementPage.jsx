import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, DollarSign, Tag } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Helper to format currency
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// --- Add Expense Modal ---
const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'other',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = api.post('/finance/expenses/', {
      ...formData,
      amount: parseFloat(formData.amount)
    });

    try {
      await toast.promise(promise, {
        loading: 'Adding expense...',
        success: 'Expense added successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to add expense.'
      });
      setFormData({ description: '', category: 'other', amount: '' }); // Reset form
      onSuccess(); // Triggers refetch on parent page
      onClose(); // Closes modal
    } catch (err) {
      // Error is already toasted
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="material">Material</option>
              <option value="maintenance">Maintenance</option>
              <option value="salary">Salary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- Main Page Component ---
function ExpenseManagementPage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state (can be implemented later)
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Fetch expenses and summary in parallel
      const [expenseRes, summaryRes] = await Promise.all([
        api.get('/finance/expenses/'),
        api.get('/finance/analytics/summary/')
      ]);
      
      setExpenses(expenseRes.data.results || []);
      setSummary(summaryRes.data);
      // setTotalPages(Math.ceil(expenseRes.data.count / 20));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load expense data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []); // Add 'page' to dependency array later for pagination

  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const category = exp.category || 'other';
      acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});
  }, [expenses]);

  return (
    <>
      <PageHeader title="Expense Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Expense
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          {loading && !summary && <Loader2 className="animate-spin text-primary" />}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard title="Total Expenses" value={formatCurrency(summary.total_expense)} icon={DollarSign} colorClass="text-red-600" />
              <StatCard title="Material Costs" value={formatCurrency(categoryTotals.material || 0)} icon={Tag} colorClass="text-blue-600" />
              <StatCard title="Other Costs" value={formatCurrency(categoryTotals.other || 0)} icon={Tag} colorClass="text-yellow-600" />
            </div>
          )}

          {/* Expense List */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : expenses.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No expenses recorded yet.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {expenses.map((expense) => (
                  <li key={expense.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                      <span className="status-badge status-pending capitalize">{expense.category}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Add Pagination controls here */}
          </div>
        </div>
      </main>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchExpenses} // Refetch data on success
      />
    </>
  );
}

// Reusable Stat Card
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="card p-4 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')} bg-opacity-10 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default ExpenseManagementPage;