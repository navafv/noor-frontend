import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Package, ArrowRightLeft } from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';

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
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link to="/admin/dashboard" className="flex items-center gap-1 text-noor-pink">
            <ChevronLeft size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <h1 className="text-lg font-semibold text-noor-heading">Manage Stock</h1>
          <div className="flex gap-2">
            <button onClick={() => setIsTxnModalOpen(true)} className="btn-secondary p-2" title="Log Transaction">
              <ArrowRightLeft size={18} />
            </button>
            <button onClick={() => setIsItemModalOpen(true)} className="btn-primary p-2" title="Add New Item Type">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin text-noor-pink" size={32} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}

          {!loading && (
            <div className="bg-white rounded-xl shadow-sm">
              <ul className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <p className="p-10 text-center text-gray-500">No stock items found. Add one to get started.</p>
                ) : (
                  items.map(item => (
                    <li key={item.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-noor-heading">{item.name}</p>
                        <p className="text-sm text-gray-500">Unit: {item.unit}</p>
                      </div>
                      <p className="text-2xl font-bold text-noor-heading">
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
function StockItemForm({ onClose, onSaved }) {
  const [formData, setFormData] = useState({ name: '', unit: 'units' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stock-items/', formData); //
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
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="form-input" required placeholder="e.g., Pink Thread"
        />
      </div>
      <div>
        <label htmlFor="unit" className="form-label">Unit</label>
        <input type="text" name="unit" id="unit"
          value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}
          className="form-input" required placeholder="e.g., meters, units, kg"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Create Item'}
      </button>
    </form>
  );
}

// Form for logging a new StockTransaction
function StockTransactionForm({ stockItems, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    item: '',
    transaction_type: 'IN',
    quantity: '',
    notes: '',
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
      await api.post('/stock-transactions/', formData); //
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
            <option key={item.id} value={item.id}>{item.name} ({item.quantity_on_hand} {item.unit})</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="transaction_type" className="form-label">Type</label>
          <select name="transaction_type" id="transaction_type" value={formData.transaction_type} onChange={handleChange} className="form-input" required>
            <option value="IN">Stock IN (Purchased)</option>
            <option value="OUT">Stock OUT (Used)</option>
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input type="number" name="quantity" id="quantity"
            value={formData.quantity} onChange={handleChange}
            className="form-input" required step="0.01"
          />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea name="notes" id="notes"
          value={formData.notes} onChange={handleChange}
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