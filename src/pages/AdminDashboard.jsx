import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Users, Inbox, DollarSign, TrendingUp, CheckSquare, BarChart2, Package, Book, LogOut, Bell } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';
import SendNotificationModal from '../components/admin/SendNotificationModal.jsx';

// ... (StatCard component is unchanged)
const StatCard = ({ title, value, icon: Icon, colorClass = 'text-primary' }) => ( <div className="card p-4 flex items-center space-x-4"> <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-')} bg-opacity-10 ${colorClass}`}> <Icon size={24} /> </div> <div> <p className="text-sm text-muted-foreground">{title}</p> <p className="text-2xl font-bold text-foreground">{value}</p> </div> </div> );
// ... (AdminNavCard component is unchanged)
const AdminNavCard = ({ title, description, to, icon: Icon }) => ( <Link to={to} className="block p-4 card hover:shadow-md transition-all"> <div className="flex items-center space-x-3"> <Icon className="w-6 h-6 text-primary" /> <div> <p className="text-lg font-semibold text-foreground">{title}</p> <p className="text-sm text-muted-foreground">{description}</p> </div> </div> </Link> );

function AdminDashboard() {
  const { logoutUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // <-- For success message

  // --- State for Modal and its data ---
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [summaryRes, usersRes, rolesRes] = await Promise.all([
          api.get('/finance/analytics/summary/'),
          api.get('/users/'), // Fetch users for modal
          api.get('/roles/')  // Fetch roles for modal
        ]);
        
        setStats(summaryRes.data);
        setUsers(usersRes.data.results || []);
        setRoles(rolesRes.data.results || []);

      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleNotificationSent = () => {
    setSuccess('Notification sent successfully!');
    setTimeout(() => setSuccess(null), 3000); // Clear message after 3s
  };

  return (
    <>
      <PageHeader title="Admin Dashboard" showBackButton={false} />

      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-4xl">
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
              {/* Financial Stats */}
              <h2 className="text-xl font-semibold text-foreground mb-4">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard title="Total Income" value={`₹${stats.total_income.toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="text-green-600" />
                <StatCard title="Total Expenses" value={`₹${stats.total_expense.toLocaleString('en-IN')}`} icon={DollarSign} colorClass="text-red-600" />
                <StatCard title="Net Profit" value={`₹${stats.net_profit.toLocaleString('en-IN')}`} icon={BarChart2} colorClass="text-blue-600" />
              </div>

              {/* Navigation Cards */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Management Tools</h2>
                {/* --- Add Notification Button --- */}
                <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Bell size={18} />
                  Send Notification
                </button>
              </div>
              
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

      {/* --- Render the Modal --- */}
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