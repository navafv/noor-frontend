import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const AttendanceStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    api.get('/attendance/analytics/summary/', { params: { days } })
      .then(res => {
          setStats(res.data.stats);
          setHistory(res.data.chart_data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const COLORS = ['#22c55e', '#ef4444', '#f97316', '#3b82f6']; // Green, Red, Orange, Blue
  
  const getChartData = () => {
      if (!stats) return [];
      return [
        { name: 'Present', value: stats.present },
        { name: 'Absent', value: stats.absent },
        { name: 'Late', value: stats.late },
        { name: 'Excused', value: stats.excused },
      ].filter(item => item.value > 0);
  };

  const chartData = getChartData();

  if (loading) return <div className="p-8 text-center text-gray-400">Loading stats...</div>;
  if (!stats) return <div className="p-8 text-center text-gray-400">No data available.</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Stats</h2>
        <select 
            className="bg-white border border-gray-200 text-sm rounded-lg p-2 outline-none focus:border-primary-500"
            value={days}
            onChange={(e) => setDays(e.target.value)}
        >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-green-600">
                <CheckCircle size={18} /> <span className="text-xs font-bold uppercase">Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.rate}%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-red-500">
                <AlertCircle size={18} /> <span className="text-xs font-bold uppercase">Absent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="font-bold text-gray-800 mb-4 w-full text-left">Distribution</h3>
        
        {chartData.length > 0 ? (
            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={chartData} 
                            cx="50%" cy="50%" 
                            innerRadius={60} outerRadius={80} 
                            paddingAngle={5} dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-gray-400">Total</span>
                </div>
            </div>
        ) : (
            <div className="h-48 w-full flex items-center justify-center text-gray-400 text-sm">
                No data to display
            </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Late</div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Daily Trend</h3>
        {history.length === 0 ? (
            <p className="text-gray-400 text-sm">No records in this period.</p>
        ) : (
            <div className="space-y-2">
                {history.map((day, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">{day.date}</span>
                        <div className="flex gap-3 text-xs font-bold">
                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded">P: {day.present}</span>
                            <span className="text-red-500 bg-red-50 px-2 py-1 rounded">A: {day.absent}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStatsPage;