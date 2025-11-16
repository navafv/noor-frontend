import React, { useState } from 'react';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Define the fields
const measurementFields = [
  { name: 'neck', label: 'Neck' },
  { name: 'chest', label: 'Chest' },
  { name: 'waist', label: 'Waist' },
  { name: 'hips', label: 'Hips' },
  { name: 'sleeve_length', label: 'Sleeve Length' },
  { name: 'inseam', label: 'Inseam' },
];

function MeasurementForm({ studentId, onSuccess }) {
  const [formData, setFormData] = useState({
    date_taken: new Date().toISOString().split('T')[0],
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    sleeve_length: '',
    inseam: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter out empty string fields and convert to number
    const payload = { ...formData };
    for (const key of measurementFields.map(f => f.name)) {
      if (payload[key] === '') {
        payload[key] = null;
      } else if (payload[key] !== null) {
        payload[key] = parseFloat(payload[key]);
      }
    }

    const promise = api.post(`/students/${studentId}/measurements/`, payload);

    try {
      await toast.promise(promise, {
        loading: 'Saving measurements...',
        success: 'Measurements saved successfully!',
        error: (err) => err.response?.data?.detail || 'Failed to save measurements.',
      });
      
      if (onSuccess) {
        onSuccess();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {measurementFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="form-label">{field.label} (cm)</label>
            <input
              type="number"
              step="0.01"
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        ))}
      </div>
      
      <div>
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Save Measurements'}
        </button>
      </div>
    </form>
  );
}

export default MeasurementForm;