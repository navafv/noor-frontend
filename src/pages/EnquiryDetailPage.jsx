import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, User, Phone, Mail, Book, Edit2, UserPlus } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import StudentConversionForm from '../components/StudentConversionForm.jsx';
import { toast } from 'react-hot-toast';

function EnquiryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/enquiries/${id}/`);
      setEnquiry(res.data);
      setNewStatus(res.data.status); // Set initial status for the dropdown
    } catch (err) {
      toast.error('Failed to load enquiry details.');
      navigate('/admin/enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (newStatus === enquiry.status) return;

    const promise = api.patch(`/enquiries/${id}/`, { status: newStatus });
    
    toast.promise(promise, {
      loading: 'Updating status...',
      success: (res) => {
        setEnquiry(res.data); // Update local state with new data
        return 'Status updated successfully!';
      },
      error: 'Failed to update status.',
    });
  };

  if (loading || !enquiry) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const isConverted = enquiry.status === 'converted';

  return (
    <>
      <PageHeader title={enquiry.name}>
        {!isConverted && (
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} />
            Convert to Student
          </button>
        )}
      </PageHeader>
      
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Enquiry Details
              </h3>
              <dl className="space-y-4">
                <DetailItem icon={User} label="Name" value={enquiry.name} />
                <DetailItem icon={Phone} label="Phone" value={enquiry.phone} />
                <DetailItem icon={Mail} label="Email" value={enquiry.email || 'N/A'} />
                <DetailItem icon={Book} label="Course Interest" value={enquiry.course_interest} />
              </dl>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Notes
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {enquiry.notes || 'No notes added.'}
              </p>
            </div>
          </div>
          
          {/* Right Column: Status */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-28">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Status
              </h3>
              {isConverted ? (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Converted to Student
                  </p>
                </div>
              ) : (
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="status" className="form-label">Update Status</label>
                    <select 
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="form-input"
                    >
                      <option value="new">New</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary w-full"
                    disabled={newStatus === enquiry.status}
                  >
                    Update
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Conversion Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Convert to Student"
        size="lg"
      >
        <StudentConversionForm 
          enquiry={enquiry} 
          onSuccess={(student) => {
            // On successful conversion, close modal, refetch data, and redirect
            setIsModalOpen(false);
            fetchEnquiry(); // Refreshes enquiry to show "Converted"
            toast.success('Conversion successful! Redirecting to student profile...');
            setTimeout(() => navigate(`/admin/student/${student.id}`), 2000);
          }}
        />
      </Modal>
    </>
  );
}

// Helper component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4">
    <Icon className="w-5 h-5 text-primary" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default EnquiryDetailPage;