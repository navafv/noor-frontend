import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, BookOpen, DollarSign, MessageSquare, Award, Library, Calendar } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import FeedbackFormModal from '../components/FeedbackFormModal.jsx'; // <-- NEW

// Card for navigation
const QuickLinkCard = ({ to, icon: Icon, label, color }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm transition-all
                bg-card hover:shadow-md border border-border
                hover:border-${color}-500/50 hover:bg-${color}-500/5`}
  >
    <Icon className={`w-8 h-8 mb-2 text-${color}-500`} />
    <span className="text-sm font-medium text-center text-foreground">{label}</span>
  </Link>
);

// Card for enrollment summary
const EnrollmentCard = ({ enrollment, onFeedbackClick }) => (
  <li className="p-4 bg-card rounded-lg border border-border shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-primary">{enrollment.course_title}</p>
        <p className="text-sm text-muted-foreground">Batch: {enrollment.batch_code}</p>
      </div>
      <span className={`status-badge status-${enrollment.status}`}>
        {enrollment.status}
      </span>
    </div>
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-sm font-medium text-foreground">Attendance Progress</p>
      <div className="w-full bg-muted rounded-full h-2.5 mt-2">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${(enrollment.present_days / enrollment.required_days) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {enrollment.present_days} / {enrollment.required_days} days attended
      </p>
    </div>
    {enrollment.status === 'completed' && (
      <div className="mt-4">
        {enrollment.has_feedback ? (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle size={16} /> Feedback submitted. Thank you!
          </p>
        ) : (
          <button
            onClick={() => onFeedbackClick(enrollment)}
            className="btn-secondary w-full"
          >
            Submit Feedback
          </button>
        )}
      </div>
    )}
  </li>
);

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({ enrollments: [], finance: null });
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const fetchData = async () => {
    // We already have the student ID from AuthContext
    if (!user?.student?.id) return;

    setLoading(true);
    try {
      // Fetch enrollments and finance data in parallel
      const [enrollmentsRes, financeRes] = await Promise.all([
        api.get('/enrollments/'), // This is filtered to the student by the backend
        api.get(`/finance/outstanding/student/${user.student.id}/`)
      ]);
      
      setDashboardData({
        enrollments: enrollmentsRes.data.results || [],
        finance: financeRes.data
      });

    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]); // Re-fetch if user object changes

  const handleFeedbackClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const handleFeedbackSubmit = async (rating, comments) => {
    if (!selectedEnrollment) return;
    
    const promise = api.post('/feedback/', {
      enrollment: selectedEnrollment.id,
      rating,
      comments
    });

    try {
      await toast.promise(promise, {
        loading: 'Submitting feedback...',
        success: 'Thank you for your feedback!',
        error: (err) => err.response?.data?.detail || 'Failed to submit feedback.'
      });
      setIsModalOpen(false);
      fetchData(); // Refresh data to show "Feedback Submitted"
    } catch (err) {
      // Error is already toasted
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`Welcome, ${user?.first_name || 'Student'}`} showBackButton={false} />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Quick Links Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            <QuickLinkCard to="/student/attendance" icon={CheckCircle} label="Attendance" color="primary" />
            <QuickLinkCard to="/student/finance" icon={DollarSign} label="Finance" color="green" />
            <QuickLinkCard to="/student/materials" icon={Library} label="Materials" color="yellow" />
            <QuickLinkCard to="/student/certificates" icon={Award} label="Certificates" color="blue" />
            <QuickLinkCard to="/student/calendar" icon={Calendar} label="Calendar" color="indigo" />
            <QuickLinkCard to="/student/messages" icon={MessageSquare} label="Support" color="pink" />
            <QuickLinkCard to="/account" icon={BookOpen} label="My Courses" color="gray" />
          </div>

          {/* Finance Summary */}
          {dashboardData.finance && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Financial Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                  <p className="text-sm text-muted-foreground">Total Fees Due</p>
                  <p className="text-2xl font-bold text-destructive">
                    ₹{dashboardData.finance.total_due.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="card p-4">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{dashboardData.finance.total_paid.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Enrollments */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">My Courses</h2>
            {dashboardData.enrollments.length > 0 ? (
              <ul className="space-y-4">
                {dashboardData.enrollments.map(en => (
                  <EnrollmentCard 
                    key={en.id} 
                    enrollment={en} 
                    onFeedbackClick={handleFeedbackClick} // <-- NEW
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center p-8 bg-card rounded-lg">
                You are not currently enrolled in any courses.
              </p>
            )}
          </div>
        </div>
      </main>
      
      {selectedEnrollment && (
        <FeedbackFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
          courseTitle={selectedEnrollment.course_title}
        />
      )}
    </>
  );
}

export default StudentDashboard;