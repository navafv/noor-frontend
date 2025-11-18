import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Check, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AttendancePage = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingRecordId, setExistingRecordId] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [date]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setExistingRecordId(null);
    try {
      const recordRes = await api.get('/attendance/records/', { params: { date } });
      
      if (recordRes.data.results?.length > 0) {
        const record = recordRes.data.results[0];
        setExistingRecordId(record.id);
        const map = {};
        record.entries.forEach(entry => { map[entry.student] = entry.status; });
        setAttendanceMap(map);
        const studentRes = await api.get('/students/?active=true');
        setStudents(studentRes.data.results || []);
      } else {
        const studentRes = await api.get('/students/?active=true');
        const activeStudents = studentRes.data.results || [];
        setStudents(activeStudents);
        const map = {};
        activeStudents.forEach(s => map[s.id] = 'P');
        setAttendanceMap(map);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: prev[studentId] === 'P' ? 'A' : 'P' }));
  };

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.keys(attendanceMap).map(studentId => ({
      student: parseInt(studentId),
      status: attendanceMap[studentId]
    }));

    try {
      if (existingRecordId) {
        await api.put(`/attendance/records/${existingRecordId}/`, { date, entries });
      } else {
        await api.post('/attendance/records/', { date, entries });
      }
      toast.success("Attendance saved");
      fetchAttendanceData(); 
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="sticky top-0 z-10 bg-gray-50 pb-4 pt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <button onClick={handleSave} disabled={saving || loading} className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer">
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Save</span>
          </button>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Calendar className="text-primary-600" size={20} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-transparent font-medium text-gray-900 outline-none" />
        </div>
      </div>

      {loading ? <div className="text-center py-10 text-gray-400">Loading students...</div> : (
        <div className="space-y-3">
          {students.map(student => {
            const isPresent = attendanceMap[student.id] === 'P';
            return (
              <div key={student.id} onClick={() => toggleStatus(student.id)} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${isPresent ? 'bg-white border-green-100 shadow-sm' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isPresent ? 'bg-primary-100 text-primary-600' : 'bg-red-200 text-red-700'}`}>
                    {student.user?.first_name?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isPresent ? 'text-gray-900' : 'text-red-800'}`}>{student.user?.first_name} {student.user?.last_name}</h3>
                    <p className={`text-xs ${isPresent ? 'text-gray-500' : 'text-red-600'}`}>{student.reg_no}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPresent ? 'bg-green-100 text-green-600' : 'bg-red-200 text-red-600'}`}>
                  {isPresent ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;