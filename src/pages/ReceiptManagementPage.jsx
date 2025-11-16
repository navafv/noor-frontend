import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, ReceiptText, Search, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format currency
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// --- Add Receipt Modal ---
const AddReceiptModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    batch: '',
    amount: '',
    mode: 'cash',
    txn_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch students, courses, etc. to populate dropdowns
  // For now, we use simple number inputs for IDs

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare payload, converting IDs to numbers
    const payload = {
      ...formData,
      student: parseInt(formData.student, 10),
      course: formData.course ? parseInt(formData.course, 10) : null,
      batch: formData.batch ? parseInt(formData.batch, 10) : null,
      amount: parseFloat(formData.amount),
    };

    const promise = api.post('/finance/receipts/', payload);

    try {
      await toast.promise(promise, {
        loading: 'Creating receipt...',
        success: 'Receipt created successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to create receipt.'
      });
      setFormData({ student: '', course: '', batch: '', amount: '', mode: 'cash', txn_id: '' });
      onSuccess();
      onClose();
    } catch (err) {
      // Error is toasted
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Receipt" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Replace student, course, batch with async search selects */}
        <FormInput label="Student ID" name="student" value={formData.student} onChange={handleChange} type="number" required />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Course ID (Optional)" name="course" value={formData.course} onChange={handleChange} type="number" />
          <FormInput label="Batch ID (Optional)" name="batch" value={formData.batch} onChange={handleChange} type="number" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Amount" name="amount" value={formData.amount} onChange={handleChange} type="number" step="0.01" required />
          <FormSelect label="Mode" name="mode" value={formData.mode} onChange={handleChange} required>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Card</option>
          </FormSelect>
        </div>
        <FormInput label="Transaction ID (if any)" name="txn_id" value={formData.txn_id} onChange={handleChange} />
        
        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Save Receipt'}
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
const FormSelect = ({ label, children, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <select id={props.name} {...props} className="form-input">
      {children}
    </select>
  </div>
);

// --- Main Page Component ---
function ReceiptManagementPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        search: searchTerm,
      });
      const res = await api.get(`/finance/receipts/?${params.toString()}`);
      setReceipts(res.data.results || []);
      setTotalPages(Math.ceil((res.data.count || 0) / 20));
    } catch (err) {
      toast.error('Failed to load receipts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReceipts();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [page, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDownload = async (receiptId, receiptNo) => {
    const toastId = toast.loading('Downloading receipt...');
    try {
      const res = await api.get(`/finance/receipts/${receiptId}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${receiptNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download complete!', { id: toastId });
    } catch (err) {
      toast.error('Download failed.', { id: toastId });
    }
  };

  return (
    <>
      <PageHeader title="Receipt Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Receipt
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Search */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by receipt no, student name, or reg no..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          {/* Receipt List */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : receipts.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No receipts found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {receipts.map((receipt) => (
                  <li key={receipt.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-primary">{receipt.receipt_no}</p>
                      <p className="text-sm font-medium text-foreground">
                        {receipt.student_name || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(receipt.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-green-600">{formatCurrency(receipt.amount)}</p>
                      <button
                        onClick={() => handleDownload(receipt.id, receipt.receipt_no)}
                        className="btn-outline btn-sm"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Add Pagination controls here */}
          </div>
        </div>
      </main>

      <AddReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReceipts}
      />
    </>
  );
}

export default ReceiptManagementPage;