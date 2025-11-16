import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { Loader2, Search, CheckCircle, XCircle, Award } from 'lucide-react';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function VerifyCertificatePage() {
  const [searchParams] = useSearchParams();
  const [hash, setHash] = useState(searchParams.get('hash') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // To store success data
  const [error, setError] = useState(null);   // To store error message

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!hash) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // This is the public, unauthenticated endpoint
      const res = await api.get(`/certificates/verify/${hash}/`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };
  
  // If a hash is in the URL on load, auto-submit
  useEffect(() => {
    if (hash) {
      handleSubmit();
    }
  }, []); // Run only on initial load

  return (
    <div className="bg-background min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Verify Certificate
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter the unique code from the certificate to verify its authenticity.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="form-input flex-1"
            placeholder="Enter certificate verification code..."
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !hash}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          </button>
        </form>

        {/* Results */}
        <div className="mt-8">
          {result && (
            <div className="card p-6 border-green-500 bg-green-500/5">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
                <div>
                  <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300">
                    Certificate is Valid
                  </h2>
                  <p className="text-muted-foreground">This certificate is authentic.</p>
                </div>
              </div>
              <ul className="space-y-2 border-t border-green-500/20 pt-4">
                <ResultItem label="Student" value={result.student_name} />
                <ResultItem label="Course" value={result.course_title} />
                <ResultItem label="Certificate No" value={result.certificate_no} />
                <ResultItem label="Issue Date" value={formatDate(result.issue_date)} />
              </ul>
            </div>
          )}
          {error && (
            <div className="card p-6 border-destructive bg-destructive/5">
              <div className="flex items-center gap-4">
                <XCircle className="w-12 h-12 text-destructive" />
                <div>
                  <h2 className="text-2xl font-semibold text-destructive">
                    Certificate Not Valid
                  </h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ResultItem = ({ label, value }) => (
  <li className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold text-foreground">{value}</span>
  </li>
);

export default VerifyCertificatePage;