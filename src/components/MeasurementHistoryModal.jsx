import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from './Modal';

const MeasurementHistoryModal = ({ studentId, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      api.get(`/students/${studentId}/measurements/`)
        .then(res => setHistory(res.data.results || []))
        .finally(() => setLoading(false));
    }
  }, [isOpen, studentId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Measurement History">
      {loading ? <p className="text-center text-gray-400">Loading...</p> : 
       history.length === 0 ? <p className="text-center text-gray-400">No history found.</p> : (
        <div className="space-y-4">
          {history.map((m) => (
            <div key={m.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-primary-600 font-bold mb-2">{m.date_taken}</p>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                {m.neck && <p>Neck: {m.neck}"</p>}
                {m.chest && <p>Chest: {m.chest}"</p>}
                {m.waist && <p>Waist: {m.waist}"</p>}
                {m.hips && <p>Hips: {m.hips}"</p>}
                {m.sleeve_length && <p>Sleeve: {m.sleeve_length}"</p>}
              </div>
              {m.notes && <p className="text-xs text-gray-500 mt-2 italic">"{m.notes}"</p>}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default MeasurementHistoryModal;