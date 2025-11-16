import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { User, Mail, Phone, Shield, UserCheck, Award, Edit, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive.js';

function AccountPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  if (!user) {
    return null; // or a loader
  }
  
  const isStudent = !user.is_staff;
  const isAdmin = user.is_superuser;
  const isTeacher = user.is_staff && !user.is_superuser;
  
  // Determine the correct path to settings
  let settingsPath = '/account/settings';
  if (isStudent) settingsPath = '/student/account/settings';
  else if (isTeacher) settingsPath = '/teacher/account/settings';
  else if (isAdmin) settingsPath = '/admin/account/settings';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <PageHeader title="My Profile" showBackButton={false}>
        <Link to={settingsPath} className="btn-primary flex items-center gap-2">
          <Edit size={18} />
          Edit Profile
        </Link>
      </PageHeader>

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              User Information
            </h3>
            <dl className="space-y-4">
              <DetailItem icon={User} label="Full Name" value={`${user.first_name} ${user.last_name}`} />
              <DetailItem icon={Shield} label="Username" value={user.username} />
              <DetailItem icon={Mail} label="Email" value={user.email || 'N/A'} />
              <DetailItem icon={Phone} label="Phone" value={user.phone || 'N/A'} />
              <DetailItem icon={UserCheck} label="Role" value={
                isAdmin ? 'Administrator' : isTeacher ? 'Teacher' : 'Student'
              } />
            </dl>
          </div>

          {isStudent && user.student && (
            <div className="card p-6 mt-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Student Details
              </h3>
              <dl className="space-y-4">
                <DetailItem icon={Award} label="Registration No." value={user.student.reg_no} />
                <DetailItem icon={User} label="Guardian Name" value={user.student.guardian_name} />
                <DetailItem icon={Phone} label="Guardian Phone" value={user.student.guardian_phone} />
              </dl>
            </div>
          )}
          
          {isTeacher && isMobile && (
            <div className="card p-4 mt-8">
              <button
                onClick={handleLogout}
                className="btn-destructive w-full flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Helper component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4">
    <Icon className="w-5 h-5 text-primary shrink-0" />
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default AccountPage;