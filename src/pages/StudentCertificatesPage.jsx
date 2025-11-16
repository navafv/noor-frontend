import React, { useState, useEffect } from 'react';
import { Loader2, Download, Award } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        // This endpoint is defined in the backend for students
        const res = await api.get('/my-certificates/');
        setCertificates(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
        toast.error('Failed to load certificates.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (certId, certNo) => {
    const toastId = toast.loading('Downloading certificate...');
    try {
      // This endpoint is protected by the backend
      const res = await api.get(`/certificates/${certId}/download/`, {
        responseType: 'blob', // Tell axios to expect a file
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certNo}.pdf`); // Set filename
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download complete!', { id: toastId });
    } catch (err) {
      console.error("Failed to download certificate:", err);
      toast.error('Download failed. Please try again.', { id: toastId });
    }
  };

  return (
    <>
      <PageHeader title="My Certificates" />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <li key={cert.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Award size={32} className="text-primary shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {cert.course_title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Issued: {formatDate(cert.issue_date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {cert.certificate_no}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(cert.id, cert.certificate_no)}
                        className="btn-outline btn-sm"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-center p-8 text-muted-foreground">
                    You have not been issued any certificates yet.
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default StudentCertificatesPage;