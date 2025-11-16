import React, { useState, useEffect } from 'react';
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function StudentFinancePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.student?.id) return;

    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        // Fetch outstanding summary and receipts list in parallel
        const [summaryRes, receiptsRes] = await Promise.all([
          api.get(`/finance/outstanding/student/${user.student.id}/`),
          api.get('/my-receipts/')
        ]);
        setSummary(summaryRes.data);
        setReceipts(receiptsRes.data.results || []);
      } catch (err) {
        console.error("Failed to fetch finance data:", err);
        toast.error('Failed to load financial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, [user]);

  const handleDownload = async (receiptId, receiptNo) => {
    const toastId = toast.loading('Downloading receipt...');
    try {
      // This endpoint is protected by the backend
      const res = await api.get(`/finance/receipts/${receiptId}/download/`, {
        responseType: 'blob', // Tell axios to expect a file
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${receiptNo}.pdf`); // Set filename
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download complete!', { id: toastId });
    } catch (err) {
      console.error("Failed to download receipt:", err);
      toast.error('Download failed. Please try again.', { id: toastId });
    }
  };

  return (
    <>
      <PageHeader title="My Finance" />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <>
              {/* Summary */}
              {summary && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Balance Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card p-4">
                      <p className="text-sm text-muted-foreground">Total Fees Due</p>
                      <p className="text-2xl font-bold text-destructive">
                        ₹{summary.total_due.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="card p-4">
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{summary.total_paid.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt History */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Payment History</h2>
                <div className="card overflow-hidden">
                  <ul role="list" className="divide-y divide-border">
                    {receipts.length > 0 ? (
                      receipts.map((receipt) => (
                        <li key={receipt.id} className="flex items-center justify-between p-4">
                          <div>
                            <p className="font-semibold text-foreground">
                              ₹{Number(receipt.amount).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {receipt.receipt_no} on {formatDate(receipt.date)}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              via {receipt.mode}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownload(receipt.id, receipt.receipt_no)}
                            className="btn-outline btn-sm"
                          >
                            <Download size={16} className="mr-2" />
                            Download
                          </button>
                        </li>
                      ))
                    ) : (
                      <p className="text-center p-8 text-muted-foreground">
                        No payment receipts found.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default StudentFinancePage;