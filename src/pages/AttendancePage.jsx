import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Check, X, Minus } from 'lucide-react';
import api from '@/services/api.js';
import { useAuth } from '@/context/AuthContext.jsx';
import PageHeader from '@/components/PageHeader.jsx';

// Get today's date in YYYY-MM-DD format for the date picker
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function AttendancePage() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
  
  const [enrollments, setEnrollments] = useState([]); 

  const [attendance, setAttendance] = useState({});
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Fetch all available batches for the dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        const res = await api.get('/batches/');
        setBatches(res.data.results || []);
      } catch (err) {
        setError('Failed to load batches.');
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // 2. Fetch students when a batch is selected
  useEffect(() => {
    if (!selectedBatch) {
      setEnrollments([]); // Clear enrollments
      return;
    }
    
    const fetchStudentsForBatch = async () => {
      try {
        setLoadingStudents(true);
        setError(null);
        setSuccess(null);
        // Get all enrollments for the selected batch
        const res = await api.get(`/enrollments/?batch=${selectedBatch}&status=active`);
        const activeEnrollments = res.data.results || [];
        
        setEnrollments(activeEnrollments);
        
        // Set default attendance for all students to 'P' (Present)
        const defaultAttendance = {};
        for (const enrollment of activeEnrollments) {
          // Use enrollment.student (which is the ID) as the key
          defaultAttendance[enrollment.student] = 'P';
        }
        setAttendance(defaultAttendance);

      } catch (err) {
        setError('Failed to load students for this batch.');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudentsForBatch();
  }, [selectedBatch]);

  // 3. Handle changing a student's status
  const setStudentStatus = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // 4. Submit the attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const entries = Object.keys(attendance).map(studentId => ({
      student: parseInt(studentId),
      status: attendance[studentId],
    }));

    const attendanceData = {
      batch: selectedBatch,
      date: attendanceDate,
      taken_by: user.id, // This should be handled by backend, but sending is fine
      entries: entries,
    };

    try {
      await api.post('/attendance/records/', attendanceData); // FIX: Use /attendance/records/
      setSuccess('Attendance submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit attendance. It may already be taken for this date.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Take Attendance" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-2xl">

          {error && <p className="form-error mb-4">{error}</p>}
          {success && <p className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700 mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            {/* Batch and Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="batch" className="form-label">Select Batch</label>
                <select
                  id="batch"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="" disabled>-- Select a batch --</option>
                  {loadingBatches ? (
                    <option disabled>Loading batches...</option>
                  ) : (
                    batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.code} ({b.course_title})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="form-label">Attendance Date</label>
                <input
                  type="date"
                  id="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Student List */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Students</h3>
              {loadingStudents && (
                <div className="flex justify-center items-center min-h-[100px]">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}
              
              {!loadingStudents && enrollments.length === 0 && (
                <p className="text-center text-muted-foreground">
                  {selectedBatch ? 'No active students found in this batch.' : 'Please select a batch to see students.'}
                </p>
              )}

              {enrollments.length > 0 && (
                <div className="space-y-4">
                  {enrollments.map(enrollment => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {enrollment.student_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <StatusButton 
                          label="P" 
                          isActive={attendance[enrollment.student] === 'P'} 
                          onClick={() => setStudentStatus(enrollment.student, 'P')}
                          colorClass="bg-green-600 hover:bg-green-700"
                          icon={Check}
                        />
                        <StatusButton 
                          label="A" 
                          isActive={attendance[enrollment.student] === 'A'} 
                          onClick={() => setStudentStatus(enrollment.student, 'A')}
                          colorClass="bg-red-600 hover:bg-red-700"
                          icon={X}
                        />
                        <StatusButton 
                          label="L" 
                          isActive={attendance[enrollment.student] === 'L'} 
                          onClick={() => setStudentStatus(enrollment.student, 'L')}
                          colorClass="bg-yellow-500 hover:bg-yellow-600"
                          icon={Minus}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            {enrollments.length > 0 && (
              <div className="border-t border-border pt-6">
                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                  disabled={submitting || loadingStudents}
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Submit Attendance'}
                </button>
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
}

// Helper component for the P/A/L buttons
const StatusButton = ({ label, isActive, onClick, colorClass, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white transition-all 
      ${isActive ? colorClass : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
  >
    <Icon size={20} />
  </button>
);

export default AttendancePage;