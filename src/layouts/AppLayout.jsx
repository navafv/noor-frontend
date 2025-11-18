import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import NotificationBell from '../components/NotificationBell'; // Imported
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Routes with custom headers
  const noHeaderRoutes = ['/admin/dashboard', '/student/home', '/admin/menu', '/student/profile'];
  const shouldHideHeader = noHeaderRoutes.includes(location.pathname);

  // Helper to guess title
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('students')) return 'Students';
    if (path.includes('courses')) return 'Courses';
    if (path.includes('finance')) return 'Finance';
    if (path.includes('expenses')) return 'Expenses'; // Added
    if (path.includes('events')) return 'Events'; // Added
    if (path.includes('notifications')) return 'Notifications'; // Added
    if (path.includes('certificates')) return 'Certificates';
    return 'Noor Institute';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header */}
        {!shouldHideHeader && (
          <header className="bg-white px-4 h-(--header-height) flex items-center justify-between sticky top-0 z-40 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
                <ArrowLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">{getTitle()}</h1>
            </div>
            {/* Show Bell only if user is logged in */}
            {user && <NotificationBell />}
          </header>
        )}

        {/* Content */}
        <main className={`flex-1 overflow-y-auto no-scrollbar p-4 ${!shouldHideHeader ? '' : 'pt-4'} pb-24`}>
          <div className="page-transition">
            <Outlet />
          </div>
        </main>

        {user && <BottomNav />}
      </div>
    </div>
  );
};

export default AppLayout;