import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const MeasurementForm = ({ studentId, measurementId, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    neck: '', chest: '', waist: '', hips: '', sleeve_length: '', inseam: '', notes: ''
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        neck: initialData.neck || '',
        chest: initialData.chest || '',
        waist: initialData.waist || '',
        hips: initialData.hips || '',
        sleeve_length: initialData.sleeve_length || '',
        inseam: initialData.inseam || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {};
    Object.keys(formData).forEach(key => {
        payload[key] = formData[key] === '' ? null : formData[key];
    });

    try {
      if (measurementId) {
        // Update Mode
        await api.patch(`/students/${studentId}/measurements/${measurementId}/`, payload);
        toast.success("Measurement updated");
      } else {
        // Create Mode
        await api.post(`/students/${studentId}/measurements/`, payload);
        toast.success("Measurement saved");
        setFormData({ neck: '', chest: '', waist: '', hips: '', sleeve_length: '', inseam: '', notes: '' });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
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
      
      <div className="flex gap-2">
        {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold cursor-pointer hover:bg-gray-200">
                Cancel
            </button>
        )}
        <button type="submit" className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg cursor-pointer hover:bg-primary-700">
            {measurementId ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default MeasurementForm;