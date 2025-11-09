import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Users, Inbox, DollarSign, TrendingUp, CheckSquare, BarChart2 } from 'lucide-react';
import api from '@/services/api.js';

// Helper component for stat cards
const StatCard = ({ title, value, icon: Icon, colorClass = 'text-noor-primary' }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-noor-pink/10 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-noor-heading">{value}</p>
    </div>
  </div>
);

// Helper component for navigation links
const AdminNavCard = ({ title, description, to, icon: Icon }) => (
  <Link to={to} className="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center space-x-3">
      <Icon className="w-6 h-6 text-noor-pink" />
      <div>
        <p className="text-lg font-semibold text-noor-heading">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [outstanding, setOutstanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch data in parallel
        const [summaryRes, outstandingRes] = await Promise.all([
          api.get('/finance/analytics/summary/'), //
          api.get('/finance/outstanding/overall/') //
        ]);
        setStats(summaryRes.data);
        setOutstanding(outstandingRes.data);
      } catch (err) {
        setError('Could not load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Link to="/account" className="flex items-center gap-1 text-noor-pink">
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Account</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-noor-heading mb-6">
            Admin Dashboard
          </h1>

          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-noor-pink" size={40} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          
          {!loading && stats && outstanding && (
            <>
              {/* Financial Stats */}
              <h2 className="text-xl font-semibold text-noor-heading mb-4">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard 
                  title="Total Income" 
                  value={`₹${stats.total_income.toLocaleString('en-IN')}`} 
                  icon={TrendingUp} 
                  colorClass="text-green-600"
                />
                <StatCard 
                  title="Total Expenses" 
                  value={`₹${stats.total_expense.toLocaleString('en-IN')}`} 
                  icon={DollarSign} 
                  colorClass="text-red-600"
                />
                <StatCard 
                  title="Net Profit" 
                  value={`₹${stats.net_profit.toLocaleString('en-IN')}`} 
                  icon={BarChart2} 
                  colorClass="text-blue-600"
                />
              </div>

              {/* Navigation Cards */}
              <h2 className="text-xl font-semibold text-noor-heading mb-4">Management Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminNavCard 
                  title="Manage Enquiries" 
                  description="Review and convert new enquiries" 
                  to="/admin/enquiries"
                  icon={Inbox} 
                />
                <AdminNavCard 
                  title="Manage Students" 
                  description="View all registered students" 
                  to="/admin/students"
                  icon={Users}
                />
                <AdminNavCard 
                  title="Take Attendance" 
                  description="Mark attendance for a batch" 
                  to="/admin/attendance"
                  icon={CheckSquare}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;