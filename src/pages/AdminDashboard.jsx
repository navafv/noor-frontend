import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, DollarSign, Users, UserPlus, Inbox } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryList from '../components/EnquiryList.jsx';
import { toast } from 'react-hot-toast';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, colorClass = 'text-primary' }) => (
  <div className="card p-4 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')} bg-opacity-10 ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        // This is the admin-only summary endpoint
        const res = await api.get('/finance/analytics/summary');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        toast.error('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <PageHeader title="Admin Dashboard" showBackButton={false} />
      
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : !stats ? (
            <p className="form-error">Could not load dashboard data.</p>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard 
                  title="Total Income" 
                  value={formatCurrency(stats.total_income)} 
                  icon={DollarSign} 
                  colorClass="text-green-600" 
                />
                <StatCard 
                  title="Total Expense" 
                  value={formatCurrency(stats.total_expense)} 
                  icon={DollarSign} 
                  colorClass="text-red-600" 
                />
                <StatCard 
                  title="Active Students" 
                  value={stats.total_active_students} 
                  icon={Users} 
                  colorClass="text-blue-600" 
                />
                <StatCard 
                  title="New Enquiries" 
                  value={stats.new_pending_enquiries}
                  icon={UserPlus} 
                  colorClass="text-yellow-600" 
                />
              </div>

              {/* Recent Enquiries */}
              <div className="card p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Inbox size={22} className="text-primary" />
                    Recent Enquiries
                  </h2>
                  <Link to="/admin/enquiries" className="btn-outline btn-sm">
                    View All
                  </Link>
                </div>
                {/* This component now fetches its own data.
                  We are showing only 5 "new" enquiries on the dashboard.
                */}
                <EnquiryList 
                  limit={5} 
                  status="new" 
                  showPagination={false} 
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;