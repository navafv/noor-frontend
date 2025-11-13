import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import { Loader2, DollarSign, Download, AlertCircle, ReceiptText } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';

function StudentFinancePage() {
  const { user } = useAuth();
  const [outstandingData, setOutstandingData] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!user?.student_id) {
      setLoading(false);
      setError("No student profile found.");
      return;
    }

    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [outstandingRes, receiptsRes] = await Promise.all([
          api.get(`/finance/outstanding/student/${user.student_id}/`),
          api.get('/finance/my-receipts/')
        ]);

        setOutstandingData(outstandingRes.data);
        setReceipts(receiptsRes.data.results || []);
      } catch (err) {
        setError('Failed to load finance data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [user]);

  const handleDownloadReceipt = async (receipt) => {
    if (downloadingId === receipt.id) return;
    setDownloadingId(receipt.id);
    try {
      const response = await api.get(`/finance/receipts/${receipt.id}/download/`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${receipt.receipt_no}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to download receipt", err);
      setError("Could not download receipt.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="My Finance" />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  return (
    <>
      <PageHeader title="My Finance" />
      
      <div className="p-4 max-w-lg mx-auto">
        {error && <p className="form-error mb-4">{error}</p>}
        
        {/* 1. Outstanding Summary Card */}
        {outstandingData && (
          <div className={`card p-6 mb-6 ${outstandingData.total_due > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
            <div className="flex items-center mb-4">
              <AlertCircle className={`mr-3 shrink-0 ${outstandingData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`} size={24} />
              <h2 className={`text-lg font-semibold ${outstandingData.total_due > 0 ? 'text-red-700' : 'text-green-700'}`}>
                Fee Status
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Course Fees</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(outstandingData.total_paid + outstandingData.total_due).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{outstandingData.total_paid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="col-span-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Outstanding Dues</p>
                <p className={`text-3xl font-bold ${outstandingData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{outstandingData.total_due.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Payment History */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground p-6 border-b border-border flex items-center">
            <ReceiptText size={20} className="mr-3 text-primary" />
            Payment History
          </h2>
          {receipts.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              <p className="mt-4 font-semibold">No payments recorded yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {receipts.map(receipt => (
                <li key={receipt.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">₹{parseFloat(receipt.amount).toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground">{receipt.receipt_no} ({receipt.get_mode_display})</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(receipt.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadReceipt(receipt)}
                    disabled={downloadingId === receipt.id}
                    className="btn-secondary btn-sm flex items-center gap-2"
                  >
                    {downloadingId === receipt.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    PDF
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentFinancePage;