import React, { useState, useEffect } from 'react';
import api from '@/services/api.js';
import { Loader2 } from 'lucide-react';

function MeasurementForm({ studentId, latestMeasurement, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    sleeve_length: '',
    inseam: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if we have the latest measurements
  useEffect(() => {
    if (latestMeasurement) {
      setFormData({
        neck: latestMeasurement.neck || '',
        chest: latestMeasurement.chest || '',
        waist: latestMeasurement.waist || '',
        hips: latestMeasurement.hips || '',
        sleeve_length: latestMeasurement.sleeve_length || '',
        inseam: latestMeasurement.inseam || '',
        notes: latestMeasurement.notes || '',
      });
    }
  }, [latestMeasurement]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter out empty strings and send them as null
    const dataToSend = { ...formData };
    for (const key in dataToSend) {
      if (dataToSend[key] === '') {
        dataToSend[key] = null;
      }
    }

    try {
      // POST to the nested route we fixed in the backend
      await api.post(`/students/${studentId}/measurements/`, dataToSend);
      onSaved(); // Refresh parent data
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save measurements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Neck" name="neck" value={formData.neck} onChange={handleChange} />
        <FormInput label="Chest" name="chest" value={formData.chest} onChange={handleChange} />
        <FormInput label="Waist" name="waist" value={formData.waist} onChange={handleChange} />
        <FormInput label="Hips" name="hips" value={formData.hips} onChange={handleChange} />
        <FormInput label="Sleeve Length" name="sleeve_length" value={formData.sleeve_length} onChange={handleChange} />
        <FormInput label="Inseam" name="inseam" value={formData.inseam} onChange={handleChange} />
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

      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Measurements'}
      </button>
    </form>
  );
}

// Helper for form inputs
const FormInput = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="number"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="form-input"
      step="0.01"
      placeholder="0.0"
    />
  </div>
);

export default MeasurementForm;