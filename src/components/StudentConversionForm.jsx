import React, { useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function StudentConversionForm({ enquiry, onSuccess }) {
  const [formData, setFormData] = useState({
    user_payload: {
      first_name: enquiry?.name.split(' ')[0] || '',
      last_name: enquiry?.name.split(' ').slice(1).join(' ') || '',
      phone: enquiry?.phone || '',
      email: enquiry?.email || '',
      username: '',
      password: '',
    },
    guardian_name: '',
    guardian_phone: '',
    address: '',
    admission_date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserPayloadChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      user_payload: {
        ...prev.user_payload,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { user_payload } = formData;
    if (!user_payload.username || !user_payload.password) {
      toast.error('Username and Password are required.');
      setIsLoading(false);
      return;
    }

    const promise = api.post('/students/', formData);

    try {
      const newStudent = await toast.promise(promise, {
        loading: 'Creating student account...',
        success: 'Student created successfully!',
        error: (err) => {
          // Parse complex backend errors
          const errors = err.response?.data;
          if (errors?.user_payload) {
            const userErrors = errors.user_payload;
            const key = Object.keys(userErrors)[0];
            return `User Error: ${key} - ${userErrors[key][0]}`;
          }
          if (errors) {
            const key = Object.keys(errors)[0];
            return `${key}: ${errors[key][0]}`;
          }
          return 'Conversion failed. Please check fields.';
        },
      });

      if (onSuccess) {
        onSuccess(newStudent.data);
      }

    } catch (err) {
      // Error is already toasted
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      <p className="text-sm text-muted-foreground">
        Create a new student profile and user account for <span className="font-semibold text-foreground">{enquiry.name}</span>.
      </p>
      
      {/* Student Fields */}
      <h4 className="font-semibold text-foreground border-b border-border pb-1">Student Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="First Name" name="first_name" value={formData.user_payload.first_name} onChange={handleUserPayloadChange} required />
        <FormInput label="Last Name" name="last_name" value={formData.user_payload.last_name} onChange={handleUserPayloadChange} />
        <FormInput label="Phone" name="phone" value={formData.user_payload.phone} onChange={handleUserPayloadChange} required />
        <FormInput label="Email" name="email" type="email" value={formData.user_payload.email} onChange={handleUserPayloadChange} />
        <FormInput label="Admission Date" name="admission_date" type="date" value={formData.admission_date} onChange={handleChange} required />
      </div>
      <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />

      {/* Guardian Fields */}
      <h4 className="font-semibold text-foreground border-b border-border pb-1 pt-2">Guardian Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleChange} required />
        <FormInput label="Guardian Phone" name="guardian_phone" value={formData.guardian_phone} onChange={handleChange} required />
      </div>

      {/* Account Fields */}
      <h4 className="font-semibold text-foreground border-b border-border pb-1 pt-2">Account Login</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Username" name="username" value={formData.user_payload.username} onChange={handleUserPayloadChange} required />
        <FormInput label="Password" name="password" type="password" value={formData.user_payload.password} onChange={handleUserPayloadChange} required />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : `Create Student & Mark as Converted`}
        </button>
      </div>
    </form>
  );
}

// Helper sub-component
const FormInput = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="form-label">{label}</label>
    <input id={name} name={name} className="form-input" {...props} />
  </div>
);

export default StudentConversionForm;