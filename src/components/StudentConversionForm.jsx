import React, { useState } from 'react';
import api from '@/services/api.js'; // <-- UPDATED
import { X, Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';
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
    const lastName = nameParts.join(' ') || firstName; // Use first name if no last name

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

      // 3. Close the modal and navigate to the new student list
      onClose();
      navigate('/admin/students');

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
         }
      }
      setError(errorMsg);
      console.error("Conversion failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Pre-filled Enquiry Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700">Enquiry Information</h4>
        <p className="text-sm text-gray-600">
          <strong>Name:</strong> {enquiry.name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Phone:</strong> {enquiry.phone}
        </p>
        {enquiry.email && (
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {enquiry.email}
          </p>
        )}
      </div>

      <h4 className="font-semibold text-noor-heading border-t pt-4">New Student Details</h4>
      
      {/* New Student Fields */}
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

      <div>
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

      <h4 className="font-semibold text-noor-heading border-t pt-4">
        Student Account
      </h4>

      {/* New User Fields */}
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
      
      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Create Student & Mark as Converted'}
        </button>
      </div>
    </form>
  );
}

export default StudentConversionForm;