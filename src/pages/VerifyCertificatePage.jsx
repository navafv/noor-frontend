import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Search, CheckCircle, XCircle, Award } from 'lucide-react';
import api from '../services/api.js';

/**
 * A public page for anyone to verify a certificate using its hash.
 * It can be accessed via /verify?hash=...
 */
function VerifyCertificatePage() {
  const [searchParams] = useSearchParams();
  const [hash, setHash] = useState(searchParams.get('hash') || '');
  const [inputHash, setInputHash] = useState(searchParams.get('hash') || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);

  // Automatically search if hash is in URL
  useEffect(() => {
    if (hash) {
      verifyHash(hash);
    }
  }, [hash]);

  const verifyHash = async (hashToVerify) => {
    if (!hashToVerify) return;
    
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      // This is a public endpoint, so no auth is needed
      const res = await api.get(`/certificates/verify/${hashToVerify}/`);
      setCertificate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found or revoked.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHash(inputHash); // This will trigger the useEffect
  };

  return (
    <div className="py-20 bg-background min-h-[70vh]">
      <div className="mx-auto max-w-lg px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Verify Certificate</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Enter the verification code (UUID) found on the certificate.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            type="text"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            className="form-input flex-1"
            placeholder="Enter certificate verification code..."
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          </button>
        </form>

        {/* Result Area */}
        <div className="mt-10">
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          )}
          
          {error && (
            <VerificationResult 
              icon={XCircle}
              iconColor="text-red-600"
              title="Verification Failed"
              message={error}
            />
          )}

          {certificate && (
            <VerificationResult
              icon={CheckCircle}
              iconColor="text-green-600"
              title="Certificate Verified"
            >
              <div className="mt-4 space-y-3 text-left">
                <InfoRow label="Student" value={certificate.student} />
                <InfoRow label="Course" value={certificate.course} />
                <InfoRow label="Certificate No" value={certificate.certificate_no} />
                <InfoRow label="Issue Date" value={new Date(certificate.issue_date).toLocaleDateString()} />
              </div>
            </VerificationResult>
          )}

        </div>
      </div>
    </div>
  );
}

const VerificationResult = ({ icon: Icon, iconColor, title, message, children }) => (
  <div className="card p-8 flex flex-col items-center text-center">
    <Icon size={64} className={iconColor} />
    <h2 className={`text-2xl font-bold mt-4 ${iconColor}`}>{title}</h2>
    {message && <p className="text-muted-foreground mt-2">{message}</p>}
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="border-t border-border pt-3">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold text-foreground">{value}</p>
  </div>
);

export default VerifyCertificatePage;