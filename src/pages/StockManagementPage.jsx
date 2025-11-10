import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Package, ArrowRightLeft } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import PageHeader from '@/components/PageHeader.jsx';

function StockManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stock-items/'); //
      setItems(res.data.results || []);
    } catch (err) {
      setError('Failed to fetch stock items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockItems();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Manage Stock" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-2xl">
          
          <div className="flex justify-end gap-2 mb-4">
            <button onClick={() => setIsTxnModalOpen(true)} className="btn-secondary flex items-center gap-2" title="Log Transaction">
              <ArrowRightLeft size={18} /> Log Transaction
            </button>
            <button onClick={() => setIsItemModalOpen(true)} className="btn-primary flex items-center gap-2" title="Add New Item Type">
              <Plus size={20} /> New Item
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
                {items.length === 0 ? (
                  <p className="p-10 text-center text-muted-foreground">No stock items found. Add one to get started.</p>
                ) : (
                  items.map(item => (
                    <li key={item.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Unit: {item.unit_of_measure}</p>
                        {item.needs_reorder && (
                           <p className="text-xs font-medium text-red-600">Re-order level reached</p>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {item.quantity_on_hand}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Add New Stock Item Modal */}
      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Create New Stock Item">
        <StockItemForm 
          onClose={() => setIsItemModalOpen(false)} 
          onSaved={() => {
            fetchStockItems();
            setIsItemModalOpen(false);
          }} 
        />
      </Modal>

      {/* Log Stock Transaction Modal */}
      <Modal isOpen={isTxnModalOpen} onClose={() => setIsTxnModalOpen(false)} title="Log Stock Transaction">
        <StockTransactionForm 
          stockItems={items}
          onClose={() => setIsTxnModalOpen(false)} 
          onSaved={() => {
            fetchStockItems(); // Refresh list after transaction
            setIsTxnModalOpen(false);
          }} 
        />
      </Modal>
    </div>
  );
}

// Form for creating a new StockItem type
function StockItemForm({ onSaved }) {
  // FIX: Match backend model
  const [formData, setFormData] = useState({ 
    name: '', 
    unit_of_measure: 'pieces', 
    description: '', 
    reorder_level: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stock-items/', formData);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed to create item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div>
        <label htmlFor="name" className="form-label">Item Name</label>
        <input type="text" name="name" id="name"
          value={formData.name} onChange={handleChange}
          className="form-input" required placeholder="e.g., Pink Thread"
        />
      </div>
      <div>
        <label htmlFor="unit_of_measure" className="form-label">Unit of Measure</label>
        <input type="text" name="unit_of_measure" id="unit_of_measure"
          value={formData.unit_of_measure} onChange={handleChange}
          className="form-input" required placeholder="e.g., meters, pieces, kg"
        />
      </div>
       <div>
        <label htmlFor="reorder_level" className="form-label">Re-order Level</label>
        <input type="number" name="reorder_level" id="reorder_level"
          value={formData.reorder_level} onChange={handleChange}
          className="form-input" required
        />
      </div>
      <div>
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea name="description" id="description"
          value={formData.description} onChange={handleChange}
          className="form-input" rows="2"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Create Item'}
      </button>
    </form>
  );
}

// Form for logging a new StockTransaction
function StockTransactionForm({ stockItems, onSaved }) {
  const [formData, setFormData] = useState({
    item: '',
    quantity_changed: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stockItems.length > 0 && !formData.item) {
      setFormData(f => ({...f, item: stockItems[0].id}));
    }
  }, [stockItems, formData.item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // FIX: Send correct backend fields
      await api.post('/stock-transactions/', {
        item: formData.item,
        quantity_changed: formData.quantity_changed, // Backend handles + or -
        reason: formData.reason
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div>
        <label htmlFor="item" className="form-label">Item</label>
        <select name="item" id="item" value={formData.item} onChange={handleChange} className="form-input" required>
          <option value="" disabled>Select an item</option>
          {stockItems.map(item => (
            <option key={item.id} value={item.id}>{item.name} (In stock: {item.quantity_on_hand})</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="quantity_changed" className="form-label">Quantity</label>
        <input type="number" name="quantity_changed" id="quantity_changed"
          value={formData.quantity_changed} onChange={handleChange}
          className="form-input" required step="0.01"
          placeholder="Use -10 to remove, 10 to add"
        />
      </div>
      
      <div>
        <label htmlFor="reason" className="form-label">Reason</label>
        <textarea name="reason" id="reason"
          value={formData.reason} onChange={handleChange}
          className="form-input" rows="2" placeholder="e.g., Purchased from local store"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Log Transaction'}
      </button>
    </form>
  );
}

export default StockManagementPage;