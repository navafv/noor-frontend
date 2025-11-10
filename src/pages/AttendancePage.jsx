import React, { useState, useEffect, useCallback } from 'react';
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
  
  // This list will be populated either from enrollments (for new) or entries (for existing)
  const [studentList, setStudentList] = useState([]); 
  
  // This state holds the { studentId: 'P' } mapping
  const [attendance, setAttendance] = useState({});
  // This holds the full record from the DB if it exists
  const [existingRecord, setExistingRecord] = useState(null);

  const [loadingBatches, setLoadingBatches] = useState(true);
  const [isFetchingRecord, setIsFetchingRecord] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 1. Fetch all available batches for the dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoadingBatches(true);
        let res;
        if (user.is_superuser) {
          // Admins get all batches
          res = await api.get('/batches/');
        } else if (user.is_staff) {
          // Teachers get only their batches
          res = await api.get('/teacher/my-batches/');
        }
        setBatches(res.data.results || res.data || []);
      } catch (err) {
        setError('Failed to load batches.');
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, [user]); // Re-run if user changes

  // 2. Fetch attendance data OR enrollment data when batch or date changes
  const fetchAttendanceData = useCallback(async () => {
    if (!selectedBatch || !attendanceDate) {
      setStudentList([]);
      return;
    }

    setIsFetchingRecord(true);
    setError(null);
    setSuccess(null);
    setExistingRecord(null);
    setStudentList([]);
    setAttendance({});

    try {
      // --- FETCH-OR-CREATE LOGIC ---
      // 2a. Check if a record already exists
      const recordRes = await api.get('/attendance/records/', {
        params: { batch: selectedBatch, date: attendanceDate }
      });
      
      const existing = recordRes.data.results?.[0];

      if (existing) {
        // --- RECORD FOUND (EDIT MODE) ---
        setExistingRecord(existing);
        
        // Populate studentList from the saved entries
        const students = existing.entries.map(entry => ({
          id: entry.id, // Use entry ID as key
          student: entry.student,
          student_name: entry.student_name,
        }));
        setStudentList(students);
        
        // Populate attendance map from saved entries
        const attendanceMap = {};
        existing.entries.forEach(entry => {
          attendanceMap[entry.student] = entry.status;
        });
        setAttendance(attendanceMap);
        setSuccess('Loaded existing attendance record.');

      } else {
        // --- NO RECORD FOUND (CREATE MODE) ---
        setExistingRecord(null);
        
        // Fetch active enrollments for this batch
        const enrollRes = await api.get(`/enrollments/?batch=${selectedBatch}&status=active`);
        const activeEnrollments = enrollRes.data.results || [];
        
        const students = activeEnrollments.map(e => ({
          id: e.id, // Use enrollment ID as key
          student: e.student,
          student_name: e.student_name,
        }));
        setStudentList(students);
        
        // Set default attendance for all students to 'P' (Present)
        const defaultAttendance = {};
        for (const student of students) {
          defaultAttendance[student.student] = 'P';
        }
        setAttendance(defaultAttendance);
      }
      
    } catch (err) {
      setError('Failed to load attendance data.');
    } finally {
      setIsFetchingRecord(false);
    }
  }, [selectedBatch, attendanceDate]);

  // Trigger fetch when batch or date changes
  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);


  // 3. Handle changing a student's status
  const setStudentStatus = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // 4. Submit or Update the attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Build the 'entries' payload from the student list and attendance map
    const entries = studentList.map(student => ({
      student: student.student,
      status: attendance[student.student],
    }));

    const attendanceData = {
      batch: selectedBatch,
      date: attendanceDate,
      taken_by: user.id, // Serializer will use request.user
      entries: entries,
    };

    try {
      if (existingRecord) {
        // --- UPDATE (PUT) ---
        const res = await api.put(`/attendance/records/${existingRecord.id}/`, attendanceData);
        setSuccess('Attendance updated successfully!');
        setExistingRecord(res.data); // Store updated record
      } else {
        // --- CREATE (POST) ---
        const res = await api.post('/attendance/records/', attendanceData);
        setSuccess('Attendance submitted successfully!');
        setExistingRecord(res.data); // Store newly created record
      }
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
              {isFetchingRecord && (
                <div className="flex justify-center items-center min-h-[100px]">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}
              
              {!isFetchingRecord && studentList.length === 0 && (
                <p className="text-center text-muted-foreground">
                  {selectedBatch ? 'No active students found in this batch.' : 'Please select a batch and date.'}
                </p>
              )}

              {studentList.length > 0 && (
                <div className="space-y-4">
                  {studentList.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {student.student_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <StatusButton 
                          label="P" 
                          isActive={attendance[student.student] === 'P'} 
                          onClick={() => setStudentStatus(student.student, 'P')}
                          colorClass="bg-green-600 hover:bg-green-700"
                          icon={Check}
                        />
                        <StatusButton 
                          label="A" 
                          isActive={attendance[student.student] === 'A'} 
                          onClick={() => setStudentStatus(student.student, 'A')}
                          colorClass="bg-red-600 hover:bg-red-700"
                          icon={X}
                        />
                        <StatusButton 
                          label="L" 
                          isActive={attendance[student.student] === 'L'} 
                          onClick={() => setStudentStatus(student.student, 'L')}
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
            {studentList.length > 0 && (
              <div className="border-t border-border pt-6">
                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                  disabled={submitting || isFetchingRecord}
                >
                  {submitting ? <Loader2 className="animate-spin" /> : (
                    existingRecord ? 'Update Attendance' : 'Submit Attendance'
                  )}
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