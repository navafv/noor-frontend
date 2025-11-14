import React from 'react';
import Modal from './Modal.jsx';
import { History } from 'lucide-react';

/**
 * A modal to display the full history of a student's measurements.
 *
 * Props:
 * - isOpen: (boolean) Controls if the modal is visible.
 * - onClose: (function) Called when the modal is asked to close.
 * - measurements: (array) The full list of measurement objects.
 */
function MeasurementHistoryModal({ isOpen, onClose, measurements }) {
  // Sort measurements by date, newest first
  const sortedMeasurements = [...measurements].sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Measurement History">
      <div className="max-h-[60vh] overflow-y-auto">
        {sortedMeasurements.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">
            No measurements have been recorded for this student.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="table-header">Date Taken</th>
                  <th className="table-header text-center">Neck</th>
                  <th className="table-header text-center">Chest</th>
                  <th className="table-header text-center">Waist</th>
                  <th className="table-header text-center">Hips</th>
                  <th className="table-header text-center">Sleeve</th>
                  <th className="table-header text-center">Inseam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedMeasurements.map(m => (
                  <tr key={m.id}>
                    <td className="table-cell font-medium">
                      {new Date(m.date_taken).toLocaleDateString()}
                    </td>
                    <td className="table-cell text-center">{m.neck || '-'}</td>
                    <td className="table-cell text-center">{m.chest || '-'}</td>
                    <td className="table-cell text-center">{m.waist || '-'}</td>
                    <td className="table-cell text-center">{m.hips || '-'}</td>
                    <td className="table-cell text-center">{m.sleeve_length || '-'}</td>
                    <td className="table-cell text-center">{m.inseam || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Inject table styles (we can reuse styles from AttendanceAnalyticsPage)
const tableStyles = `
  .table-header {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .table-cell {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    white-space: nowrap;
  }
`;
const styleSheetId = 'custom-table-styles';
if (!document.getElementById(styleSheetId)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = styleSheetId;
  styleSheet.type = "text/css";
  styleSheet.innerText = tableStyles;
  document.head.appendChild(styleSheet);
}

export default MeasurementHistoryModal;