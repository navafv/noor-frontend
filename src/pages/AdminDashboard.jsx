import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { Users, BookOpen, Wallet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, coursesRes, financeRes] = await Promise.all([
          api.get('/students/?active=true'),
          api.get('/courses/?active=true'),
          api.get('/finance/dashboard/summary/')
        ]);

        setStats({
          students: studentsRes.data.count,
          courses: coursesRes.data.count,
          revenue: financeRes.data.summary.month_revenue 
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back, Teacher</p>
        </div>
        <Link to="/admin/students" className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors">
          <Plus size={24} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DashboardCard title="Active Students" value={loading ? "-" : stats.students} icon={Users} to="/admin/students" />
        <DashboardCard title="Active Courses" value={loading ? "-" : stats.courses} icon={BookOpen} to="/admin/courses" />
        <div className="col-span-2">
          <DashboardCard title="Month's Revenue" value={loading ? "-" : formatCurrency(stats.revenue)} icon={Wallet} to="/admin/finance" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Link to="/admin/finance" className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="bg-green-100 p-2 rounded-lg mr-3 text-green-600"><Wallet size={20}/></div>
                <span className="font-medium text-gray-700">Collect Fees</span>
            </Link>
            <Link to="/admin/attendance" className="flex items-center p-4 hover:bg-gray-50">
                <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600"><Users size={20}/></div>
                <span className="font-medium text-gray-700">Take Attendance</span>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;