import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  ChevronLeft,
  Phone,
  Mail,
  Home,
  Shield,
  BookOpen,
  DollarSign,
  Ruler,
  CheckSquare,
  Loader2,
} from 'lucide-react';
import api from '@/services/api.js';
import Modal from '@/components/Modal.jsx';
import MeasurementForm from '@/components/MeasurementForm.jsx'; // <-- IMPORT NEW COMPONENT

/**
 * Shows all details for a single student.
 */
function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Get navigate hook
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [measurements, setMeasurements] = useState([]); // <-- State for measurements
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false); // <-- State for new modal
  
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all data in parallel
      const [studentRes, enrollmentsRes, paymentsRes, measurementsRes] = await Promise.all([
        api.get(`/students/${id}/`),
        api.get(`/enrollments/?student=${id}`),
        api.get(`/fees/receipts/?student=${id}`),
        api.get(`/students/${id}/measurements/`), // <-- Fetch measurements
      ]);
      
      setStudent(studentRes.data);
      setEnrollments(enrollmentsRes.data.results || []);
      setPayments(paymentsRes.data.results || []);
      setMeasurements(measurementsRes.data.results || []); // <-- Set measurements

    } catch (err) {
      setError('Could not fetch student details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleDataRefresh = () => {
    fetchStudentData();
  };
  
  // Get the most recent measurement
  const latestMeasurement = measurements.length > 0 ? measurements[0] : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-noor-pink" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Link to="/admin/students" className="flex items-center gap-1 text-noor-pink mb-4">
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Students</span>
        </Link>
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!student) {
    return <div className="p-4">Student not found.</div>;
  }

  const photoUrl = student.photo
    ? student.photo
    : `https://placehold.co/400x400/fff8fb/ec4899?text=${getInitials(
        student.user.first_name,
        student.user.last_name
      )}`;

  return (
    <div className="flex h-screen flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-lg items-center px-4">
          <Link to="/admin/students" className="flex items-center gap-1 text-noor-pink">
            <ChevronLeft size={20} />
            <span className="font-medium">All Students</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-lg pb-20">
          {/* Profile Header */}
          <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col items-center">
            <img
              src={photoUrl}
              alt="Student Photo"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md -mt-16"
              onError={(e) => { e.target.src = `https://placehold.co/400x400/fff8fb/ec4899?text=${getInitials(student.user.first_name, student.user.last_name)}`; }}
            />
            <h1 className="text-2xl font-bold text-noor-heading mt-4">
              {student.user.first_name} {student.user.last_name}
            </h1>
            <p className="text-sm text-gray-500">
              Reg No: {student.reg_no}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <ActionCard
              icon={BookOpen}
              label="Enroll in Course"
              onClick={() => setIsEnrollModalOpen(true)}
            />
            <ActionCard
              icon={DollarSign}
              label="Log Payment"
              onClick={() => setIsPaymentModalOpen(true)}
            />
            {/* --- UPDATE THIS ONCLICK --- */}
            <ActionCard
              icon={Ruler}
              label="Measurements"
              onClick={() => setIsMeasurementModalOpen(true)}
            />
            {/* --- UPDATE THIS ONCLICK --- */}
            <ActionCard
              icon={CheckSquare}
              label="Attendance"
              onClick={() => navigate('/admin/attendance')} // <-- Link to new page
            />
          </div>

          {/* Details Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-noor-heading mb-4">
              Student Information
            </h3>
            <div className="space-y-4">
              <InfoItem icon={Phone} label="Phone" value={student.user.phone} />
              {student.user.email && (
                <InfoItem icon={Mail} label="Email" value={student.user.email} />
              )}
              <InfoItem icon={Home} label="Address" value={student.address} />
              <div className="border-t pt-4 mt-4">
                <InfoItem
                  icon={Shield}
                  label="Guardian"
                  value={student.guardian_name}
                />
                <InfoItem
                  icon={Phone}
                  label="Guardian Phone"
                  value={student.guardian_phone}
                  isSubItem={true}
                />
              </div>
            </div>
          </div>
          
          <EnrolledCoursesList enrollments={enrollments} />
          <PaymentHistoryList payments={payments} />

          {/* --- ADD MEASUREMENTS SECTION --- */}
          <div className="rounded-xl bg-white p-6 shadow-sm mt-4">
            <h3 className="text-lg font-semibold text-noor-heading mb-2">
              Latest Measurements
            </h3>
            {latestMeasurement ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Neck:</strong> {latestMeasurement.neck || '-'}</p>
                <p><strong>Chest:</strong> {latestMeasurement.chest || '-'}</p>
                <p><strong>Waist:</strong> {latestMeasurement.waist || '-'}</p>
                <p><strong>Hips:</strong> {latestMeasurement.hips || '-'}</p>
                <p><strong>Sleeve:</strong> {latestMeasurement.sleeve_length || '-'}</p>
                <p><strong>Inseam:</strong> {latestMeasurement.inseam || '-'}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No measurements recorded yet.</p>
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

      {/* --- ADD NEW MODAL --- */}
      <Modal isOpen={isMeasurementModalOpen} onClose={() => setIsMeasurementModalOpen(false)} title="Add/Update Measurements">
        <MeasurementForm 
          studentId={student.id}
          latestMeasurement={latestMeasurement}
          onClose={() => setIsMeasurementModalOpen(false)} 
          onSaved={handleDataRefresh} 
        />
      </Modal>

    </div>
  );
}

// --- Reusable Sub-Components (ActionCard, InfoItem, EnrolledCoursesList, PaymentHistoryList) ---
// (These are the same as the previous step, no changes needed)
// ... (paste ActionCard component here)
// ... (paste InfoItem component here)
// ... (paste EnrolledCoursesList component here)
// ... (paste PaymentHistoryList component here)
// ... (paste EnrollStudentForm component here)
// ... (paste LogPaymentForm component here)

// --- (Make sure to copy all the sub-components from the previous step into this file) ---
// ... (ActionCard, InfoItem, EnrolledCoursesList, PaymentHistoryList, EnrollStudentForm, LogPaymentForm)

const ActionCard = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="btn-action-grid">
    <Icon size={20} className="mb-1" />
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

const InfoItem = ({ icon: Icon, label, value, isSubItem = false }) => (
  <div className={`flex ${isSubItem ? 'pl-9' : ''}`}>
    <Icon size={16} className="mr-3 shrink-0 text-gray-400 mt-1" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-noor-heading">{value || '-'}</p>
    </div>
  </div>
);

function EnrolledCoursesList({ enrollments }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm mt-4">
      <h3 className="text-lg font-semibold text-noor-heading mb-2">
        Enrolled Courses
      </h3>
      {enrollments.length === 0 ? (
        <p className="text-sm text-gray-500">No courses enrolled yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {enrollments.map(e => (
            <li key={e.id} className="py-3">
              <p className="text-sm font-semibold text-noor-heading">{e.batch_code} ({e.batch.course_title})</p>
              <p className="text-sm text-gray-500">Status: <span className="font-medium">{e.status}</span></p>
              <p className="text-xs text-gray-400">Enrolled on: {new Date(e.enrolled_on).toLocaleDateString()}</p>
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
    <div className="rounded-xl bg-white p-6 shadow-sm mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-noor-heading">
          Payment History
        </h3>
        <span className="text-lg font-bold text-green-600">
          Total Paid: ₹{totalPaid.toFixed(2)}
        </span>
      </div>
      {payments.length === 0 ? (
        <p className="text-sm text-gray-500">No payments recorded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {payments.map(p => (
            <li key={p.id} className="py-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-noor-heading">₹{p.amount}</span>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{p.mode}</span>
              </div>
              <p className="text-sm text-gray-500">Receipt: {p.receipt_no}</p>
              <p className="text-xs text-gray-400">Paid on: {new Date(p.date).toLocaleDateString()}</p>
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
      await api.post('/enrollments/', {
        student: studentId,
        batch: selectedBatch,
        status: 'active'
      });
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
        <select
          id="batch"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="form-input"
          required
        >
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
      <button type="submit" className="btn-primary w-full justify-center" disabled={loading || !selectedBatch}>
        {loading ? <Loader2 className="animate-spin" /> : 'Enroll Student'}
      </button>
    </form>
  );
}

function LogPaymentForm({ student, enrollments, onClose, onPaid }) {
  const [formData, setFormData] = useState({
    amount: '',
    mode: 'cash',
    txn_id: '',
    enrollment: enrollments[0]?.id.toString() || ''
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
      course: selectedEnrollment.batch.course,
      batch: selectedEnrollment.batch.id,
      amount: formData.amount,
      mode: formData.mode,
      txn_id: formData.txn_id,
      receipt_no: `RCPT-${Date.now()}`
    };

    try {
      await api.post('/fees/receipts/', paymentData);
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
      <p className="text-center text-red-600">
        This student is not enrolled in any course. Please enroll them first.
      </p>
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
              {e.batch_code} ({e.batch.course_title})
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

      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Log Payment'}
      </button>
    </form>
  );
}

export default StudentDetailPage;