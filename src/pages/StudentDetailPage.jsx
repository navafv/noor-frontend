import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
// ... existing imports
  ChevronLeft,
} from 'lucide-react';
import api from '@/services/api.js'; // <-- FIXED

/**
 * Shows all details for a single student.
 * This will be the "hub" for all student-specific actions.
 */
function StudentDetailPage() {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/students/${id}/`);
        setStudent(response.data);
      } catch (err) {
        setError('Could not fetch student details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Link
          to="/admin/students"
          className="flex items-center gap-1 text-noor-pink mb-4"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Students</span>
        </Link>
        <p className="form-error">{error}</p>
      </div>
    );
  }

  if (!student) {
    return <div className="p-4">Student not found.</div>;
  }

  // Fallback for photo
  const photoUrl = student.photo
    ? student.photo
    : `https://placehold.co/400x400/fff8fb/ec4899?text=${getInitials(
        student.user.first_name,
        student.user.last_name
      )}`;

  return (
    <div className="flex h-screen flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-lg items-center px-4">
          <Link
            to="/admin/students"
            className="flex items-center gap-1 text-noor-pink"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">All Students</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-lg">
          {/* Profile Header */}
          <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col items-center">
            <img
              src={photoUrl}
              alt="Student Photo"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md -mt-16"
              onError={(e) => { e.target.src = `https://placehold.co/400x400/fff8fb/ec4899?text=${getInitials(student.user.first_name, student.user.last_name)}`; }}
            />
            <h1 className="text-2xl font-bold text-noor-heading mt-4">
              {student.user.first_name} {student.user.last_name}
            </h1>
            <p className="text-sm text-gray-500">
              Reg No: {student.reg_no}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <ActionCard
              icon={BookOpen}
              label="Enroll in Course"
              onClick={() => alert('Feature coming soon!')}
            />
            <ActionCard
              icon={DollarSign}
              label="Log Payment"
              onClick={() => alert('Feature coming soon!')}
            />
            <ActionCard
              icon={Ruler}
              label="Measurements"
              onClick={() => alert('Feature coming soon!')}
            />
            <ActionCard
              icon={CheckSquare}
              label="Attendance"
              onClick={() => alert('Feature coming soon!')}
            />
          </div>

          {/* Details Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-noor-heading mb-4">
              Student Information
            </h3>
            <div className="space-y-4">
              <InfoItem icon={Phone} label="Phone" value={student.user.phone} />
              {student.user.email && (
                <InfoItem icon={Mail} label="Email" value={student.user.email} />
              )}
              <InfoItem icon={Home} label="Address" value={student.address} />
              <div className="border-t pt-4 mt-4">
                <InfoItem
                  icon={Shield}
                  label="Guardian"
                  value={student.guardian_name}
                />
                <InfoItem
                  icon={Phone}
                  label="Guardian Phone"
                  value={student.guardian_phone}
                  isSubItem={true}
                />
              </div>
            </div>
          </div>
          
          {/* Future sections */}
          <div className="rounded-xl bg-white p-6 shadow-sm mt-4">
            <h3 className="text-lg font-semibold text-noor-heading mb-2">
              Enrolled Courses
            </h3>
            <p className="text-sm text-gray-500">No courses enrolled yet.</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm mt-4">
            <h3 className="text-lg font-semibold text-noor-heading mb-2">
              Payment History
            </h3>
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
          </div>

        </div>
      </main>
    </div>
  );
}

// Reusable Action Button Component
const ActionCard = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="btn-action-grid"
  >
    <Icon size={20} className="mb-1" />
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

// Reusable Info Item Component
const InfoItem = ({ icon: Icon, label, value, isSubItem = false }) => (
  <div className={`flex ${isSubItem ? 'pl-9' : ''}`}>
    <Icon
      size={16}
      className="mr-3 shrink-0 text-gray-400 mt-1"
    />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-noor-heading">{value || '-'}</p>
    </div>
  </div>
);

export default StudentDetailPage;