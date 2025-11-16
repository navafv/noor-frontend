import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, BarChart2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function AnalyticsPage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/finance/analytics/income-expense/');
        setTimeline(res.data || []);
      } catch (err) {
        toast.error('Failed to load financial analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Format Y-axis ticks
  const formatYAxis = (tick) => `₹${tick / 1000}k`;

  return (
    <>
      <PageHeader title="Financial Analytics" />
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Income vs. Expense Over Time
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : timeline.length === 0 ? (
              <p className="text-center text-muted-foreground h-96">No financial data to display.</p>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={formatYAxis} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} />
                    <Line type="monotone" dataKey="net_profit" stroke="hsl(120 60% 50%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AnalyticsPage;