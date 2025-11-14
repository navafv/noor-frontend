import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar.jsx';
import AdminHeader from '@/components/admin/AdminHeader.jsx';
import { X, Menu } from 'lucide-react';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // --- UPDATED: Added responsive classes ---
    <div className="hidden lg:flex h-screen bg-background text-foreground">
      {/* Mobile Sidebar Backdrop (remains for tablet-size pop-out) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300
                    lg:translate-x-0 ${
                      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;