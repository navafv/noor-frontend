import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Plus } from 'lucide-react'; // Assuming you have these
import api from '@/services/api';
import BackButton from '@/components/BackButton'; // Assuming you have this

function EnquiryDetailPage() {
  const { id } = useParams(); // 'id' will be 'new' for new enquiries
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(isNew ? false : true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [users, setUsers] = useState([]); // <-- NEW STATE FOR USERS
  const [loadingUsers, setLoadingUsers] = useState(true); // <-- NEW STATE

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferred_course: '',
    message: '',
    status: 'new',
    assigned_to: '',
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
            address: response.data.address || '',
            preferred_course: response.data.preferred_course || '',
            message: response.data.message || '',
            status: response.data.status || 'new',
            assigned_to: response.data.assigned_to || '',
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

  // Fetch staff users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/', { params: { is_staff: true } });
        setUsers(response.data.results);
      } catch (error) {
        console.error("Failed to fetch users for assignment:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

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
        // Optionally navigate to the new enquiry's detail page or back to list
        navigate('/admin/enquiries');
      } else {
        await api.patch(`/enquiries/${id}/`, formData);
        setSuccess('Enquiry updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save enquiry. Please check your input.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToStudent = async () => {
    if (!enquiry || enquiry.status === 'converted') return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Assuming your backend has an endpoint for converting enquiry to student
      // This is often a PUT or POST request to a specific 'convert' endpoint for the enquiry
      const response = await api.post(`/enquiries/${id}/convert_to_student/`);
      setSuccess('Enquiry converted to student successfully!');
      setEnquiry(prev => ({ ...prev, status: 'converted' })); // Update local state
      navigate(`/admin/student/${response.data.id}`); // Navigate to new student's page
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert enquiry to student.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading || loadingUsers) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-noor-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error && !isNew) { // Only show error if trying to load an existing enquiry
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <BackButton />
        <p className="form-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <BackButton />
      <h1 className="text-2xl font-bold text-noor-heading mb-6">
        {isNew ? 'New Enquiry' : `Enquiry: ${enquiry?.name}`}
      </h1>

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm space-y-4">
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
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
          <label htmlFor="address" className="form-label">Address (Optional)</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            rows="2"
          />
        </div>

        {/* Course and Message */}
        <div>
          <label htmlFor="preferred_course" className="form-label">Preferred Course (Optional)</label>
          <input
            type="text"
            name="preferred_course"
            id="preferred_course"
            value={formData.preferred_course}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="message" className="form-label">Message/Notes (Optional)</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            className="form-input"
            rows="3"
          />
        </div>

        {/* Status and Assignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="form-label">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="new">New</option>
              <option value="follow_up">Follow Up</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="assigned_to" className="form-label">Assigned To</label>
            <select
              name="assigned_to"
              id="assigned_to"
              value={formData.assigned_to || ''} // Handle null/empty string
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-between gap-4">
          <button
            type="submit"
            className="btn-primary flex-1 justify-center"
            disabled={loading}
          >
            {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Enquiry</>}
          </button>
          {!isNew && enquiry?.status !== 'converted' && (
            <button
              type="button"
              onClick={handleConvertToStudent}
              className="btn-secondary flex-1 justify-center"
              disabled={loading}
            >
              {loading ? 'Converting...' : <><Plus size={18} className="mr-2" /> Convert to Student</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EnquiryDetailPage;