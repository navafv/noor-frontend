/*
 * UPDATED FILE: src/pages/StudentDetailPage.jsx
 *
 * FIX: Added 'download' attribute to the certificate link to force download.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Phone, Mail, Home, Shield,
  Award, Download, Loader2, BookOpen, DollarSign, Ruler, AlertCircle
} from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import MeasurementForm from '@/components/MeasurementForm.jsx';
import PageHeader from '@/components/PageHeader.jsx';

/**
 * Shows all details for a single student.
 */
function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [outstandingData, setOutstandingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchStudentData = async () => {
    try {
      setError(null);
      const [
        studentRes, 
        enrollmentsRes, 
        paymentsRes, 
        measurementsRes, 
        certificatesRes,
        outstandingRes
      ] = await Promise.all([
        api.get(`/students/${id}/`),
        api.get(`/enrollments/?student=${id}`),
        api.get(`/finance/receipts/?student=${id}`),
        api.get(`/students/${id}/measurements/`),
        api.get(`/certificates/?student=${id}`),
        api.get(`/finance/outstanding/student/${id}/`)
      ]);
      
      setStudent(studentRes.data);
      setEnrollments(enrollmentsRes.data.results || []);
      setPayments(paymentsRes.data.results || []);
      setMeasurements(measurementsRes.data.results || []);
      setCertificates(certificatesRes.data.results || []);
      setOutstandingData(outstandingRes.data);

    } catch (err) {
      setError('Could not fetch student details.');
      console.error(err);
    } finally {
      setLoading(false); // Set loading false only after all fetches
    }
  };

  useEffect(() => { 
    setLoading(true); // Set loading true on initial mount
    fetchStudentData(); 
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const handleDataRefresh = () => { 
    // Just re-fetch all data
    fetchStudentData(); 
  };
  
  const latestMeasurement = measurements.length > 0 
    ? measurements.sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken))[0] 
    : null;
  
  // --- NEW FUNCTION TO HANDLE PDF DOWNLOAD ---
  const handleDownload = async (cert) => {
    if (downloadingId === cert.id) return; // Already downloading
    setDownloadingId(cert.id);
    try {
      // Fetch the PDF file as a 'blob' (binary large object)
      const response = await api.get(cert.pdf_file, {
        responseType: 'blob',
      });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a hidden link element
      const link = document.createElement('a');
      link.href = url;
      
      // Get the filename from the URL (e.g., "CERT-20251110-0001_J1y9rJG.pdf")
      const filename = cert.pdf_file.split('/').pop();
      link.setAttribute('download', filename);
      
      // Append to the page, click it, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the temporary URL
      
    } catch (err) {
      console.error("Failed to download file", err);
      // You could set an error state here
    } finally {
      setDownloadingId(null); // Stop loading state
    }
  };
  // --- END OF NEW FUNCTION ---

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <PageHeader title="Student Profile" />
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );
  
  if (error) return (
    <div className="p-4 max-w-2xl mx-auto">
      <PageHeader title="Error" />
      <p className="form-error">{error}</p>
    </div>
  );
  
  if (!student) return <div className="p-4">Student not found.</div>;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
  const photoUrl = student.photo
    ? `${BACKEND_URL}${student.photo}`
    : `https://placehold.co/400x400/EBF5FF/1E40AF?text=${getInitials(student.user.first_name, student.user.last_name)}`;

    
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Student Profile" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-lg pb-20">
          
          {/* Profile Header */}
          <div className="card p-6 flex flex-col items-center">
            <img 
              src={photoUrl} 
              alt="Student Photo" 
              className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-md -mt-16" 
              onError={(e) => { e.target.src = `https://placehold.co/400x400/EBF5FF/1E40AF?text=${getInitials(student.user.first_name, student.user.last_name)}`}}
            />
            <h1 className="text-2xl font-bold text-foreground mt-4">{student.user.first_name} {student.user.last_name}</h1>
            <p className="text-sm text-muted-foreground">Reg No: {student.reg_no}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <ActionCard icon={BookOpen} label="Enroll" onClick={() => setIsEnrollModalOpen(true)} />
            <ActionCard icon={DollarSign} label="Log Payment" onClick={() => setIsPaymentModalOpen(true)} />
            <ActionCard icon={Ruler} label="Measurements" onClick={() => setIsMeasurementModalOpen(true)} />
            <ActionCard icon={Award} label="Issue Certificate" onClick={() => setIsCertificateModalOpen(true)} />
          </div>
          
          {/* Outstanding Fee Card */}
          {outstandingData && (
            <div className={`card p-4 mb-4 ${outstandingData.total_due > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <div className="flex items-center">
                <AlertCircle className={`mr-3 shrink-0 ${outstandingData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`} size={24} />
                <div>
                  <p className={`text-sm font-medium ${outstandingData.total_due > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    Total Outstanding
                  </p>
                  <p className={`text-2xl font-bold ${outstandingData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{outstandingData.total_due.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Student Information</h3>
            <div className="space-y-4">
              <InfoItem icon={Phone} label="Phone" value={student.user.phone} />
              {student.user.email && <InfoItem icon={Mail} label="Email" value={student.user.email} />}
              <InfoItem icon={Home} label="Address" value={student.address} />
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex">
                  <Shield size={16} className="mr-3 shrink-0 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Guardian Information</p>
                    <p className="text-sm font-medium text-foreground">{student.guardian_name || '-'}</p>
                    <p className="text-sm text-muted-foreground">{student.guardian_phone || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <EnrolledCoursesList enrollments={enrollments} />
          <PaymentHistoryList payments={payments} />
          
          {/* Latest Measurements Section */}
          <div className="card p-6 mt-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Latest Measurements</h3>
            {latestMeasurement ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Neck:</strong> {latestMeasurement.neck || '-'}</p>
                <p><strong>Chest:</strong> {latestMeasurement.chest || '-'}</p>
                <p><strong>Waist:</strong> {latestMeasurement.waist || '-'}</p>
                <p><strong>Hips:</strong> {latestMeasurement.hips || '-'}</p>
                <p><strong>Sleeve:</strong> {latestMeasurement.sleeve_length || '-'}</p>
                <p><strong>Inseam:</strong> {latestMeasurement.inseam || '-'}</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">No measurements recorded.</p>}
          </div>

          {/* Issued Certificates Section */}
          <div className="card p-6 mt-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Issued Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {certificates.map(cert => (
                  <li key={cert.id} className="py-3">
                    <p className="font-semibold">{cert.course_title}</p>
                    <p className="text-sm text-muted-foreground">Issued on: {new Date(cert.issue_date).toLocaleDateString()}</p>
                    {cert.pdf_file && (
                      <button 
                        onClick={() => handleDownload(cert)}
                        disabled={downloadingId === cert.id}
                        className="text-sm text-primary font-medium flex items-center gap-1 mt-1 disabled:opacity-50"
                      >
                        {downloadingId === cert.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {downloadingId === cert.id ? 'Downloading...' : 'Download Certificate (PDF)'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title="Enroll Student in Batch">
        <EnrollStudentForm studentId={student.id} onClose={() => setIsEnrollModalOpen(false)} onEnrolled={handleDataRefresh} />
      </Modal>
      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Log New Payment">
        <LogPaymentForm student={student} enrollments={enrollments} onClose={() => setIsPaymentModalOpen(false)} onPaid={handleDataRefresh} />
      </Modal>
      <Modal isOpen={isMeasurementModalOpen} onClose={() => setIsMeasurementModalOpen(false)} title="Add/Update Measurements">
        <MeasurementForm studentId={student.id} latestMeasurement={latestMeasurement} onClose={() => setIsMeasurementModalOpen(false)} onSaved={handleDataRefresh} />
      </Modal>
      <Modal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)} title="Issue New Certificate">
        <CertificateForm 
          studentId={student.id}
          enrollments={enrollments} 
          onClose={() => setIsCertificateModalOpen(false)} 
          onSaved={handleDataRefresh} 
        />
      </Modal>

    </div>
  );
}

// --- Sub-components ---
const ActionCard = ({ icon: Icon, label, onClick }) => ( 
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground rounded-lg shadow-sm border border-border hover:bg-accent transition-colors"
  > 
    <Icon size={20} className="mb-1 text-primary" /> 
    <span className="text-xs font-semibold">{label}</span> 
  </button> 
);
const InfoItem = ({ icon: Icon, label, value }) => ( 
  <div className="flex"> 
    <Icon size={16} className="mr-3 shrink-0 text-muted-foreground mt-1" /> 
    <div> 
      <p className="text-xs text-muted-foreground">{label}</p> 
      <p className="text-sm font-medium text-foreground">{value || '-'}</p> 
    </div> 
  </div> 
);

function EnrolledCoursesList({ enrollments }) { 
  return ( 
    <div className="card p-6 mt-4"> 
      <h3 className="text-lg font-semibold text-foreground mb-2">Enrolled Courses</h3> 
      {enrollments.length === 0 ? ( 
        <p className="text-sm text-muted-foreground">No courses enrolled yet.</p> 
      ) : ( 
        <ul className="divide-y divide-border"> 
          {enrollments.map(e => ( 
            <li key={e.id} className="py-3"> 
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-foreground">{e.batch_code} ({e.course_title})</p>
                <span className={`status-badge status-${e.status}`}>
                  {e.status}
                </span>
              </div>
              
              {/* --- UPDATE THIS SECTION --- */}
              <p className="text-xs text-muted-foreground mt-1">
                Started on: {new Date(e.enrolled_on).toLocaleDateString()}
              </p> 
              {e.completion_date && (
                <p className="text-xs text-muted-foreground">
                  Est. Completion: {new Date(e.completion_date).toLocaleDateString()}
                </p>
              )}
              {/* --- END UPDATE --- */}

            </li> 
          ))} 
        </ul> 
      )} 
    </div> 
  ); 
}

function PaymentHistoryList({ payments }) { 
  const totalPaid = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0); 
  return ( 
    <div className="card p-6 mt-4"> 
      <div className="flex justify-between items-center mb-2"> 
        <h3 className="text-lg font-semibold text-foreground">Payment History</h3> 
        <span className="text-lg font-bold text-green-600">Total Paid: ₹{totalPaid.toLocaleString('en-IN')}</span> 
      </div> 
      {payments.length === 0 ? ( 
        <p className="text-sm text-muted-foreground">No payments recorded yet.</p> 
      ) : ( 
        <ul className="divide-y divide-border"> 
          {payments.map(p => ( 
            <li key={p.id} className="py-3"> 
              <div className="flex justify-between items-center"> 
                <span className="text-sm font-semibold text-foreground">₹{parseFloat(p.amount).toLocaleString('en-IN')}</span> 
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{p.mode}</span> 
              </div> 
              <p className="text-sm text-muted-foreground">Receipt: {p.receipt_no}</p> 
              <p className="text-xs text-muted-foreground">Paid on: {new Date(p.date).toLocaleDateString()}</p> 
            </li> 
          ))} 
        </ul> 
      )} 
    </div> 
  ); 
}
function EnrollStudentForm({ studentId, onClose, onEnrolled }) { 
  const [batches, setBatches] = useState([]); 
  const [selectedBatch, setSelectedBatch] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => { 
    const fetchBatches = async () => { 
      try { 
        const res = await api.get('/batches/'); 
        setBatches(res.data.results || []); 
      } catch (err) { 
        setError('Failed to load batches'); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchBatches(); 
  }, []); 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    setError(null); 
    try { 
      await api.post('/enrollments/', { student: studentId, batch: selectedBatch, status: 'active' }); 
      onEnrolled(); 
      onClose(); 
    } catch (err) { 
      setError(err.response?.data?.detail || 'Failed to enroll student. They may already be in this batch.'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  return ( 
    <form onSubmit={handleSubmit} className="space-y-4"> 
      {error && <p className="form-error text-center">{error}</p>} 
      <div> 
        <label htmlFor="batch" className="form-label">Select Batch</label> 
        <select id="batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="form-input" required> 
          <option value="" disabled>-- Select a batch --</option> 
          {loading ? ( 
            <option disabled>Loading batches...</option> 
          ) : ( 
            batches.map(b => ( 
              <option key={b.id} value={b.id}> 
                {b.code} ({b.course_title}) 
              </option> 
            )) 
          )} 
        </select> 
      </div> 
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading || !selectedBatch}>{loading ? <Loader2 className="animate-spin" /> : 'Enroll Student'}</button> 
    </form> 
  ); 
}
function LogPaymentForm({ student, enrollments, onClose, onPaid }) {
  const [formData, setFormData] = useState({
    amount: '',
    mode: 'cash',
    txn_id: '',
    enrollment: enrollments[0]?.id.toString() || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectedEnrollment = enrollments.find(e => e.id.toString() === formData.enrollment);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnrollment) {
      setError('Please select a valid enrollment.');
      return;
    }
    setLoading(true);
    setError(null);
    const paymentData = {
      student: student.id,
      course: selectedEnrollment.course_id,
      batch: selectedEnrollment.batch,
      amount: formData.amount,
      mode: formData.mode,
      txn_id: formData.txn_id,
      receipt_no: `RCPT-${Date.now()}`
    };
    try {
      await api.post('/finance/receipts/', paymentData);
      onPaid();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log payment.');
    } finally {
      setLoading(false);
    }
  };
  if (enrollments.length === 0) {
    return (
      <p className="text-center text-red-600">This student is not enrolled in any course. Please enroll them first.</p>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div>
        <label htmlFor="enrollment" className="form-label">For Which Course/Batch?</label>
        <select
          id="enrollment"
          name="enrollment"
          value={formData.enrollment}
          onChange={handleChange}
          className="form-input"
          required
        >
          {enrollments.map(e => (
            <option key={e.id} value={e.id}>
              {e.batch_code} ({e.course_title})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          className="form-input"
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="mode" className="form-label">Payment Mode</label>
        <select
          id="mode"
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank Transfer</option>
          <option value="card">Card</option>
        </select>
      </div>
      {formData.mode !== 'cash' && (
        <div>
          <label htmlFor="txn_id" className="form-label">Transaction ID (Optional)</label>
          <input
            type="text"
            name="txn_id"
            id="txn_id"
            value={formData.txn_id}
            onChange={handleChange}
            className="form-input"
            placeholder="UPI or Bank Ref ID"
          />
        </div>
      )}
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Log Payment'}</button>
    </form>
  );
}
function CertificateForm({ studentId, enrollments, onClose, onSaved }) {
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const eligibleEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'completed');
  useEffect(() => {
    if (eligibleEnrollments.length > 0 && !selectedEnrollmentId) {
      setSelectedEnrollmentId(eligibleEnrollments[0].id.toString());
    }
  }, [eligibleEnrollments, selectedEnrollmentId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const enrollment = eligibleEnrollments.find(e => e.id.toString() === selectedEnrollmentId);
    if (!enrollment) {
      setError("Please select a valid enrollment.");
      setLoading(false);
      return;
    }
    try {
      await api.post('/certificates/', {
        student: studentId,
        course: enrollment.course_id,
        remarks: "Issued via admin portal"
      });
      onSaved();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.[0] || 
                       (err.response?.data?.non_field_errors?.[0]) ||
                       'Failed to issue certificate. It may already exist for this student and course.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  if (eligibleEnrollments.length === 0) {
    return <p className="text-center text-muted-foreground">This student has no active or completed enrollments eligible for a certificate.</p>;
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      <div>
        <label htmlFor="enrollment" className="form-label">Select Enrollment to Certify</label>
        <select
          id="enrollment"
          value={selectedEnrollmentId}
          onChange={(e) => setSelectedEnrollmentId(e.target.value)}
          className="form-input"
          required
        >
          {eligibleEnrollments.map(e => (
            <option key={e.id} value={e.id}>
              {e.batch_code} ({e.course_title})
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-muted-foreground">
        This will generate a certificate for the selected course.
      </p>
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading || !selectedEnrollmentId}>
        {loading ? <Loader2 className="animate-spin" /> : 'Generate and Issue Certificate'}
      </button>
    </form>
  );
}

export default StudentDetailPage;