import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, CalendarCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Enrollments to show current course
        const enrollRes = await api.get('/enrollments/');
        setEnrollments(enrollRes.data.results || []);
        
        // 2. Fetch Student's own attendance
        const attRes = await api.get('/attendance/records/me/');
        const records = attRes.data.results || attRes.data || [];
        
        // Calculate stats locally
        const presentCount = records.filter(r => r.status === 'P').length;
        const totalCount = records.length;
        const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

        setAttendanceStats({
            present: presentCount,
            rate: rate
        });

      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading dashboard...</div>;

  // Determine the "Active" course to display prominently
  const activeCourse = enrollments.find(e => e.status === 'active') || enrollments[0];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white p-6 rounded-3xl shadow-lg shadow-primary-200">
        <p className="text-primary-100 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold">{user?.first_name || user?.username}</h1>
        
        {activeCourse ? (
            <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary-100"/>
                    <p className="text-xs text-primary-100 uppercase tracking-wider">Current Course</p>
                </div>
                <p className="font-semibold text-lg">{activeCourse.course_title}</p>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-xs opacity-80">Joined: {activeCourse.enrolled_on}</span>
                </div>
            </div>
        ) : (
            <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <p className="text-sm opacity-90">No active course found.</p>
            </div>
        )}
      </div>

      {/* Stats Grid */}
      {attendanceStats && (
        <div className="grid grid-cols-2 gap-4">
            {/* Present Days Card (Static) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                    <CalendarCheck size={18} />
                    <span className="text-xs font-bold uppercase">Present</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.present} Days</p>
                <p className="text-xs text-gray-400 mt-1">Total Present</p>
            </div>

            {/* Attendance Rate Card (Clickable -> Links to History) */}
            <Link 
              to="/student/attendance" 
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 block active:scale-95 transition-transform hover:shadow-md"
            >
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                    <Clock size={18} />
                    <span className="text-xs font-bold uppercase">Attendance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.rate}%</p>
                <p className="text-xs text-gray-400 mt-1">Tap for history &rarr;</p>
            </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;