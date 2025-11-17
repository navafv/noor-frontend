import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, Book, CalendarCheck, Award } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollRes = await api.get('/enrollments/');
        setEnrollments(enrollRes.data.results || []);
        
        const attRes = await api.get('/attendance/analytics/summary/', { params: { days: 30 } });
        setAttendanceStats(attRes.data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const activeCourse = enrollments.find(e => e.status === 'active') || enrollments[0];

  return (
    <div className="space-y-6">
      <div className="bg-primary-600 text-white p-6 rounded-3xl shadow-lg shadow-primary-200">
        <p className="text-primary-100 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold">{user?.first_name || user?.username}</h1>
        
        {activeCourse && (
            <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <p className="text-xs text-primary-100 uppercase tracking-wider mb-1">Current Course</p>
                <p className="font-semibold text-lg">{activeCourse.course_title}</p>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-xs opacity-80">Started {activeCourse.enrolled_on}</span>
                </div>
            </div>
        )}
      </div>

      {attendanceStats && (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                    <CalendarCheck size={18} />
                    <span className="text-xs font-bold uppercase">Present</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.present} Days</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                    <Clock size={18} />
                    <span className="text-xs font-bold uppercase">Attendance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.rate}%</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;