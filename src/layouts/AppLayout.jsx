import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Routes that have their own custom headers (dashboard, etc.)
  const noHeaderRoutes = ['/admin/dashboard', '/student/home', '/admin/menu', '/student/profile'];
  const shouldHideHeader = noHeaderRoutes.includes(location.pathname);

  // Helper to guess title based on path
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('students')) return 'Students';
    if (path.includes('courses')) return 'Courses';
    if (path.includes('finance')) return 'Finance';
    if (path.includes('materials')) return 'Materials';
    return 'Noor Institute';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header */}
        {!shouldHideHeader && (
          <header className="bg-white px-4 h-(--header-height) flex items-center gap-3 sticky top-0 z-40 border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{getTitle()}</h1>
          </header>
        )}

        {/* Content */}
        <main className={`flex-1 overflow-y-auto no-scrollbar p-4 ${!shouldHideHeader ? '' : 'pt-4'} pb-24`}>
          <div className="page-transition">
            <Outlet />
          </div>
        </main>

        {/* Bottom Nav */}
        {user && <BottomNav />}
      </div>
    </div>
  );
};

export default AppLayout;