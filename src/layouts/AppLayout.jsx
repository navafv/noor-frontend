import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = ({ title, showBack = false, actionIcon = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Define routes where we DON'T want the top header (e.g., Dashboard might have its own)
  const hideHeaderRoutes = ['/admin/dashboard', '/student/home'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* max-w-md mx-auto: This forces the app to look like a mobile phone 
        even on desktop screens, which is great for your requirement.
      */}

      {/* --- Top Header (Conditional) --- */}
      {showHeader && (
        <header className="bg-white px-4 h-(--header-height) flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={() => navigate(-1)} className="p-1 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-lg font-bold text-gray-900 truncate">{title || "Noor Institute"}</h1>
          </div>
          <div className="flex items-center gap-2">
             {/* Action Icon Slot (e.g., Add button) */}
             {actionIcon}
          </div>
        </header>
      )}

      {/* --- Main Content Area --- */}
      <main className={`flex-1 overflow-y-auto no-scrollbar p-4 ${!showHeader ? 'pt-4' : ''} pb-24`}>
        <div className="page-transition">
            <Outlet />
        </div>
      </main>

      {/* --- Bottom Navigation --- */}
      {user && <BottomNav />}
    </div>
  );
};

export default AppLayout;