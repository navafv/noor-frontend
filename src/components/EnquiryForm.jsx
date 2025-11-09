import React, { useState } from 'react';
import api from '@/services/api.js'; // <-- UPDATED
import { Loader2 } from 'lucide-react';

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interest: '3 Month Course',
    source: 'Website',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const dataToSend = {
      ...formData,
      notes: 'Enquiry from website landing page.',
      status: 'new',
    };

    try {
      // This is now an unauthenticated request, which is fine!
      await api.post('/enquiries/', dataToSend);
      setMessage(
        'Thank you! We have received your enquiry and will contact you soon.'
      );
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_interest: '3 Month Course',
        source: 'Website',
      });
    } catch (err) {
      setError('An error occurred. Please check your details and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {message && (
        <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="course_interest"
          className="text-sm font-medium text-gray-700"
        >
          Which course are you interested in?
        </label>
        <select
          id="course_interest"
          name="course_interest"
          value={formData.course_interest}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-noor-pink focus:ring-noor-pink"
        >
          <option value="3 Month Course">3 Month Course</option>
          <option value="6 Month Course">6 Month Course</option>
          <option value="Other">Other (please specify in call)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-noor-pink py-3 px-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-noor-pink-dark disabled:cursor-not-allowed disabled:bg-pink-300"
      >
        {loading ? 'Submitting...' : 'Register for Details'}
      </button>
    </form>
  );
}

export default EnquiryForm;