import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Award, XCircle, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx'; // We'll use this for confirmation

/**
 * Page for viewing, searching, and managing all issued certificates.
 * Admin-only feature.
 */
function CertificateManagementPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [modalAction, setModalAction] = useState('revoke'); // 'revoke' or 'un-revoke'
  const [processing, setProcessing] = useState(false);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/certificates/');
      setCertificates(response.data.results || []);
    } catch (err) {
      setError('Could not fetch certificates. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const openRevokeModal = (cert) => {
    setSelectedCert(cert);
    setModalAction(cert.revoked ? 'un-revoke' : 'revoke');
    setIsModalOpen(true);
  };

  const handleRevoke = async () => {
    if (!selectedCert) return;
    
    setProcessing(true);
    setError(null);
    try {
      // Call the new backend action
      await api.post(`/certificates/${selectedCert.id}/revoke/`);
      
      // Update state optimistically
      setCertificates(prev => 
        prev.map(c => c.id === selectedCert.id ? { ...c, revoked: !c.revoked } : c)
      );
      
      setIsModalOpen(false);
      setSelectedCert(null);
    } catch (err) {
      setError(`Failed to ${modalAction} certificate.`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Certificate Management" />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          {error && <p className="form-error mx-4">{error}</p>}
          
          {!loading && !error && certificates.length === 0 && (
            <div className="text-center p-10 card">
              <Award size={40} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">No Certificates Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Issue certificates from a student's detail page.
              </p>
            </div>
          )}

          {/* Certificates List */}
          {!loading && !error && certificates.length > 0 && (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {certificates.map((cert) => (
                  <li key={cert.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="grow">
                      <div className="flex items-center gap-3">
                        {cert.revoked ? (
                          <XCircle size={16} className="text-red-500 shrink-0" />
                        ) : (
                          <CheckCircle size={16} className="text-green-500 shrink-0" />
                        )}
                        <span className="font-semibold text-foreground">{cert.certificate_no}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-7">
                        {cert.student_name}
                      </p>
                       <p className="text-sm text-muted-foreground pl-7">
                        Course: {cert.course_title}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4">
                      {cert.revoked ? (
                        <button 
                          onClick={() => openRevokeModal(cert)}
                          className="btn-secondary"
                          title="Re-validate this certificate"
                        >
                          <RefreshCw size={16} className="mr-2" />
                          Un-Revoke
                        </button>
                      ) : (
                        <button 
                          onClick={() => openRevokeModal(cert)}
                          className="btn-destructive"
                          title="Revoke this certificate"
                        >
                          <XCircle size={16} className="mr-2" />
                          Revoke
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Action">
        {selectedCert && (
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="text-yellow-600 mr-3 shrink-0" size={24} />
              <p className="text-yellow-700 dark:text-yellow-300">
                Are you sure you want to <strong>{modalAction}</strong> certificate 
                <strong> {selectedCert.certificate_no}</strong> for <strong>{selectedCert.student_name}</strong>?
              </p>
            </div>
            {error && <p className="form-error text-center">{error}</p>}
            <button
              onClick={handleRevoke}
              disabled={processing}
              className={`btn w-full justify-center ${modalAction === 'revoke' ? 'btn-destructive' : 'btn-secondary'}`}
            >
              {processing ? <Loader2 className="animate-spin" /> : `Yes, ${modalAction.charAt(0).toUpperCase() + modalAction.slice(1)}`}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CertificateManagementPage;