import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Helper to format date string
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function StudentAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // This endpoint is defined in the backend for students
        const res = await api.get('/attendance/my-history/');
        setAttendance(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        toast.error('Failed to load attendance history.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'P') return 'status-completed'; // Green
    if (status === 'A') return 'status-closed';   // Red
    if (status === 'L') return 'status-active';    // Yellow
    return 'status-pending'; // Gray
  };

  return (
    <>
      <PageHeader title="My Attendance" />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <ul role="list" className="divide-y divide-border">
                {attendance.length > 0 ? (
                  attendance.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">{formatDate(entry.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.course_title} ({entry.batch_code})
                        </p>
                      </div>
                      <span className={`status-badge ${getStatusClass(entry.status)}`}>
                        {entry.status === 'P' ? 'Present' : 
                         entry.status === 'A' ? 'Absent' : 'Leave'}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-center p-8 text-muted-foreground">
                    No attendance records found.
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default StudentAttendancePage;