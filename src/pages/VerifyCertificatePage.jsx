import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader2, Search } from 'lucide-react';

const VerifyCertificatePage = () => {
  const [searchParams] = useSearchParams();
  const hash = searchParams.get('hash');
  
  const [loading, setLoading] = useState(!!hash);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [manualHash, setManualHash] = useState('');

  useEffect(() => {
    if (hash) verify(hash);
  }, [hash]);

  const verify = async (hashToVerify) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.get(`/certificates/verify/${hashToVerify}/`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Certificate or System Error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if(manualHash) verify(manualHash);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Brand */}
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Noor Institute</h1>
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mt-1">Certificate Verification</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
        
        {/* State: Loading */}
        {loading && (
          <div className="py-12">
            <Loader2 className="animate-spin w-12 h-12 text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Verifying authentic records...</p>
          </div>
        )}

        {/* State: Valid Result */}
        {!loading && result && result.valid && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-xl font-bold text-green-700">Valid Certificate</h2>
            
            <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 text-sm border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase">Student Name</p>
                <p className="font-bold text-gray-900">{result.student_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Course Completed</p>
                <p className="font-bold text-gray-900">{result.course_title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <p className="text-xs text-gray-400 uppercase">Certificate No</p>
                   <p className="font-mono text-gray-900">{result.certificate_no}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-400 uppercase">Date</p>
                   <p className="text-gray-900">{result.issue_date}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State: Error / Invalid */}
        {!loading && error && (
          <div className="py-8 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} />
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Verification Failed</h2>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* State: Default / Search */}
        {!loading && !result && !error && (
          <div className="py-6">
            <p className="text-gray-500 text-sm mb-4">Scan a QR code or enter the verification ID found on the certificate.</p>
            <form onSubmit={handleManualSearch} className="relative">
               <input 
                 className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-200 outline-none text-sm font-mono"
                 placeholder="Enter UUID Hash..."
                 value={manualHash}
                 onChange={(e) => setManualHash(e.target.value)}
               />
               <button type="submit" className="absolute right-2 top-2 p-1 bg-primary-600 text-white rounded-lg">
                 <Search size={16} />
               </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-auto py-6">
        <Link to="/login" className="text-sm text-primary-600 font-semibold hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default VerifyCertificatePage;