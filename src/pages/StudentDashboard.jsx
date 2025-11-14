import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '@/services/api.js';
import { Loader2, Star, CheckSquare, Check, DollarSign, Award, Library, MessageSquare, Calendar } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx';
import Modal from '@/components/Modal.jsx'; 
import FeedbackFormModal from '@/components/FeedbackFormModal.jsx';
import { Link } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive.js'; // <-- IMPORT RESPONSIVE HOOK

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { isMobile } = useResponsive(); // <-- USE RESPONSIVE HOOK

  const fetchStudentData = async () => {
    setError(null);
    try {
      const studentId = user?.student_id;
      if (!studentId) {
        throw new Error('No student profile associated with this user.');
      }
      
      const [outstandingRes, enrollmentsRes] = await Promise.all([
        api.get(`/finance/outstanding/student/${studentId}/`),
        api.get(`/enrollments/?student=${studentId}`)
      ]);
      setDashboardData(outstandingRes.data);
      setEnrollments(enrollmentsRes.data.results || []);
    } catch (err) {
      setError(err.message || 'Could not load student data.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const openFeedbackModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSaved = () => {
    setIsFeedbackModalOpen(false);
    fetchStudentData(); 
  };
  
  if (loading) {
    return (
      <>
        {/* Only show PageHeader on mobile */}
        {isMobile && <PageHeader title="My Dashboard" />}
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  return (
    <>
      {/* --- UPDATED: Only show PageHeader on mobile --- */}
      {isMobile && <PageHeader title="My Dashboard" showBackButton={false} />}

      <div className="p-4 lg:p-8 max-w-lg mx-auto lg:max-w-4xl">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {user.first_name || user.username}!
          </h1>
          <p className="text-md text-muted-foreground">Welcome back.</p>
        </div>
        
        {error && <p className="form-error mb-4">{error}</p>}

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickLink 
            to="/student/attendance"
            icon={CheckSquare}
            title="My Attendance"
            color="text-blue-600 bg-blue-100"
          />
          <QuickLink 
            to="/student/finance"
            icon={DollarSign}
            title="My Finance"
            color="text-green-600 bg-green-100"
          />
          <QuickLink 
            to="/student/certificates"
            icon={Award}
            title="My Certificates"
            color="text-yellow-600 bg-yellow-100"
          />
          <QuickLink 
            to="/student/materials"
            icon={Library}
            title="Materials"
            color="text-indigo-600 bg-indigo-100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Enrolled Courses) */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your Courses</h2>
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground">You are not yet enrolled in any courses.</p>
              ) : (
                <ul className="space-y-4">
                  {enrollments.map(e => (
                    <li key={e.id} className="p-4 bg-background rounded-lg border border-border">
                      <p className="font-semibold">{e.course_title}</p>
                      <p className="text-sm text-muted-foreground">Batch: {e.batch_code}</p>
                      
                      {e.status === 'completed' ? (
                        <p className="text-sm font-medium text-green-600">
                          Status: Completed ({e.present_days} / {e.required_days} days)
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Status: <span className={`font-medium capitalize ${e.status === 'active' ? 'text-yellow-600' : 'text-muted-foreground'}`}>{e.status}</span>
                          </p>
                          <div className="w-full bg-muted rounded-full h-2.5 my-2">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${(e.present_days / e.required_days) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            Progress: {e.present_days} / {e.required_days} days
                          </p>
                        </>
                      )}

                      {e.status === 'completed' && (
                        !e.has_feedback ? (
                          <button 
                            onClick={() => openFeedbackModal(e)}
                            className="btn-secondary btn-sm mt-3 flex items-center gap-2"
                          >
                            <Star size={16} /> Leave Feedback
                          </button>
                        ) : (
                          <p className="mt-3 text-sm font-medium text-green-600 flex items-center gap-2">
                            <Check size={16} /> Feedback Submitted
                          </p>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column (Finance) */}
          <div className="lg:col-span-1">
            {dashboardData && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment Status</h2>
                <div className="space-y-4">
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
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">Outstanding Dues</p>
                    <p className={`text-3xl font-bold ${dashboardData.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{dashboardData.total_due.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* --- FEEDBACK MODAL --- */}
      {selectedEnrollment && (
        <Modal 
          isOpen={isFeedbackModalOpen} 
          onClose={() => setIsFeedbackModalOpen(false)} 
          title={`Feedback for ${selectedEnrollment.course_title}`}
        >
          <FeedbackFormModal
            enrollment={selectedEnrollment}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSaved={handleFeedbackSaved}
          />
        </Modal>
      )}
    </>
  );
}

const QuickLink = ({ to, icon: Icon, title, color }) => (
  <Link to={to} className={`card p-4 hover:bg-accent flex items-center ${color.replace('text-', 'dark:bg-').replace('-600', '-900/20')}`}>
    <div className={`p-3 rounded-full ${color} mr-4`}>
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
  </Link>
);

export default StudentDashboard;