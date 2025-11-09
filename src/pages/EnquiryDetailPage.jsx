import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Clock, UserCheck, ArrowRight, Edit3 } from 'lucide-react';
import api from '../services/api.js';
import BackButton from '../components/BackButton.jsx';
import Modal from '../components/Modal.jsx';
import StudentConversionForm from '../components/StudentConversionForm.jsx';

/**
 * Shows the details for a single enquiry and allows converting it
 * into a student.
 */
function EnquiryDetailPage() {
  const { id } = useParams(); // Get the enquiry ID from the URL
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/enquiries/${id}/`);
        setEnquiry(response.data);
      } catch (err) {
        setError('Could not fetch enquiry details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiry();
  }, [id]); // Re-fetch if the ID in the URL changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <BackButton />
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="p-4">
        <BackButton />
        <p>Enquiry not found.</p>
      </div>
    );
  }

  // Helper to format the date
  const formattedDate = new Date(enquiry.created_at).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <BackButton />

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-noor-heading mb-1">
              {enquiry.name}
            </h1>
            <span className={`status-badge status-${enquiry.status}`}>
              {enquiry.status}
            </span>
          </div>
          {/* Show Convert button only if status is not 'converted' */}
          {enquiry.status !== 'converted' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <UserCheck size={18} className="mr-2" />
              Convert to Student
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center text-gray-700">
            <Phone size={18} className="mr-3 text-noor-primary" />
            <span>{enquiry.phone}</span>
          </div>
          {enquiry.email && (
            <div className="flex items-center text-gray-700">
              <Mail size={18} className="mr-3 text-noor-primary" />
              <span>{enquiry.email}</span>
            </div>
          )}
          <div className="flex items-center text-gray-700">
            <ArrowRight size={18} className="mr-3 text-noor-primary" />
            <span>Interested in: <strong>{enquiry.course_interest}</strong></span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-3" />
            <span>Received on: {formattedDate}</span>
          </div>
        </div>

        {/* Notes Section */}
        {enquiry.notes && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Edit3 size={16} className="mr-2 text-gray-500" /> Notes
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">{enquiry.notes}</p>
          </div>
        )}
      </div>

      {/* Conversion Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Convert Enquiry to Student"
      >
        <StudentConversionForm
          enquiry={enquiry}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default EnquiryDetailPage;