import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

const StudentAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRecords = async (url = '/attendance/records/me/') => {
    try {
      const res = await api.get(url);
      const newRecords = res.data.results || res.data || [];
      
      if (url === '/attendance/records/me/') {
        setRecords(newRecords);
      } else {
        setRecords(prev => [...prev, ...newRecords]);
      }
      setNextPage(res.data.next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleLoadMore = () => {
    if (nextPage) {
      setLoadingMore(true);
      fetchRecords(nextPage);
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'P': return <CheckCircle size={20} className="text-green-600" />;
      case 'A': return <XCircle size={20} className="text-red-500" />;
      case 'L': return <Clock size={20} className="text-orange-500" />;
      default: return <AlertCircle size={20} className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    const map = { 'P': 'Present', 'A': 'Absent', 'L': 'Late', 'E': 'Excused' };
    return map[status] || status;
  };

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance History</h2>

      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       records.length === 0 ? <p className="text-center text-gray-400 py-10">No records found.</p> : (
         <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {records.map((record, idx) => (
                    <div key={record.id} className={`p-4 flex items-center justify-between ${idx !== records.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-50 p-2 rounded-xl text-gray-500">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">
                                    {parseDate(record.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                </p>
                                <p className="text-xs text-gray-400">{record.remarks || "No remarks"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            {getStatusIcon(record.status)}
                            <span className="text-sm font-medium text-gray-700">{getStatusText(record.status)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {nextPage && (
                <button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    className="w-full py-3 text-sm font-semibold text-primary-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {loadingMore && <Loader2 size={16} className="animate-spin" />}
                    Load More
                </button>
            )}
         </>
       )}
    </div>
  );
};

export default StudentAttendancePage;