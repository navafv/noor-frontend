import React, { useState } from 'react';
import api from '@/services/api.js';
import { X, Loader2, User, Phone, Mail } from 'lucide-react';
import Modal from './Modal.jsx';
import { useNavigate } from 'react-router-dom';

/**
 * This form handles the logic for converting a student Enquiry
 * into a full Student and creating their User account.
 *
 * Props:
 * - enquiry: The enquiry object with { name, phone, email, id }
 * - onClose: Function to call to close the modal
 */
function StudentConversionForm({ enquiry, onClose }) {
  const navigate = useNavigate();
  
  // Auto-generate a username suggestion
  const suggestedUsername = (enquiry.email?.split('@')[0] || enquiry.name.toLowerCase().replace(/[^a-z0-9]/g, '.'))
    .replace('..', '.'); // Clean up

  const [formData, setFormData] = useState({
    guardian_name: '',
    guardian_phone: '',
    address: '',
    username: suggestedUsername,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Split name into first_name and last_name
    const nameParts = enquiry.name.trim().split(' ');
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ') || ''; // <-- **FIX: Default to empty string, not firstname**

    // This structure MUST match your StudentSerializer's `create` method
    const studentData = {
      guardian_name: formData.guardian_name,
      guardian_phone: formData.guardian_phone,
      address: formData.address,
      user_payload: {
        username: formData.username,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
        email: enquiry.email || '', // Handle optional email
        phone: enquiry.phone,
      }
    };

    try {
      // 1. Create the new student (which also creates the user)
      // This POSTs to /api/v1/students/
      const studentResponse = await api.post('/students/', studentData);

      // 2. If successful, update the original enquiry to "converted"
      // This PATCHes /api/v1/enquiries/{id}/
      if (studentResponse.status === 201) {
        await api.patch(`/enquiries/${enquiry.id}/`, { status: 'converted' });
      }

      // 3. Close the modal and navigate to the new student's detail page
      onClose();
      navigate(`/admin/student/${studentResponse.data.id}`); // Go to new student

    } catch (err) {
      let errorMsg = 'Failed to create student. Please try again.';
      // Try to parse detailed error messages from Django
      if (err.response && err.response.data) {
         const errors = err.response.data;
         if (errors.user_payload && errors.user_payload.username) {
            errorMsg = `Username: ${errors.user_payload.username[0]}`;
         } else if (errors.user_payload && errors.user_payload.password) {
            errorMsg = `Password: ${errors.user_payload.password[0]}`;
         } else if (errors.reg_no) {
            errorMsg = `Reg No: ${errors.reg_no[0]}`;
         } else if (Array.isArray(errors)) {
           errorMsg = errors[0];
         } else if (typeof errors === 'object') {
            const firstKey = Object.keys(errors)[0];
            errorMsg = `${firstKey}: ${errors[firstKey][0]}`;
         }
      }
      setError(errorMsg);
      console.error("Conversion failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="form-error">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {/* Pre-filled Enquiry Info */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <h4 className="font-semibold text-foreground mb-3">Enquiry Information</h4>
        <div className="space-y-2">
          <InfoRow icon={User} label="Name" value={enquiry.name} />
          <InfoRow icon={Phone} label="Phone" value={enquiry.phone} />
          {enquiry.email && (
            <InfoRow icon={Mail} label="Email" value={enquiry.email} />
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-foreground">New Student Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="guardian_name" className="form-label">
              Guardian's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="guardian_name"
              id="guardian_name"
              value={formData.guardian_name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="guardian_phone" className="form-label">
              Guardian's Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="guardian_phone"
              id="guardian_phone"
              value={formData.guardian_phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="form-label">Full Address</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            rows="3"
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="font-semibold text-foreground">
          Student Account
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="username" className="form-label">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password for the student"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Create Student & Mark as Converted'}
        </button>
      </div>
    </form>
  );
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="w-4 h-4 text-muted-foreground mr-3" />
    <div className="flex-1">
      <span className="text-sm font-medium text-muted-foreground">{label}: </span>
      <span className="text-sm text-foreground font-semibold">{value}</span>
    </div>
  </div>
);

export default StudentConversionForm;