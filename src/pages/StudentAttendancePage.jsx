import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import api from '@/services/api.js';
import { Loader2, BellOff, Check, X, Minus, Percent } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';

// Helper to get the correct icon for status
const getStatusIcon = (status) => {
  if (status === 'P') return <Check size={20} className="text-green-500" />;
  if (status === 'A') return <X size={20} className="text-red-500" />;
  if (status === 'L') return <Minus size={20} className="text-yellow-500" />;
  return null;
};

// Helper to get text color for status
const getStatusText = (status) => {
  if (status === 'P') return 'text-green-600';
  if (status === 'A') return 'text-red-600';
  if (status === 'L') return 'text-yellow-600';
  return 'text-muted-foreground';
};

function StudentAttendancePage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.student_id) {
      setLoading(false);
      setError("No student profile found.");
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both summary and daily history
        const [summaryRes, historyRes] = await Promise.all([
          api.get(`/attendance/analytics/student/${user.student_id}/`),
          api.get('/attendance/my-history/')
        ]);

        setSummary(summaryRes.data);
        setHistory(historyRes.data.results || []);
      } catch (err) {
        setError('Failed to load attendance data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [user]);

  if (loading) {
    return (
      <>
        <PageHeader title="My Attendance" />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Attendance" />
      
      <div className="p-4 max-w-lg mx-auto">
        {error && <p className="form-error mb-4">{error}</p>}
        
        {/* 1. Summary Section */}
        {summary && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Overall Summary</h2>
            {summary.batches.length === 0 ? (
              <p className="text-muted-foreground">No attendance has been marked for you yet.</p>
            ) : (
              <ul className="space-y-4">
                {summary.batches.map(batch => (
                  <li key={batch.attendance__batch__id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <p className="font-semibold">{batch.attendance__batch__course__title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{batch.attendance__batch__code}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline">
                        <span className={`text-3xl font-bold ${batch.attendance_percentage > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {batch.attendance_percentage}
                        </span>
                        <Percent size={20} className={`ml-1 ${batch.attendance_percentage > 80 ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-green-600 font-medium">Present: {batch.presents}</p>
                        <p className="text-red-600 font-medium">Absent: {batch.absents}</p>
                        <p className="text-yellow-600 font-medium">Leave: {batch.leaves}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 2. Daily History Section */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground p-6 border-b border-border">
            Daily History
          </h2>
          {history.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              <BellOff size={40} className="mx-auto" />
              <p className="mt-4 font-semibold">No attendance records found</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {history.map(entry => (
                <li key={entry.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(entry.date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{entry.course_title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getStatusText(entry.status)}`}>
                      {entry.status === 'P' ? 'Present' : entry.status === 'A' ? 'Absent' : 'Leave'}
                    </span>
                    {getStatusIcon(entry.status)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentAttendancePage;