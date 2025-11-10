import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Plus, UserCheck } from 'lucide-react';
import api from '@/services/api';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import StudentConversionForm from '@/components/StudentConversionForm';

function EnquiryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State for the conversion modal
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interest: '',
    notes: '',
    status: 'new',
  });

  // Fetch enquiry data if not new
  useEffect(() => {
    if (!isNew) {
      const fetchEnquiry = async () => {
        try {
          const response = await api.get(`/enquiries/${id}/`);
          setEnquiry(response.data);
          setFormData({
            name: response.data.name || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            course_interest: response.data.course_interest || '',
            notes: response.data.notes || '',
            status: response.data.status || 'new',
          });
        } catch (err) {
          setError('Failed to fetch enquiry details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEnquiry();
    }
  }, [id, isNew]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isNew) {
        await api.post('/enquiries/', formData);
        setSuccess('Enquiry created successfully!');
        navigate('/admin/enquiries');
      } else {
        await api.patch(`/enquiries/${id}/`, formData);
        setSuccess('Enquiry updated successfully!');
        setEnquiry(prev => ({ ...prev, ...formData }));
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save enquiry. Please check your input.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={isNew ? 'New Enquiry' : `Enquiry: ${enquiry?.name}`} />
      
      <main className="p-4">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div>
            <label htmlFor="course_interest" className="form-label">Course Interest</label>
            <input
              type="text"
              name="course_interest"
              id="course_interest"
              value={formData.course_interest}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows="3"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              disabled={formData.status === 'converted'}
            >
              <option value="new">New</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted" disabled>Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
              disabled={loading || formData.status === 'converted'}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Changes</>}
            </button>
            
            {!isNew && enquiry?.status !== 'converted' && (
              <button
                type="button"
                onClick={() => setIsConvertModalOpen(true)} // <-- FIX: Open modal
                className="btn-secondary flex-1 justify-center"
                disabled={loading}
              >
                <UserCheck size={18} className="mr-2" /> Convert to Student
              </button>
            )}
          </div>
        </form>
      </main>

      {/* --- FIX: Add the Modal --- */}
      {!isNew && (
        <Modal 
          isOpen={isConvertModalOpen} 
          onClose={() => setIsConvertModalOpen(false)} 
          title="Convert Enquiry to Student"
        >
          <StudentConversionForm 
            enquiry={enquiry} 
            onClose={() => setIsConvertModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}

export default EnquiryDetailPage;