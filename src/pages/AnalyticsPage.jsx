import React, { useState, useEffect } from 'react';
import { Loader2, DollarSign, TrendingUp, TrendingDown, AlertTriangle, PieChart, BarChart2, CheckCircle } from 'lucide-react'; // Added CheckCircle
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import {
  ResponsiveContainer, BarChart as ReBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar,
  PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip
} from 'recharts';

/**
 * Page for viewing financial and outstanding fee analytics.
 * Admin-only feature.
 */
function AnalyticsPage() {
  const [incomeExpense, setIncomeExpense] = useState([]);
  const [outstanding, setOutstanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [incomeRes, outstandingRes] = await Promise.all([
          api.get('/finance/analytics/income-expense/'),
          api.get('/finance/outstanding/overall/')
        ]);

        setIncomeExpense(incomeRes.data || []);
        setOutstanding(outstandingRes.data || null);

      } catch (err) {
        setError('Could not fetch analytics data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader title="Analytics & Reports" />
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <PageHeader title="Analytics & Reports" />
        <p className="form-error mx-4">{error}</p>
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Analytics & Reports" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-5xl space-y-8">
          
          {/* 1. Outstanding Fees Summary */}
          {outstanding && (
            <OutstandingSummary data={outstanding} />
          )}

          {/* 2. Income vs Expense Timeline */}
          {incomeExpense.length > 0 && (
            <IncomeExpenseTable data={incomeExpense} />
          )}

        </div>
      </main>
    </div>
  );
}

// --- Sub-components for Analytics Page ---

/**
 * Displays summary cards and a table for outstanding fees.
 */
const OutstandingSummary = ({ data }) => (
  <div>
    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
      <AlertTriangle size={24} className="mr-3 text-yellow-500" />
      Outstanding Fees Overview
    </h2>
    
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Expected Revenue" 
        value={`₹${data.grand_expected.toLocaleString('en-IN')}`} 
        icon={TrendingUp} 
        colorClass="text-blue-600"
      />
      <StatCard 
        title="Total Actually Paid" 
        value={`₹${data.grand_paid.toLocaleString('en-IN')}`} 
        icon={DollarSign} 
        colorClass="text-green-600"
      />
      <StatCard 
        title="Total Outstanding" 
        value={`₹${data.grand_due.toLocaleString('en-IN')}`} 
        icon={AlertTriangle} 
        colorClass="text-red-600"
      />
    </div>

    {/* --- NEW PIE CHART --- */}
    <div className="card p-4 mb-6" style={{ height: '350px' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Fees by Course</h3>
      <OutstandingPieChart data={data.summary} />
    </div>
    {/* --- END NEW PIE CHART --- */}

    {/* Per-Course Table */}
    <div className="card overflow-hidden">
      <h3 className="text-lg font-semibold text-foreground p-4 border-b border-border">
        Outstanding by Course (Raw Data)
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="table-header">Course</th>
              <th className="table-header text-right">Students</th>
              <th className="table-header text-right">Expected</th>
              <th className="table-header text-right">Paid</th>
              <th className="table-header text-right">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.summary.map((course) => (
              <tr key={course.course} className="hover:bg-accent">
                <td className="table-cell font-medium">{course.course}</td>
                <td className="table-cell text-right">{course.total_students}</td>
                <td className="table-cell text-right">₹{course.expected.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-green-600">₹{course.paid.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right font-medium text-red-600">₹{course.due.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/**
 * Displays monthly income vs expense data in a table.
 */
const IncomeExpenseTable = ({ data }) => (
  <div>
    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
      <BarChart2 size={24} className="mr-3 text-primary" />
      Monthly Financials
    </h2>

    {/* --- NEW BAR CHART --- */}
    <div className="card p-4 mb-6" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Income vs. Outgoing</h3>
      <IncomeExpenseChart data={data} />
    </div>
    {/* --- END NEW BAR CHART --- */}
    
    <div className="card overflow-hidden">
      <h3 className="text-lg font-semibold text-foreground p-4 border-b border-border">
        Monthly Financials (Raw Data)
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="table-header">Month</th>
              <th className="table-header text-right">Income</th>
              <th className="table-header text-right">Expense</th>
              <th className="table-header text-right">Payroll</th>
              <th className="table-header text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((month) => (
              <tr key={month.month} className="hover:bg-accent">
                <td className="table-cell font-medium">{month.month}</td>
                <td className="table-cell text-right text-green-600">₹{month.income.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-red-600">₹{month.expense.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-red-600">₹{month.payroll.toLocaleString('en-IN')}</td>
                <td className={`table-cell text-right font-bold ${month.net_profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{month.net_profit.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Helper component for stat cards
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

// --- CHART COMPONENT 1 ---
const IncomeExpenseChart = ({ data }) => {
  // Use Tailwind's resolved colors
  const colors = {
    income: 'hsl(var(--primary))',
    expense: 'hsl(var(--destructive))',
    payroll: 'hsl(18 96% 56%)', // orange-600
    text: 'hsl(var(--muted-foreground))'
  };

  const formatCurrency = (tick) => `₹${tick.toLocaleString('en-IN')}`;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke={colors.text} fontSize={12} />
        <YAxis stroke={colors.text} fontSize={12} tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          cursor={{ fill: 'hsl(var(--accent))' }}
        />
        <Legend />
        <Bar dataKey="income" fill={colors.income} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill={colors.expense} radius={[4, 4, 0, 0]} />
        <Bar dataKey="payroll" fill={colors.payroll} radius={[4, 4, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

// --- CHART COMPONENT 2 ---
const OutstandingPieChart = ({ data }) => {
  const chartData = data.filter(item => item.due > 0); // Only show courses with debt
  const COLORS = ['hsl(var(--primary-400))', 'hsl(var(--secondary-400))', 'hsl(25 95% 53%)', 'hsl(142 71% 45%)'];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="card p-2 text-sm shadow-lg">
          <p className="font-bold">{item.name}</p>
          {/* --- THIS IS THE FIX --- */}
          <p>{`Due: ₹${item.value.toLocaleString('en-IN')} (${(item.percent * 100).toFixed(0)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <CheckCircle size={24} className="mr-2 text-green-600" />
        <p>No outstanding fees! All courses are paid up.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <ReTooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          dataKey="due"
          nameKey="course"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          fontSize={12}
          stroke="hsl(var(--border))"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};

// Reusable table cell styles
const tableStyles = `
  .table-header {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .table-cell {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    white-space: nowrap;
  }
`;
// Inject styles into the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = tableStyles;
document.head.appendChild(styleSheet);

export default AnalyticsPage;