import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Briefcase } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// Format currency
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// --- Add Payroll Modal ---
const AddPayrollModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    trainer: '', // This will be an ID
    month: '', // YYYY-MM
    earnings: '{}',
    deductions: '{}',
    net_pay: '',
    status: 'Pending'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let earningsJSON, deductionsJSON;
    try {
      earningsJSON = JSON.parse(formData.earnings);
      deductionsJSON = JSON.parse(formData.deductions);
    } catch (err) {
      toast.error('Earnings or Deductions is not valid JSON.');
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      trainer: parseInt(formData.trainer, 10),
      net_pay: parseFloat(formData.net_pay),
      earnings: earningsJSON,
      deductions: deductionsJSON,
    };

    const promise = api.post('/finance/payroll/', payload);

    try {
      await toast.promise(promise, {
        loading: 'Saving payroll...',
        success: 'Payroll record saved successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to save payroll.'
      });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Payroll Record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Replace Trainer ID with an async search select */}
        <FormInput label="Trainer ID" name="trainer" value={formData.trainer} onChange={handleChange} type="number" required />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Month (YYYY-MM)" name="month" value={formData.month} onChange={handleChange} placeholder="e.g., 2025-11" required />
          <FormInput label="Net Pay" name="net_pay" value={formData.net_pay} onChange={handleChange} type="number" step="0.01" required />
        </div>
        <FormSelect label="Status" name="status" value={formData.status} onChange={handleChange} required>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </FormSelect>
        <FormTextarea label="Earnings (JSON)" name="earnings" value={formData.earnings} onChange={handleChange} rows={3} />
        <FormTextarea label="Deductions (JSON)" name="deductions" value={formData.deductions} onChange={handleChange} rows={3} />
        
        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save Payroll'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Helper components for the form
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);
const FormTextarea = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <textarea id={props.name} {...props} className="form-input" />
  </div>
);
const FormSelect = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <select id={props.name} {...props} className="form-input">
      {children}
    </select>
  </div>
);

// --- Main Page Component ---
function PayrollManagementPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await api.get('/finance/payroll/');
      setPayrolls(res.data.results || []);
    } catch (err) {
      toast.error('Failed to load payrolls.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  return (
    <>
      <PageHeader title="Payroll Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Payroll
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* TODO: Add filters for month/trainer */}
          
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : payrolls.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No payroll records found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {payrolls.map((payroll) => (
                  <li key={payroll.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {payroll.trainer?.user?.first_name} {payroll.trainer?.user?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Month: {payroll.month}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(payroll.net_pay)}</p>
                      <span className={`status-badge ${payroll.status === 'Paid' ? 'status-completed' : 'status-pending'}`}>
                        {payroll.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Add Pagination controls here */}
          </div>
        </div>
      </main>

      <AddPayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPayrolls}
      />
    </>
  );
}

export default PayrollManagementPage;