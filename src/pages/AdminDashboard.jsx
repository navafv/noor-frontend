import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Loader2, 
  Users, 
  Inbox, 
  DollarSign, 
  TrendingUp, 
  CheckSquare, 
  BarChart2, 
  Package, 
  Book, 
  Bell,
  UserCheck, // New Icon
  FileText   // New Icon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar 
} from 'recharts';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';
import SendNotificationModal from '../components/admin/SendNotificationModal.jsx';

// --- A. New StatCard Component ---
// Updated with a link and better styling
const StatCard = ({ title, value, icon: Icon, colorClass = 'text-primary', to }) => {
  const content = (
    <div className="card p-4 flex items-center space-x-4 transition-all hover:shadow-lg">
      <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')} bg-opacity-10 ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <div>{content}</div>;
};

// --- B. AdminNavCard Component (Unchanged) ---
const AdminNavCard = ({ title, description, to, icon: Icon }) => (
  <Link to={to} className="block p-4 card hover:shadow-md transition-all h-full">
    <div className="flex items-center space-x-3">
      <Icon className="w-6 h-6 text-primary" />
      <div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Link>
);

function AdminDashboard() {
  const { logoutUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [timelineData, setTimelineData] = useState([]); // --- C. New state for chart
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // --- D. Fetch all data in parallel ---
        const [summaryRes, timelineRes, usersRes, rolesRes] = await Promise.all([
          api.get('/finance/analytics/summary/'),
          api.get('/finance/analytics/income-expense/'), // New API call
          api.get('/users/'),
          api.get('/roles/')
        ]);
        
        setStats(summaryRes.data);
        setTimelineData(timelineRes.data); // Set chart data
        setUsers(usersRes.data.results || []);
        setRoles(rolesRes.data.results || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Could not load all dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleNotificationSent = () => {
    setSuccess('Notification sent successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Format currency
  const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

  return (
    <>
      <PageHeader title="Admin Dashboard" showBackButton={false} />

      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
        {/* --- E. Changed max-width for a wider layout --- */}
        <div className="mx-auto max-w-7xl space-y-6">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          {success && (
            <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-700 mb-4">
              {success}
            </div>
          )}
          
          {!loading && stats && (
            <>
              {/* --- F. New 5-Card Stat Layout --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard 
                  title="Net Profit" 
                  value={formatCurrency(stats.net_profit)} 
                  icon={BarChart2} 
                  colorClass="text-blue-600"
                />
                <StatCard 
                  title="Total Income" 
                  value={formatCurrency(stats.total_income)} 
                  icon={TrendingUp} 
                  colorClass="text-green-600"
                />
                <StatCard 
                  title="Total Expenses" 
                  value={formatCurrency(stats.total_expense)} 
                  icon={DollarSign} 
                  colorClass="text-red-600"
                />
                <StatCard 
                  title="Active Students" 
                  value={stats.total_active_students} 
                  icon={UserCheck} 
                  colorClass="text-purple-600"
                  to="/admin/students"
                />
                <StatCard 
                  title="New Enquiries" 
                  value={stats.new_pending_enquiries} 
                  icon={FileText} 
                  colorClass="text-yellow-600"
                  to="/admin/enquiries"
                />
              </div>

              {/* --- G. New 2-Column Layout for Chart & Actions --- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- H. New Chart Component --- */}
                <div className="lg:col-span-2 card p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Financial Performance (Monthly)</h2>
                  </div>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={timelineData}
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `₹${value/1000}k`}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), '']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                        <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* --- I. Quick Actions Section --- */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="card p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
                      <button
                        onClick={() => setIsNotifyModalOpen(true)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Bell size={18} />
                        Notify
                      </button>
                    </div>
                  </div>
                  
                  <AdminNavCard title="Manage Enquiries" description="Review and convert new enquiries" to="/admin/enquiries" icon={Inbox} />
                  <AdminNavCard title="Manage Students" description="View all registered students" to="/admin/students" icon={Users} />
                  <AdminNavCard title="Take Attendance" description="Mark attendance for a batch" to="/admin/attendance" icon={CheckSquare} />
                  <AdminNavCard title="Manage Courses" description="Add/edit courses, batches, & trainers" to="/admin/courses" icon={Book} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* --- Render the Modal (Unchanged) --- */}
      <Modal 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
        title="Send Bulk Notification"
      >
        <SendNotificationModal
          users={users}
          roles={roles}
          onClose={() => setIsNotifyModalOpen(false)}
          onSent={handleNotificationSent}
        />
      </Modal>
    </>
  );
}

export default AdminDashboard;