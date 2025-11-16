import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, Check, X, Minus, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

function AttendancePage() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'P', ... }
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [existingRecordId, setExistingRecordId] = useState(null);

  // 1. Fetch all batches for the dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get('/batches/');
        setBatches(res.data.results || []);
        if (res.data.results?.length > 0) {
          setSelectedBatch(res.data.results[0].id);
        }
      } catch (err) {
        toast.error('Failed to load batches.');
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // 2. Fetch students and any existing attendance when batch or date changes
  useEffect(() => {
    if (!selectedBatch || !selectedDate) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchAttendanceData = async () => {
      setLoadingStudents(true);
      setExistingRecordId(null);
      
      try {
        // First, check if an attendance record *already exists*
        const existingRes = await api.get('/attendance/records/', {
          params: { batch: selectedBatch, date: selectedDate }
        });

        let studentList = [];
        if (existingRes.data.results?.length > 0) {
          // --- A. RECORD EXISTS: Load it ---
          const record = existingRes.data.results[0];
          setExistingRecordId(record.id);
          
          // Use student data from the record's entries
          studentList = record.entries.map(e => ({
            id: e.student, // student ID
            name: e.student_name,
            reg_no: 'N/A' // Reg no isn't in this serializer, but that's ok
          }));
          
          const existingAttendance = record.entries.reduce((acc, entry) => {
            acc[entry.student] = entry.status;
            return acc;
          }, {});
          setAttendance(existingAttendance);
          
        } else {
          // --- B. NO RECORD: Fetch all students enrolled in the batch ---
          const enrollRes = await api.get('/enrollments/', {
            params: { batch: selectedBatch, page_size: 100 } // Get all students
          });
          
          studentList = enrollRes.data.results.map(en => ({
            id: en.student, // student ID
            name: en.student_name,
            reg_no: 'N/A' // Not needed for the form
          }));
          
          // Set default attendance to 'P' (Present)
          const defaultAttendance = studentList.reduce((acc, student) => {
            acc[student.id] = 'P';
            return acc;
          }, {});
          setAttendance(defaultAttendance);
        }
        
        setStudents(studentList);
        if (studentList.length === 0) {
          toast.error("No students are enrolled in this batch.");
        }

      } catch (err) {
        toast.error('Failed to load student data for this batch.');
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchAttendanceData();
  }, [selectedBatch, selectedDate]);
  
  // 3. Handle setting attendance
  const setStudentStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  // 4. Handle submitting the whole sheet
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const entries = Object.keys(attendance).map(studentId => ({
      student: parseInt(studentId, 10),
      status: attendance[studentId]
    }));
    
    const payload = {
      batch: parseInt(selectedBatch, 10),
      date: selectedDate,
      entries: entries
    };

    const promise = existingRecordId
      ? api.put(`/attendance/records/${existingRecordId}/`, payload) // UPDATE
      : api.post('/attendance/records/', payload); // CREATE

    try {
      const res = await toast.promise(promise, {
        loading: 'Submitting attendance...',
        success: `Attendance ${existingRecordId ? 'updated' : 'saved'}!`,
        error: (err) => err.response?.data?.entries?.[0] || 'Failed to submit.'
      });
      
      // On create, set the new record ID
      if (!existingRecordId) {
        setExistingRecordId(res.data.id);
      }
    } catch (err) { /* handled by toast */ } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Take Attendance" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Select Batch</label>
                {loadingBatches ? <Loader2 className="animate-spin" /> : (
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="form-input"
                  >
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.code} ({batch.course_title})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="form-label">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
          
          {/* Student List */}
          <div className="card overflow-hidden">
            {loadingStudents ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : students.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">
                No students found for this batch.
              </p>
            ) : (
              <ul role="list" className="divide-y divide-border">
                {students.map((student) => {
                  const status = attendance[student.id] || 'P';
                  return (
                    <li key={student.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{student.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <StatusButton icon={Check} label="P" isActive={status === 'P'} onClick={() => setStudentStatus(student.id, 'P')} color="green" />
                        <StatusButton icon={X} label="A" isActive={status === 'A'} onClick={() => setStudentStatus(student.id, 'A')} color="red" />
                        <StatusButton icon={Minus} label="L" isActive={status === 'L'} onClick={() => setStudentStatus(student.id, 'L')} color="yellow" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          {/* Submit Button */}
          {students.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || loadingStudents}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {existingRecordId ? 'Update Attendance' : 'Submit Attendance'}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const StatusButton = ({ icon: Icon, label, isActive, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full ${
      isActive 
        ? `bg-${color}-600 text-white` 
        : `bg-muted text-muted-foreground hover:bg-${color}-100`
    }`}
    aria-label={label}
  >
    <Icon size={20} />
  </button>
);

export default AttendancePage;