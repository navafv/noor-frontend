import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader2, Search } from 'lucide-react';

const VerifyCertificatePage = () => {
  const { hash: paramHash } = useParams(); // From URL path (QR code)
  const [searchParams] = useSearchParams();
  const queryHash = searchParams.get('hash'); // From query string (?hash=...)
  
  const hash = paramHash || queryHash;

  const [loading, setLoading] = useState(!!hash);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [manualHash, setManualHash] = useState('');

  useEffect(() => { if (hash) verify(hash); }, [hash]);

  const verify = async (hashToVerify) => {
    if (!hashToVerify) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await api.get(`/certificates/verify/${hashToVerify}/`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired certificate ID");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="mb-8 mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Noor Institute</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Certificate Verification</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
        {loading && <div className="py-12"><Loader2 className="animate-spin w-12 h-12 text-primary-600 mx-auto mb-4" /><p className="text-gray-500">Verifying authenticitiy...</p></div>}
        
        {!loading && result && result.valid && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={36} /></div>
            <h2 className="text-xl font-bold text-green-700">Valid Certificate</h2>
            <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 text-sm border border-gray-100">
              <div><p className="text-xs text-gray-400 uppercase">Student</p><p className="font-bold text-gray-900">{result.student_name}</p></div>
              <div><p className="text-xs text-gray-400 uppercase">Course</p><p className="font-bold text-gray-900">{result.course_title}</p></div>
              <div><p className="text-xs text-gray-400 uppercase">Issued Date</p><p className="font-bold text-gray-900">{result.issue_date}</p></div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle size={36} /></div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h2>
            <p className="text-gray-500 text-sm max-w-[200px] mx-auto">{error}</p>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="py-6">
            <p className="text-gray-500 text-sm mb-4">Enter the UUID from the bottom of the certificate.</p>
            <form onSubmit={(e) => { e.preventDefault(); if(manualHash) verify(manualHash); }} className="relative">
               <input 
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-200 outline-none text-sm font-mono text-center tracking-wide" 
                  placeholder="e.g. a1b2-c3d4..." 
                  value={manualHash} 
                  onChange={(e) => setManualHash(e.target.value)} 
               />
               <button type="submit" className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors">
                  <Search size={16} />
               </button>
            </form>
          </div>
        )}
      </div>
      <div className="mt-auto py-6"><Link to="/login" className="text-sm text-primary-600 font-semibold hover:underline">Back to Login</Link></div>
    </div>
  );
};

export default VerifyCertificatePage;