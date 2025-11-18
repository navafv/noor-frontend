import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const FinanceAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/finance/dashboard/summary/')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-center text-gray-400">No data available.</div>;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">₹{data.summary.total_revenue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase mb-1">Net Income</p>
            <p className="text-xl font-bold text-primary-600">₹{data.summary.net_income}</p>
        </div>
        <div className="col-span-2 bg-linear-to-r from-primary-600 to-primary-800 p-5 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <p className="text-primary-100 text-sm">This Month</p>
                <Wallet className="text-primary-200" size={20}/>
            </div>
            <div className="flex gap-6">
                <div>
                    <p className="text-2xl font-bold">₹{data.summary.month_revenue}</p>
                    <p className="text-xs text-primary-200 flex items-center gap-1"><TrendingUp size={12}/> Income</p>
                </div>
                <div className="w-px bg-white/20"></div>
                <div>
                    <p className="text-2xl font-bold">₹{data.summary.month_expense}</p>
                    <p className="text-xs text-primary-200 flex items-center gap-1"><TrendingDown size={12}/> Expense</p>
                </div>
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Revenue Trend</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="revenue" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
            {data.recent_transactions.map((txn, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {txn.type === 'credit' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{txn.description}</p>
                            <p className="text-xs text-gray-400">{txn.date}</p>
                        </div>
                    </div>
                    <span className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceAnalyticsPage;