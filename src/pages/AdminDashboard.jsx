import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Users, Inbox, DollarSign, TrendingUp, CheckSquare, BarChart2, Package, Book, LogOut } from 'lucide-react';
import api from '@/services/api.js';
import PageHeader from '@/components/PageHeader.jsx'; // <-- Import new header
import { useAuth } from '@/context/AuthContext.jsx'; // <-- Import useAuth

// ... (StatCard component is unchanged)
const StatCard = ({ title, value, icon: Icon, colorClass = 'text-primary' }) => ( <div className="card p-4 flex items-center space-x-4"> <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')}10 ${colorClass}`}> <Icon size={24} /> </div> <div> <p className="text-sm text-muted-foreground">{title}</p> <p className="text-2xl font-bold text-foreground">{value}</p> </div> </div> );
// ... (AdminNavCard component is unchanged)
const AdminNavCard = ({ title, description, to, icon: Icon }) => ( <Link to={to} className="block p-4 card hover:shadow-md transition-all"> <div className="flex items-center space-x-3"> <Icon className="w-6 h-6 text-primary" /> <div> <p className="text-lg font-semibold text-foreground">{title}</p> <p className="text-sm text-muted-foreground">{description}</p> </div> </div> </Link> );

function AdminDashboard() {
  const { logoutUser } = useAuth(); // <-- Get logout function
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use Promise.all to fetch multiple stats if needed in future
        const [summaryRes] = await Promise.all([
          api.get('/finance/analytics/summary/'),
          // api.get('/students/count/'), // Example
          // api.get('/enquiries/count/?status=new'), // Example
        ]);
        setStats(summaryRes.data);
      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <>
      {/* --- Use new PageHeader (No Back Button on main dash) --- */}
      <PageHeader title="Admin Dashboard" showBackButton={false} />
      {/* --- End of Header --- */}

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          
          {!loading && stats && (
            <>
              {/* Financial Stats */}
              <h2 className="text-xl font-semibold text-foreground mb-4">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Total Income" value={`₹${stats.total_income.toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="text-green-600" />
                <StatCard title="Total Expenses" value={`₹${stats.total_expense.toLocaleString('en-IN')}`} icon={DollarSign} colorClass="text-red-600" />
                <StatCard title="Net Profit" value={`₹${stats.net_profit.toLocaleString('en-IN')}`} icon={BarChart2} colorClass="text-blue-600" />
              </div>

              {/* Navigation Cards */}
              <h2 className="text-xl font-semibold text-foreground mb-4">Management Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminNavCard title="Manage Enquiries" description="Review and convert new enquiries" to="/admin/enquiries" icon={Inbox} />
                <AdminNavCard title="Manage Students" description="View all registered students" to="/admin/students" icon={Users} />
                <AdminNavCard title="Take Attendance" description="Mark attendance for a batch" to="/admin/attendance" icon={CheckSquare} />
                <AdminNavCard title="Manage Courses" description="Add/edit courses, batches, & trainers" to="/admin/courses" icon={Book} />
                <AdminNavCard title="Manage Expenses" description="Log and track business expenses" to="/admin/expenses" icon={DollarSign} />
                <AdminNavCard title="Manage Stock" description="Track inventory and materials" to="/admin/stock" icon={Package} />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;