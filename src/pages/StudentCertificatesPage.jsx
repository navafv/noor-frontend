import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import { Loader2, Award, Download, XCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';

function StudentCertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!user?.student_id) {
      setLoading(false);
      setError("No student profile found.");
      return;
    }

    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get('/my-certificates/');
        setCertificates(res.data.results || []);
      } catch (err) {
        setError('Failed to load certificates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleDownload = async (cert) => {
    if (downloadingId === cert.id) return;
    setDownloadingId(cert.id);
    setError(null);
    
    try {
      const response = await api.get(cert.pdf_file, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = cert.pdf_file.split('/').pop();
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Failed to download file", err);
      setError("Could not download certificate file.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="My Certificates" />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  return (
    <>
      <PageHeader title="My Certificates" />
      
      <div className="p-4 max-w-lg mx-auto">
        {error && <p className="form-error mb-4">{error}</p>}
        
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground p-6 border-b border-border flex items-center">
            <Award size={20} className="mr-3 text-primary" />
            Your Issued Certificates
          </h2>
          {certificates.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              <Award size={40} className="mx-auto" />
              <p className="mt-4 font-semibold">No certificates found</p>
              <p className="text-sm mt-1">
                Certificates you earn will appear here once your course is completed.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {certificates.map(cert => (
                <li key={cert.id} className="p-4">
                  <p className="font-semibold text-foreground">{cert.course_title}</p>
                  <p className="text-sm text-muted-foreground">Certificate No: {cert.certificate_no}</p>
                  <p className="text-xs text-muted-foreground">
                    Issued on: {new Date(cert.issue_date).toLocaleDateString()}
                  </p>
                  
                  {cert.revoked ? (
                    <div className="mt-2 flex items-center gap-2 text-red-600">
                      <XCircle size={16} />
                      <span className="text-sm font-medium">This certificate has been revoked.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingId === cert.id || !cert.pdf_file}
                      className="btn-secondary btn-sm flex items-center gap-2 mt-3 disabled:opacity-50"
                    >
                      {downloadingId === cert.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      {downloadingId === cert.id ? 'Downloading...' : 'Download PDF'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentCertificatesPage;