import React, { useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course_interest: '',
  });
  const [isLoading, setIsLoading] = useState(false); // <-- Only loading state is needed

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = api.post('/enquiries/', {
      ...formData,
      status: 'new', // Automatically set status
    });

    try {
      await toast.promise(promise, {
        loading: 'Submitting your enquiry...',
        success: 'Thank you! We will contact you soon.',
        error: (err) => {
          // Extract the first error message from the backend
          if (err.response?.data) {
            const errors = err.response.data;
            const firstErrorKey = Object.keys(errors)[0];
            return `${firstErrorKey}: ${errors[firstErrorKey][0]}`;
          }
          return 'Failed to submit. Please try again.';
        },
      });

      // On success, reset the form
      setFormData({ name: '', phone: '', course_interest: '' });
    } catch (err) {
      // The error is already handled by the toast
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-card p-8 shadow-md border border-border">
      <h3 className="text-2xl font-bold text-foreground">Enquire Now</h3>
      <p className="mt-2 text-muted-foreground">
        Get a call back from our team.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="course_interest" className="form-label">Course of Interest</label>
          <input
            type="text"
            name="course_interest"
            id="course_interest"
            value={formData.course_interest}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full justify-center py-3"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Request Call Back'
          )}
        </button>
      </form>
    </div>
  );
}

export default EnquiryForm;