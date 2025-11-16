import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import api from '../services/api.js';
import { toast } from 'react-hot-toast';
import { Loader2, Scale } from 'lucide-react';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function MeasurementHistoryModal({ isOpen, onClose, studentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/students/${studentId}/measurements/`);
          setHistory(res.data.results || []);
        } catch (err) {
          toast.error('Failed to load measurement history.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, studentId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Measurement History" size="lg">
      <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Scale size={40} className="mx-auto mb-4" />
            <p>No measurement history found for this student.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {history.map((entry) => (
              <li key={entry.id} className="p-4 rounded-lg bg-accent/50 border border-border">
                <p className="font-semibold text-foreground">
                  {formatDate(entry.date_taken)}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
                  {entry.neck && <DetailItem label="Neck" value={entry.neck} />}
                  {entry.chest && <DetailItem label="Chest" value={entry.chest} />}
                  {entry.waist && <DetailItem label="Waist" value={entry.waist} />}
                  {entry.hips && <DetailItem label="Hips" value={entry.hips} />}
                  {entry.sleeve_length && <DetailItem label="Sleeve" value={entry.sleeve_length} />}
                  {entry.inseam && <DetailItem label="Inseam" value={entry.inseam} />}
                </div>
                {entry.notes && (
                  <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50">
                    <strong>Notes:</strong> {entry.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-muted-foreground">{label}: </span>
    <span className="font-medium text-foreground">{value} cm</span>
  </div>
);

export default MeasurementHistoryModal;