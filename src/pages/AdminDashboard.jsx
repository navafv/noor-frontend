import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import EnquiryList from '../components/EnquiryList';

// This is now the "Manage Enquiries" screen, not the main dashboard
function AdminDashboard() {
  return (
    <div className="flex h-screen flex-col">
      {/* Simple Header for Admin Pages */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-lg items-center px-4">
          <Link
            to="/account"
            className="flex items-center gap-1 text-noor-pink"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Account</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-noor-heading mb-4">
            Manage Enquiries
          </h1>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <EnquiryList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;