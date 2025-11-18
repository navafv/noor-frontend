import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const MeasurementForm = ({ studentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    neck: '', chest: '', waist: '', hips: '', sleeve_length: '', inseam: '', notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {};
    Object.keys(formData).forEach(key => {
        payload[key] = formData[key] === '' ? null : formData[key];
    });

    try {
      await api.post(`/students/${studentId}/measurements/`, payload);
      toast.success("Measurements saved");
      setFormData({ neck: '', chest: '', waist: '', hips: '', sleeve_length: '', inseam: '', notes: '' }); // Reset form
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save measurements");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="number" step="0.01" name="neck" placeholder="Neck (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.neck} onChange={handleChange} />
        <input type="number" step="0.01" name="chest" placeholder="Chest (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.chest} onChange={handleChange} />
        <input type="number" step="0.01" name="waist" placeholder="Waist (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.waist} onChange={handleChange} />
        <input type="number" step="0.01" name="hips" placeholder="Hips (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.hips} onChange={handleChange} />
        <input type="number" step="0.01" name="sleeve_length" placeholder="Sleeve (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.sleeve_length} onChange={handleChange} />
        <input type="number" step="0.01" name="inseam" placeholder="Inseam (in)" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.inseam} onChange={handleChange} />
      </div>
      <textarea name="notes" placeholder="Additional Notes..." className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={formData.notes} onChange={handleChange} />
      <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg mt-2 cursor-pointer hover:bg-primary-700">Save Measurements</button>
    </form>
  );
};

export default MeasurementForm;