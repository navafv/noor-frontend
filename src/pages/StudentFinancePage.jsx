import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Receipt, Download, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentFinancePage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await api.get('/finance/receipts/');
        setReceipts(res.data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const downloadReceipt = async (id) => {
    try {
      const response = await api.get(`/finance/receipts/${id}/download/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Fee History</h2>

      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       receipts.length === 0 ? (
         <div className="text-center py-10 text-gray-400">No fee receipts found.</div>
       ) : (
         <div className="space-y-3">
           {receipts.map((receipt) => (
             <div key={receipt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
               {/* Decorative Circle */}
               <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full" />
               
               <div className="flex justify-between items-start relative z-10">
                 <div>
                   <p className="text-xs text-gray-400 mb-1">Receipt #{receipt.receipt_no}</p>
                   <h3 className="text-xl font-bold text-gray-900">₹{receipt.amount}</h3>
                   <p className="text-sm text-gray-600 mt-1">{receipt.course_title}</p>
                 </div>
                 <div className="bg-green-100 text-green-700 p-2 rounded-xl">
                   <Receipt size={20} />
                 </div>
               </div>

               <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                 <div className="flex items-center gap-1 text-xs text-gray-400">
                   <Calendar size={12} />
                   {receipt.date}
                 </div>
                 <button 
                   onClick={() => downloadReceipt(receipt.id)}
                   className="flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                 >
                   <Download size={14} /> PDF
                 </button>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default StudentFinancePage;