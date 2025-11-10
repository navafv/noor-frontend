import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader'; // <-- Import new header

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.student_id) {
      const fetchStudentData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [outstandingRes, enrollmentsRes] = await Promise.all([
            api.get(`/finance/outstanding/student/${user.student_id}/`),
            api.get(`/enrollments/?student=${user.student_id}`)
          ]);
          setDashboardData(outstandingRes.data);
          setEnrollments(enrollmentsRes.data.results || []);
        } catch (err) {
          setError('Could not load student data.');
        } finally {
          setLoading(false);
        }
      };
      fetchStudentData();
    } else if (user && !user.student_id) {
      setError('No student profile associated with this user.');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-noor-pink" size={32} />
      </div>
    );
  }
  
  if (error) {
    return <div className="p-4"><p className="form-error">{error}</p></div>;
  }

  return (
    <>
      {/* --- ADD THIS HEADER --- */}
      <PageHeader title="My Dashboard" />

      <div className="p-4 max-w-2xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-noor-heading">
            Hi, {user.first_name || user.username}!
          </h1>
          <p className="text-md text-gray-500">Welcome back.</p>
        </div>
        
        {/* Fee Summary */}
        {dashboardData && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-noor-heading mb-4">Payment Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Fees</p>
                <p className="text-2xl font-bold text-noor-heading">
                  ₹{(dashboardData.total_paid + dashboardData.total_due).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboardData.total_paid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="col-span-2 border-t pt-4">
                <p className="text-sm text-gray-500">Outstanding Dues</p>
                <p className={`text-3xl font-bold ${dashboardData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{dashboardData.total_due.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Enrolled Courses */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-noor-heading mb-4">Your Courses</h2>
          {enrollments.length === 0 ? (
            <p className="text-gray-500">You are not yet enrolled in any courses.</p>
          ) : (
            <ul className="space-y-4">
              {enrollments.map(e => (
                <li key={e.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{e.batch.course_title}</p>
                  <p className="text-sm text-gray-600">Batch: {e.batch_code}</p>
                  <p className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${e.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{e.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;