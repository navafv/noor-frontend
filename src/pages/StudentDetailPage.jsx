import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, User, Phone, Mail, Home, Shield, Calendar, Edit, Plus, Scale } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import MeasurementForm from '../components/MeasurementForm.jsx';
import MeasurementHistoryModal from '../components/MeasurementHistoryModal.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/students/${id}/`);
      setStudent(res.data);
    } catch (err) {
      toast.error('Failed to load student details.');
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (loading || !student) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`${student.user.first_name} ${student.user.last_name}`}>
        <button 
          className="btn-secondary flex items-center gap-2"
          onClick={() => setIsEnrollModalOpen(true)}
        >
          <Plus size={18} />
          Enroll in Batch
        </button>
      </PageHeader>
      
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Student Details
                </h3>
                <span className={`status-badge ${student.active ? 'status-completed' : 'status-closed'}`}>
                  {student.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <dl className="space-y-4">
                <DetailItem icon={User} label="Full Name" value={`${student.user.first_name} ${student.user.last_name}`} />
                <DetailItem icon={Phone} label="Phone" value={student.user.phone} />
                <DetailItem icon={Mail} label="Email" value={student.user.email || 'N/A'} />
                <DetailItem icon={Home} label="Address" value={student.address || 'N/A'} />
                <DetailItem icon={Calendar} label="Admission Date" value={formatDate(student.admission_date)} />
                <DetailItem icon={Shield} label="Guardian Name" value={student.guardian_name} />
                <DetailItem icon={Phone} label="Guardian Phone" value={student.guardian_phone} />
              </dl>
            </div>
            
          </div>
          
          {/* Right Column: Actions */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-28 space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Actions
              </h3>
              <button 
                onClick={() => setIsMeasureModalOpen(true)}
                className="btn-primary w-full"
              >
                <Plus size={18} className="mr-2" />
                Add Measurements
              </button>
              <button 
                onClick={() => setIsHistoryModalOpen(true)}
                className="btn-outline w-full"
              >
                <Scale size={18} className="mr-2" />
                View Measurements
              </button>
              <button 
                onClick={() => navigate(`/admin/users/${student.user.id}`)} // Assumes a user edit page
                className="btn-outline w-full"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile/Login
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Enroll Student Modal (TODO) */}
      <Modal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
        title="Enroll Student in Batch"
      >
        <p className="text-muted-foreground">The enrollment form will go here.</p>
        {/* <EnrollmentForm studentId={student.id} /> */}
      </Modal>

      {/* Add Measurement Modal */}
      <Modal 
        isOpen={isMeasureModalOpen} 
        onClose={() => setIsMeasureModalOpen(false)} 
        title="Add New Measurements"
      >
        <MeasurementForm 
          studentId={student.id} 
          onSuccess={() => {
            setIsMeasureModalOpen(false);
            toast.success('Measurements saved!');
          }} 
        />
      </Modal>

      {/* View Measurements Modal */}
      <MeasurementHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        studentId={student.id}
      />
    </>
  );
}

// Helper component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4">
    <Icon className="w-5 h-5 text-primary shrink-0" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  </div>
);

export default StudentDetailPage;