import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx'; // <-- Import new header

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // FIX: Check for user.id, which maps to student.user_id
    const studentId = user?.student_id; // Get student ID from user object

    if (user && studentId) {
      const fetchStudentData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [outstandingRes, enrollmentsRes] = await Promise.all([
            api.get(`/finance/outstanding/student/${studentId}/`),
            api.get(`/enrollments/?student=${studentId}`)
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
    } else if (user && !studentId) {
      setError('No student profile associated with this user.');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <PageHeader title="My Dashboard" />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  return (
    <>
      <PageHeader title="My Dashboard" showBackButton={false} />

      <div className="p-4 max-w-lg mx-auto">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {user.first_name || user.username}!
          </h1>
          <p className="text-md text-muted-foreground">Welcome back.</p>
        </div>
        
        {error && <p className="form-error mb-4">{error}</p>}

        {/* Fee Summary */}
        {dashboardData && (
          <div className="mb-6 card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(dashboardData.total_paid + dashboardData.total_due).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboardData.total_paid.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="col-span-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Outstanding Dues</p>
                <p className={`text-3xl font-bold ${dashboardData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{dashboardData.total_due.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Enrolled Courses */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Courses</h2>
          {enrollments.length === 0 ? (
            <p className="text-muted-foreground">You are not yet enrolled in any courses.</p>
          ) : (
            <ul className="space-y-4">
              {enrollments.map(e => (
                <li key={e.id} className="p-4 bg-background rounded-lg">
                  <p className="font-semibold">{e.batch.course_title}</p>
                  <p className="text-sm text-muted-foreground">Batch: {e.batch_code}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className={`font-medium capitalize ${e.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{e.status}</span>
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