import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, User, Box, Search, BarChart, Percent, Check, X, Minus } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

/**
 * Page for viewing attendance analytics.
 * Admin-only feature.
 */
function AttendanceAnalyticsPage() {
  const [viewMode, setViewMode] = useState('batch'); // 'batch' or 'student'
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [batchRes, studentRes] = await Promise.all([
          api.get('/batches/'),
          api.get('/students/')
        ]);
        setBatches(batchRes.data.results || []);
        setStudents(studentRes.data.results || []);
      } catch (err) {
        setError('Could not load initial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleFetchReport = async (e) => {
    e.preventDefault();
    if (!selectedId) return;

    const endpoint = viewMode === 'batch' 
      ? `/attendance/analytics/batch/${selectedId}/`
      : `/attendance/analytics/student/${selectedId}/`;

    try {
      setLoadingReport(true);
      setError(null);
      setReportData(null);
      const res = await api.get(endpoint);
      setReportData(res.data);
    } catch (err) {
      setError(`Failed to load report. ${err.response?.data?.detail || ''}`);
    } finally {
      setLoadingReport(false);
    }
  };

  const options = viewMode === 'batch' ? batches : students;
  const selectLabel = viewMode === 'batch' ? 'Select a Batch' : 'Select a Student';
  const selectPlaceholder = viewMode === 'batch' ? 'Search batches...' : 'Search students...';

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Attendance Analytics" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <div className="card p-4">
            {loading ? (
              <Loader2 className="animate-spin text-primary" />
            ) : (
              <form onSubmit={handleFetchReport} className="flex flex-col md:flex-row gap-4">
                {/* View Mode Toggle */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => { setViewMode('batch'); setSelectedId(''); setReportData(null); }}
                    className={`btn rounded-r-none ${viewMode === 'batch' ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <Box size={18} className="mr-2" /> By Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => { setViewMode('student'); setSelectedId(''); setReportData(null); }}
                    className={`btn rounded-l-none -ml-px ${viewMode === 'student' ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <User size={18} className="mr-2" /> By Student
                  </button>
                </div>
                
                {/* Selector */}
                <div className="grow">
                  <label htmlFor="searchSelect" className="form-label sr-only">{selectLabel}</label>
                  <select
                    id="searchSelect"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="" disabled>-- {selectLabel} --</option>
                    {options.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {viewMode === 'batch' ? `${opt.code} (${opt.course_title})` : `${opt.user.first_name} ${opt.user.last_name} (${opt.reg_no})`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button type="submit" className="btn-primary justify-center" disabled={loadingReport || !selectedId}>
                  {loadingReport ? <Loader2 className="animate-spin" /> : <Search size={18} className="mr-2" />}
                  Generate Report
                </button>
              </form>
            )}
            {error && <p className="form-error mt-4">{error}</p>}
          </div>

          {/* Report Display Area */}
          {loadingReport && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          )}
          
          {reportData && (
            viewMode === 'batch' 
              ? <BatchReport data={reportData} /> 
              : <StudentReport data={reportData} />
          )}

        </div>
      </main>
    </div>
  );
}

// --- Report Sub-components ---

const BatchReport = ({ data }) => (
  <div className="card overflow-hidden">
    <div className="p-4 border-b border-border">
      <h2 className="text-xl font-bold text-foreground">Attendance Report: {data.batch}</h2>
      <p className="text-muted-foreground">{data.course}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Trainer: {data.trainer || 'N/A'} | Total Days Logged: {data.total_days}
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="table-header">Student</th>
            <th className="table-header text-center">Percentage</th>
            <th className="table-header text-center"><Check size={16} className="inline-block" /> Present</th>
            <th className="table-header text-center"><X size={16} className="inline-block" /> Absent</th>
            <th className="table-header text-center"><Minus size={16} className="inline-block" /> Leave</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.students.map(s => (
            <tr key={s.student__id} className="hover:bg-accent">
              <td className="table-cell font-medium">{s.student__user__first_name} {s.student__user__last_name}</td>
              <td className="table-cell text-center font-bold">
                <span className={s.attendance_percentage > 80 ? 'text-green-600' : 'text-yellow-600'}>
                  {s.attendance_percentage}%
                </span>
              </td>
              <td className="table-cell text-center">{s.presents}</td>
              <td className="table-cell text-center">{s.absents}</td>
              <td className="table-cell text-center">{s.leaves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StudentReport = ({ data }) => (
  <div className="card overflow-hidden">
    <div className="p-4 border-b border-border">
      <h2 className="text-xl font-bold text-foreground">Attendance Report: {data.student}</h2>
      <p className="text-muted-foreground">Reg No: {data.reg_no}</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="table-header">Batch / Course</th>
            <th className="table-header text-center">Percentage</th>
            <th className="table-header text-center"><Check size={16} className="inline-block" /> Present</th>
            <th className="table-header text-center"><X size={16} className="inline-block" /> Absent</th>
            <th className="table-header text-center"><Minus size={16} className="inline-block" /> Leave</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.batches.map(b => (
            <tr key={b.attendance__batch__id} className="hover:bg-accent">
              <td className="table-cell font-medium">
                {b.attendance__batch__code}
                <span className="block text-xs text-muted-foreground">{b.attendance__batch__course__title}</span>
              </td>
              <td className="table-cell text-center font-bold">
                <span className={b.attendance_percentage > 80 ? 'text-green-600' : 'text-yellow-600'}>
                  {b.attendance_percentage}%
                </span>
              </td>
              <td className="table-cell text-center">{b.presents}</td>
              <td className="table-cell text-center">{b.absents}</td>
              <td className="table-cell text-center">{b.leaves}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

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

export default AttendanceAnalyticsPage;