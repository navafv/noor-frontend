import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ReceiptText, Lock, Unlock, Search, X } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Page for viewing, searching, and managing all student receipts.
 * Admin-only feature.
 */
function ReceiptManagementPage() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and Search
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    locked: '',
    mode: '',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        search: search,
        locked: filters.locked || undefined,
        mode: filters.mode || undefined,
      };

      const response = await api.get('/finance/receipts/', { params });
      setReceipts(response.data.results || []);
      setCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 per page
    } catch (err) {
      setError('Could not fetch receipts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filters]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]); // Re-run when fetchReceipts function changes (i.e., when deps change)

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchReceipts();
  };
  
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleToggleLock = async (receiptId, isLocked) => {
    const action = isLocked ? 'unlock' : 'lock';
    try {
      // Optimistic update
      setReceipts(prev => 
        prev.map(r => r.id === receiptId ? { ...r, locked: !isLocked } : r)
      );
      
      // Call API
      await api.post(`/finance/receipts/${receiptId}/${action}/`);
      
      // Optionally re-fetch to be safe, though optimistic update is usually enough
      // fetchReceipts(); 
    } catch (err) {
      setError(`Failed to ${action} receipt.`);
      // Revert optimistic update on error
      setReceipts(prev => 
        prev.map(r => r.id === receiptId ? { ...r, locked: isLocked } : r)
      );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Receipt Management" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-5xl">
          
          {/* Search and Filters */}
          <div className="card p-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="grow">
                <label htmlFor="search" className="form-label sr-only">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by receipt #, student name, or reg no..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input pl-10"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="mode" className="form-label sr-only">Mode</label>
                  <select name="mode" id="mode" value={filters.mode} onChange={handleFilterChange} className="form-input">
                    <option value="">All Modes</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="locked" className="form-label sr-only">Status</label>
                  <select name="locked" id="locked" value={filters.locked} onChange={handleFilterChange} className="form-input">
                    <option value="">All Statuses</option>
                    <option value="true">Locked</option>
                    <option value="false">Unlocked</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && receipts.length === 0 && (
            <div className="text-center p-10 card">
              <ReceiptText size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Receipts Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? 'Try a different search term.' : 'No receipts match your filters.'}
              </p>
            </div>
          )}

          {/* Receipts List */}
          {!loading && !error && receipts.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {receipts.map((receipt) => (
                  <li key={receipt.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="grow">
                      <div className="flex items-center gap-3">
                        {receipt.locked ? (
                          <Lock size={16} className="text-red-500 shrink-0" />
                        ) : (
                          <Unlock size={16} className="text-green-500 shrink-0" />
                        )}
                        <span className="font-semibold text-foreground">{receipt.receipt_no}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-7">
                        {receipt.student_name} (Course: {receipt.course})
                      </p>
                       <p className="text-sm text-muted-foreground pl-7">
                        {new Date(receipt.date).toLocaleDateString()} via {receipt.mode}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4">
                      <p className="text-xl font-bold text-green-600">
                        ₹{parseFloat(receipt.amount).toLocaleString('en-IN')}
                      </p>
                      
                      {user.is_superuser && ( // Only Admins can lock/unlock
                        receipt.locked ? (
                          <button 
                            onClick={() => handleToggleLock(receipt.id, true)}
                            className="btn-secondary"
                            title="Unlock this receipt to allow edits"
                          >
                            <Unlock size={16} className="mr-2" />
                            Unlock
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleToggleLock(receipt.id, false)}
                            className="btn-destructive"
                            title="Lock this receipt to prevent edits"
                          >
                            <Lock size={16} className="mr-2" />
                            Lock
                          </button>
                        )
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ReceiptManagementPage;