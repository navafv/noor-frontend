import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, DollarSign, Award, Settings, LifeBuoy, LogOut, Library, User, X, MessageSquare, Calendar } from 'lucide-react'; // <-- IMPORT ICON
import { useAuth } from '@/context/AuthContext.jsx';
import PageHeader from '@/components/PageHeader.jsx';

function StudentMenuPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const settingsPath = "/student/account/settings";

  return (
    <div className="flex h-full flex-col">
      <div className="lg:hidden">
        <PageHeader title="Menu" />
      </div>
      
      <main className="flex-1 overflow-y-auto bg-background p-4 max-w-lg mx-auto pb-20">
        <nav>
          <ul className="space-y-2">
            <MenuLink to="/student/dashboard" icon={Home} label="Home" /> {/* Added Home for consistency */}
            <MenuLink to="/student/calendar" icon={Calendar} label="Institute Calendar" /> {/* <-- NEW LINK */}
            <MenuLink to="/student/attendance" icon={CheckSquare} label="My Attendance" />
            <MenuLink to="/student/finance" icon={DollarSign} label="My Finance" />
            <MenuLink to="/student/certificates" icon={Award} label="My Certificates" />
            <MenuLink to="/student/materials" icon={Library} label="My Course Materials" />
            <MenuLink to="/student/messages" icon={MessageSquare} label="Support Chat" />
            <MenuLink to={settingsPath} icon={Settings} label="Account Settings" />
            <MenuLink to="/account" icon={User} label="My Account Profile" />
            <MenuLink to="/contact" icon={LifeBuoy} label="Help & Contact" />
          </ul>

          <button
            onClick={handleLogout}
            className="w-full btn btn-destructive mt-8 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </main>
    </div>
  );
}

// Re-added Home icon to MenuLink's imports
import { Home } from 'lucide-react';

const MenuLink = ({ to, icon: Icon, label, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent text-foreground card"
    >
      <Icon size={24} className="text-primary" />
      <span className="font-medium text-lg">{label}</span>
    </Link>
  </li>
);

export default StudentMenuPage;