import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const MeasurementForm = ({ studentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    neck: '', chest: '', waist: '', hips: '', sleeve_length: '', inseam: '', notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/students/${studentId}/measurements/`, formData);
      toast.success("Measurements saved");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="neck" placeholder="Neck (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
        <input name="chest" placeholder="Chest (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
        <input name="waist" placeholder="Waist (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
        <input name="hips" placeholder="Hips (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
        <input name="sleeve_length" placeholder="Sleeve (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
        <input name="inseam" placeholder="Inseam (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
      </div>
      <textarea name="notes" placeholder="Additional Notes..." className="w-full p-3 rounded-xl border border-gray-200 outline-none" onChange={handleChange} />
      <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer">Save Measurements</button>
    </form>
  );
};

export default MeasurementForm;