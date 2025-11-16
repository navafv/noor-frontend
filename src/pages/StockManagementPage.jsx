import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Package, ClipboardList, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

// --- Add Item Modal ---
const AddItemModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '', unit_of_measure: 'pieces', reorder_level: '0' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = api.post('/finance/stock-items/', {
      ...formData,
      reorder_level: parseFloat(formData.reorder_level)
    });

    try {
      await toast.promise(promise, {
        loading: 'Adding new item...',
        success: 'Item added successfully!',
        error: (err) => err.response?.data?.name?.[0] || 'Failed to add item.'
      });
      setFormData({ name: '', description: '', unit_of_measure: 'pieces', reorder_level: '0' });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Stock Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Item Name" name="name" value={formData.name} onChange={handleChange} required />
        <FormInput label="Unit of Measure" name="unit_of_measure" value={formData.unit_of_measure} onChange={handleChange} placeholder="e.g., pieces, meters, kg" required />
        <FormInput label="Re-order Level" name="reorder_level" value={formData.reorder_level} onChange={handleChange} type="number" step="0.01" required />
        <FormInput label="Description" name="description" value={formData.description} onChange={handleChange} />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Item'}
        </button>
      </form>
    </Modal>
  );
};

// --- Add Transaction Modal ---
const AddTransactionModal = ({ isOpen, onClose, onSuccess, selectedItem }) => {
  const [formData, setFormData] = useState({ quantity_changed: '', reason: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const promise = api.post('/finance/stock-transactions/', {
      ...formData,
      item: selectedItem.id,
      quantity_changed: parseFloat(formData.quantity_changed)
    });

    try {
      await toast.promise(promise, {
        loading: 'Updating stock...',
        success: 'Stock updated successfully!',
        error: 'Failed to update stock.'
      });
      setFormData({ quantity_changed: '', reason: '' });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Stock: ${selectedItem?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter a positive number to add stock (e.g., "10") or a negative number to remove stock (e.g., "-5").
        </p>
        <FormInput label="Quantity Changed" name="quantity_changed" value={formData.quantity_changed} onChange={handleChange} type="number" step="0.01" required />
        <FormInput label="Reason" name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g., Purchased, Used for Batch-01" required />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Apply Change'}
        </button>
      </form>
    </Modal>
  );
};

// --- Transaction Log Modal ---
const TransactionLogModal = ({ isOpen, onClose, selectedItem }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && selectedItem) {
      const fetchLog = async () => {
        setLoading(true);
        try {
          // This endpoint is from the @action in the backend ViewSet
          const res = await api.get(`/finance/stock-items/${selectedItem.id}/transactions/`);
          setTransactions(res.data.results || []);
        } catch (err) {
          toast.error('Failed to load transaction log.');
        } finally {
          setLoading(false);
        }
      };
      fetchLog();
    }
  }, [isOpen, selectedItem]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log for ${selectedItem?.name}`}>
      <div className="max-h-[60vh] overflow-y-auto -mx-6">
        {loading ? (
          <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : transactions.length === 0 ? (
          <p className="text-center p-8 text-muted-foreground">No transactions found for this item.</p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map(tx => (
              <li key={tx.id} className="p-4 px-6 flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${tx.quantity_changed > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.quantity_changed > 0 ? '+' : ''}{tx.quantity_changed}
                  </p>
                  <p className="text-sm text-muted-foreground">{tx.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                  <p className="text-xs text-muted-foreground">by {tx.user?.username || 'N/A'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

// --- Main Page Component ---
function StockManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/finance/stock-items/');
      setItems(res.data.results || []);
    } catch (err) {
      toast.error('Failed to load stock items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);
  
  const openTxModal = (item) => {
    setSelectedItem(item);
    setIsTxModalOpen(true);
  };

  const openLogModal = (item) => {
    setSelectedItem(item);
    setIsLogModalOpen(true);
  };

  return (
    <>
      <PageHeader title="Stock & Inventory">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsItemModalOpen(true)}>
          <Plus size={18} />
          Add New Item
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No stock items found. Add one to get started.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Unit: {item.unit_of_measure}
                      </p>
                      {item.quantity_on_hand <= item.reorder_level && (
                        <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                          <AlertTriangle size={14} />
                          Low Stock
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {item.quantity_on_hand}
                      </p>
                      <p className="text-xs text-muted-foreground">On Hand</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => openTxModal(item)} className="btn-primary btn-sm">
                        <Plus size={16} />
                      </button>
                      <button onClick={() => openLogModal(item)} className="btn-outline btn-sm">
                        <ClipboardList size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <AddItemModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} onSuccess={fetchItems} />
      <AddTransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onSuccess={fetchItems} selectedItem={selectedItem} />
      <TransactionLogModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} selectedItem={selectedItem} />
    </>
  );
}

// Helper components for modals
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);

export default StockManagementPage;