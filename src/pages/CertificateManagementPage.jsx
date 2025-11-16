import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Plus, Award, Search, RefreshCcw, Check, X, Download } from 'lucide-react'; // <-- NEW
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-hot-toast';

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// --- Issue Certificate Modal ---
const IssueCertificateModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ student: '', course: '', remarks: '' });
  const [isLoading, setIsLoading] = useState(false);
  // TODO: Fetch students and courses to populate dropdowns
  // For now, we use simple number inputs for IDs

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      ...formData,
      student: parseInt(formData.student),
      course: parseInt(formData.course)
    };

    const promise = api.post('/certificates/', payload);

    try {
      await toast.promise(promise, {
        loading: 'Issuing certificate...',
        success: 'Certificate issued successfully! PDF is generating.',
        error: (err) => err.response?.data?.detail || 'Failed to issue certificate. Has the student completed the course?',
      });
      setFormData({ student: '', course: '', remarks: '' });
      onSuccess();
      onClose();
    } catch (err) { /* handled by toast */ } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue New Certificate" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The system will validate that the student has completed the course before issuing.
        </p>
        {/* TODO: Replace with async search selects */}
        <FormInput label="Student ID" name="student" value={formData.student} onChange={handleChange} type="number" required />
        <FormInput label="Course ID" name="course" value={formData.course} onChange={handleChange} type="number" required />
        <FormInput label="Remarks (Optional)" name="remarks" value={formData.remarks} onChange={handleChange} />
        
        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Issue Certificate'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Helper component
const FormInput = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="form-label">{label}</label>
    <input id={props.name} {...props} className="form-input" />
  </div>
);

// --- Main Page Component ---
function CertificateManagementPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: searchTerm });
      const res = await api.get(`/certificates/?${params.toString()}`);
      setCertificates(res.data.results || []);
      setTotalPages(Math.ceil((res.data.count || 0) / 20));
    } catch (err) {
      toast.error('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCertificates();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [page, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  
  const handleRevoke = async (certId, isRevoked) => {
    const action = isRevoked ? 'un-revoke' : 'revoke';
    if (!window.confirm(`Are you sure you want to ${action} this certificate?`)) return;

    const promise = api.post(`/certificates/${certId}/revoke/`);

    try {
      await toast.promise(promise, {
        loading: `${action.charAt(0).toUpperCase() + action.slice(1)}ing certificate...`,
        success: `Certificate ${action}d successfully.`,
        error: `Failed to ${action} certificate.`
      });
      fetchCertificates(); // Refetch
    } catch (err) { /* handled by toast */ }
  };

  // --- NEW: Download Handler ---
  const handleDownload = async (certId, certNo) => {
    const toastId = toast.loading('Downloading certificate...');
    try {
      // This endpoint is protected by the backend (for Admin or Owner)
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
      <PageHeader title="Certificate Management">
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Issue Certificate
        </button>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by certificate no, student name, or course..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : certificates.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No certificates found.</p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {certificates.map((cert) => (
                  <li key={cert.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary">{cert.certificate_no}</p>
                      <p className="text-sm font-medium text-foreground">{cert.student_name}</p>
                      <p className="text-sm text-muted-foreground">{cert.course_title}</p>
                      <p className="text-xs text-muted-foreground">Issued: {formatDate(cert.issue_date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.revoked ? (
                        <span className="status-badge status-closed">Revoked</span>
                      ) : (
                        <span className="status-badge status-completed">Valid</span>
                      )}
                      {/* --- NEW: Download Button --- */}
                      <button
                        onClick={() => handleDownload(cert.id, cert.certificate_no)}
                        className="btn-outline btn-sm"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleRevoke(cert.id, cert.revoked)}
                        className={`btn-outline btn-sm ${cert.revoked ? 'text-green-600' : 'text-red-600'}`}
                        title={cert.revoked ? 'Un-Revoke' : 'Revoke'}
                      >
                        {cert.revoked ? <Check size={16} /> : <X size={16} />}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Add Pagination controls */}
          </div>
        </div>
      </main>

      <IssueCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCertificates}
      />
    </>
  );
}

export default CertificateManagementPage;