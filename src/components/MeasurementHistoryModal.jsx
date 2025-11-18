import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from './Modal';
import { Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MeasurementForm from './MeasurementForm';

const MeasurementHistoryModal = ({ studentId, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const fetchHistory = () => {
    setLoading(true);
    api.get(`/students/${studentId}/measurements/`)
      .then(res => setHistory(res.data.results || []))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen && studentId) {
      setEditingItem(null);
      fetchHistory();
    }
  }, [isOpen, studentId]);

  const handleDelete = async (measureId) => {
    if (!confirm("Delete this measurement record?")) return;
    try {
      await api.delete(`/students/${studentId}/measurements/${measureId}/`);
      toast.success("Deleted");
      fetchHistory();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleEditSuccess = () => {
      setEditingItem(null);
      fetchHistory();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? "Edit Measurement" : "Measurement History"}>
      {editingItem ? (
          <div>
              <button onClick={() => setEditingItem(null)} className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-primary-600">
                  <ArrowLeft size={16} /> Back to History
              </button>
              <MeasurementForm 
                  studentId={studentId} 
                  measurementId={editingItem.id} 
                  initialData={editingItem} 
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingItem(null)}
              />
          </div>
      ) : (
        <>
            {loading ? <p className="text-center text-gray-400">Loading...</p> : 
             history.length === 0 ? <p className="text-center text-gray-400">No history found.</p> : (
                <div className="space-y-4">
                {history.map((m) => (
                    <div key={m.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-primary-600 font-bold">{m.date_taken}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingItem(m)} className="text-blue-400 hover:text-blue-600 p-1">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                            {m.neck && <p>Neck: {m.neck}"</p>}
                            {m.chest && <p>Chest: {m.chest}"</p>}
                            {m.waist && <p>Waist: {m.waist}"</p>}
                            {m.hips && <p>Hips: {m.hips}"</p>}
                            {m.sleeve_length && <p>Sleeve: {m.sleeve_length}"</p>}
                            {m.inseam && <p>Inseam: {m.inseam}"</p>}
                        </div>
                        {m.notes && <p className="text-xs text-gray-500 mt-2 italic">"{m.notes}"</p>}
                    </div>
                ))}
                </div>
            )}
        </>
      )}
    </Modal>
  );
};

export default MeasurementHistoryModal;