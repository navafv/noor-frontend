import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { Users, BookOpen, Wallet, Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, revenue: 0 });
  const [chartData, setChartData] = useState([]);
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
        // Take last 4 months for a mini chart
        setChartData(financeRes.data.chart_data.slice(0, 4).reverse());
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Overview</p>
        </div>
        <div className="flex gap-2">
            <Link to="/admin/students" className="bg-white border border-gray-200 text-gray-600 p-3 rounded-full shadow-sm hover:bg-gray-50">
                <UserPlus size={20} />
            </Link>
            <Link to="/admin/finance" className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700">
                <Plus size={20} />
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <DashboardCard title="Active Students" value={loading ? "-" : stats.students} icon={Users} to="/admin/students" />
        <DashboardCard title="Active Courses" value={loading ? "-" : stats.courses} icon={BookOpen} to="/admin/courses" />
      </div>

      {/* Revenue Mini-Chart Card */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 p-5 rounded-3xl shadow-lg text-white relative overflow-hidden">
         <div className="relative z-10 flex justify-between items-end mb-4">
            <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Month Revenue</p>
                <h3 className="text-3xl font-bold">{loading ? "..." : formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="bg-white/10 p-2 rounded-xl"><Wallet size={24}/></div>
         </div>
         
         {/* Tiny Bar Chart */}
         <div className="h-24 w-full opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <Bar dataKey="revenue" fill="#ffffff" radius={[4, 4, 4, 4]} />
                </BarChart>
            </ResponsiveContainer>
         </div>
         <Link to="/admin/finance-stats" className="absolute inset-0 z-20" aria-label="View Finance Stats"></Link>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Management</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Link to="/admin/finance" className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="bg-green-100 p-2 rounded-lg mr-3 text-green-600"><Wallet size={20}/></div>
                <div className="flex-1">
                    <span className="font-medium text-gray-700 block">Collect Fees</span>
                    <span className="text-xs text-gray-400">Record student payments</span>
                </div>
            </Link>
            <Link to="/admin/attendance" className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600"><Users size={20}/></div>
                <div className="flex-1">
                    <span className="font-medium text-gray-700 block">Take Attendance</span>
                    <span className="text-xs text-gray-400">Mark daily register</span>
                </div>
            </Link>
            <Link to="/admin/enrollments" className="flex items-center p-4 hover:bg-gray-50">
                <div className="bg-purple-100 p-2 rounded-lg mr-3 text-purple-600"><BookOpen size={20}/></div>
                <div className="flex-1">
                    <span className="font-medium text-gray-700 block">Enrollments</span>
                    <span className="text-xs text-gray-400">Manage active students</span>
                </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;