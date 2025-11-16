import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, PieChart } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function AttendanceAnalyticsPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);

  // 1. Fetch all batches for the dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get('/batches/');
        setBatches(res.data.results || []);
        if (res.data.results?.length > 0) {
          setSelectedBatch(res.data.results[0].id); // Default to first batch
        }
      } catch (err) {
        toast.error('Failed to load batches.');
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // 2. Fetch chart data when selectedBatch changes
  useEffect(() => {
    if (!selectedBatch) return;
    
    const fetchAnalytics = async () => {
      setLoadingChart(true);
      try {
        const res = await api.get(`/attendance/analytics/batch/${selectedBatch}/timeline/`);
        setTimeline(res.data.timeline || []);
      } catch (err) {
        toast.error('Failed to load analytics for this batch.');
      } finally {
        setLoadingChart(false);
      }
    };
    fetchAnalytics();
  }, [selectedBatch]);

  // Format Y-axis ticks
  const formatYAxis = (tick) => `${tick}%`;

  return (
    <>
      <PageHeader title="Attendance Analytics" />
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Batch Selector */}
          <div className="mb-6 max-w-md">
            <label className="form-label">Select Batch</label>
            {loadingBatches ? <Loader2 className="animate-spin" /> : (
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="form-input"
              >
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.code} ({batch.course_title})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Chart */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Daily Attendance Percentage
            </h2>
            {loadingChart ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : timeline.length === 0 ? (
              <p className="text-center text-muted-foreground h-96">No attendance data to display for this batch.</p>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={formatYAxis} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))' 
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                    <Bar dataKey="present_percentage" fill="hsl(var(--primary))" name="Present %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AttendanceAnalyticsPage;