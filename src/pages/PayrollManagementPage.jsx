import React, { useState, useEffect } from 'react';
import { Loader2, Plus, DollarSign, Briefcase } from 'lucide-react';
import api from '../services/api.js';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';

/**
 * Main page component for managing payroll.
 * This is an Admin-only feature.
 */
function PayrollManagementPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainers, setTrainers] = useState([]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const [payrollRes, trainerRes] = await Promise.all([
        api.get('/finance/payroll/'),
        api.get('/trainers/') // Fetch trainers for the form dropdown
      ]);
      setPayrolls(payrollRes.data.results || []);
      setTrainers(trainerRes.data.results || []);
    } catch (err) {
      setError('Failed to fetch payroll data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleSaved = () => {
    fetchPayrolls(); // Refresh the list
    setIsModalOpen(false);
  };
  
  const totalPaid = payrolls
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => acc + parseFloat(p.net_pay), 0);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Manage Payroll" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">

          {/* Summary */}
          <div className="mb-4 card p-4">
            <p className="text-sm text-muted-foreground">Total Paid Out (All Time)</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totalPaid.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Payroll Entry
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
                {payrolls.length === 0 ? (
                  <p className="p-10 text-center text-muted-foreground">No payrolls found.</p>
                ) : (
                  payrolls.map(payroll => (
                    <li key={payroll.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">
                          {payroll.trainer?.trainer_name || 'Unknown Trainer'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Month: {payroll.month}
                        </p>
                        <span className={`status-badge status-${payroll.status?.toLowerCase()}`}>
                          {payroll.status}
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-foreground">
                        ₹{parseFloat(payroll.net_pay).toLocaleString('en-IN')}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Add Payroll Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Payroll">
        <PayrollForm 
          trainers={trainers}
          onClose={() => setIsModalOpen(false)} 
          onSaved={handleSaved} 
        />
      </Modal>
    </div>
  );
}

// Form component for the modal
function PayrollForm({ trainers, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    trainer: trainers[0]?.id.toString() || '',
    month: new Date().toISOString().substring(0, 7), // YYYY-MM
    net_pay: '',
    status: 'Pending',
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
      // Send data
      await api.post('/finance/payroll/', {
        trainer: formData.trainer,
        month: formData.month,
        net_pay: formData.net_pay,
        status: formData.status,
        earnings: {}, // Send empty JSON, backend defaults to dict
        deductions: {}, // Send empty JSON, backend defaults to dict
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to save payroll. Check if an entry for this trainer and month already exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div>
        <label htmlFor="trainer" className="form-label">Trainer</label>
        <select
          name="trainer" id="trainer"
          value={formData.trainer} onChange={handleChange}
          className="form-input" required
        >
          <option value="" disabled>Select a trainer</option>
          {trainers.map(t => (
            <option key={t.id} value={t.id}>{t.trainer_name} ({t.emp_no})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="month" className="form-label">Month</label>
          <input
            type="month" name="month" id="month"
            value={formData.month} onChange={handleChange}
            className="form-input" required
          />
        </div>
        <div>
          <label htmlFor="net_pay" className="form-label">Net Pay (₹)</label>
          <input
            type="number" name="net_pay" id="net_pay"
            value={formData.net_pay} onChange={handleChange}
            className="form-input" required step="0.01"
          />
        </div>
      </div>
       <div>
        <label htmlFor="status" className="form-label">Status</label>
        <select
          name="status" id="status"
          value={formData.status} onChange={handleChange}
          className="form-input" required
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
      
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Payroll'}
      </button>
    </form>
  );
}

export default PayrollManagementPage;