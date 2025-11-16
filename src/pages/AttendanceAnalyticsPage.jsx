import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, PieChart, Users } from 'lucide-react'; // <-- NEW
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function AttendanceAnalyticsPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [summary, setSummary] = useState(null); // <-- NEW
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
      setSummary(null); // Clear old summary
      try {
        // --- NEW: Fetch timeline and summary in parallel ---
        const [timelineRes, summaryRes] = await Promise.all([
          api.get(`/attendance/analytics/batch/${selectedBatch}/timeline/`),
          api.get(`/attendance/analytics/batch/${selectedBatch}/summary/`)
        ]);
        setTimeline(timelineRes.data.timeline || []);
        setSummary(summaryRes.data); // Set summary data
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
        <div className="mx-auto max-w-7xl space-y-8"> {/* <-- NEW: Added space-y-8 */}
          {/* Batch Selector */}
          <div className="max-w-md">
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

          {/* --- NEW: Student Summary Table --- */}
          <div className="card overflow-hidden">
            <h2 className="text-xl font-semibold text-foreground p-6 flex items-center gap-2">
              <Users size={22} /> Student Summary
            </h2>
            {loadingChart ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : !summary || !summary.students || summary.students.length === 0 ? (
              <p className="text-center p-8 text-muted-foreground">No students found in this batch.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 font-medium">Student</th>
                      <th className="p-4 font-medium">Reg. No</th>
                      <th className="p-4 font-medium">Present</th>
                      <th className="p-4 font-medium">Absent</th>
                      <th className="p-4 font-medium">Leave</th>
                      <th className="p-4 font-medium">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {summary.students.map(s => (
                      <tr key={s.student__id}>
                        <td className="p-4 font-medium text-foreground">{s.student__user__first_name} {s.student__user__last_name}</td>
                        <td className="p-4 text-muted-foreground">{s.student__reg_no || 'N/A'}</td>
                        <td className="p-4 text-green-600 font-medium">{s.presents}</td>
                        <td className="p-4 text-destructive font-medium">{s.absents}</td>
                        <td className="p-4 text-yellow-600 font-medium">{s.leaves}</td>
                        <td className={`p-4 font-bold ${s.attendance_percentage < 75 ? 'text-destructive' : 'text-green-600'}`}>
                          {s.attendance_percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default AttendanceAnalyticsPage;