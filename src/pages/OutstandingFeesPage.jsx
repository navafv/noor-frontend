import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertCircle, MessageCircle, Phone } from 'lucide-react';

const OutstandingFeesPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/finance/fees/outstanding/')
      .then(res => setStudents(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Fees</h2>

      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       students.length === 0 ? (
         <div className="text-center py-10 bg-green-50 rounded-3xl border border-green-100 text-green-700">
            <p className="font-bold">All Clear!</p>
            <p className="text-sm">No outstanding fees.</p>
         </div>
       ) : (
         <div className="space-y-3">
           {students.map((item, idx) => (
             <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
                
                <div className="flex justify-between items-start mb-3 pl-3">
                    <div>
                        <h3 className="font-bold text-gray-900">{item.student_name}</h3>
                        <p className="text-xs text-gray-500">{item.course_title}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">Balance</p>
                        <p className="font-bold text-xl text-red-600">₹{item.balance}</p>
                    </div>
                </div>

                <div className="pl-3 flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} /> {item.guardian_phone}
                    </div>
                    
                    <a 
                        href={`https://wa.me/91${item.guardian_phone}?text=Dear Parent, a fee balance of ₹${item.balance} is pending for ${item.student_name} (${item.course_title}) at Noor Institute.`}
                        target="_blank"
                        className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                    >
                        <MessageCircle size={16} /> WhatsApp
                    </a>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default OutstandingFeesPage;