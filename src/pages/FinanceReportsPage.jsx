import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Loader2, DollarSign, Users, Book, Briefcase } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { toast } from 'react-hot-toast';

// Format currency
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

function FinanceReportsPage() {
  const [reportType, setReportType] = useState('overall');
  const [selectedId, setSelectedId] = useState('');
  const [lists, setLists] = useState({ courses: [], batches: [] });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);

  // Fetch courses and batches for dropdowns
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [coursesRes, batchesRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/batches/')
        ]);
        setLists({
          courses: coursesRes.data.results || [],
          batches: batchesRes.data.results || []
        });
      } catch (err) {
        toast.error('Failed to load courses or batches.');
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, []);

  const handleGenerateReport = async () => {
    if ((reportType === 'course' || reportType === 'batch') && !selectedId) {
      toast.error('Please select a course or batch.');
      return;
    }

    setLoading(true);
    setReportData(null);
    let url = '/finance/outstanding/';

    if (reportType === 'overall') {
      url += 'overall/';
    } else if (reportType === 'course') {
      url += `course/${selectedId}/`;
    } else if (reportType === 'batch') {
      url += `batch/${selectedId}/`;
    }

    try {
      const res = await api.get(url);
      setReportData(res.data);
    } catch (err) {
      toast.error('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Financial Reports" />
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setSelectedId('');
                    setReportData(null);
                  }}
                  className="form-input"
                >
                  <option value="overall">Overall Summary</option>
                  <option value="course">By Course</option>
                  <option value="batch">By Batch</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Select Item</label>
                {reportType === 'overall' && (
                  <input type="text" className="form-input" value="Overall institute data" disabled />
                )}
                {reportType === 'course' && (
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="form-input"
                    disabled={loadingLists}
                  >
                    <option value="">-- Select a course --</option>
                    {lists.courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                )}
                {reportType === 'batch' && (
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="form-input"
                    disabled={loadingLists}
                  >
                    <option value="">-- Select a batch --</option>
                    {lists.batches.map(b => <option key={b.id} value={b.id}>{b.code} ({b.course_title})</option>)}
                  </select>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn-primary" onClick={handleGenerateReport} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Report Display */}
          {loading && (
            <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
          )}
          {reportData && (
            <div className="card p-6">
              {reportType === 'overall' && <OverallReport data={reportData} />}
              {reportType === 'course' && <CourseReport data={reportData} />}
              {reportType === 'batch' && <BatchReport data={reportData} />}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// --- Report Components ---

const ReportStat = ({ title, value, icon: Icon, color = 'text-foreground' }) => (
  <div className="card p-4">
    <p className="text-sm text-muted-foreground flex items-center gap-2"><Icon size={16} /> {title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const OverallReport = ({ data }) => (
  <div>
    <h2 className="text-xl font-semibold text-foreground mb-4">Overall Institute Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ReportStat title="Total Expected" value={formatCurrency(data.grand_expected)} icon={DollarSign} />
      <ReportStat title="Total Paid" value={formatCurrency(data.grand_paid)} icon={DollarSign} color="text-green-600" />
      <ReportStat title="Total Due" value={formatCurrency(data.grand_due)} icon={DollarSign} color="text-destructive" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-4">Breakdown by Course</h3>
    <ul className="divide-y divide-border">
      {data.summary.map(course => (
        <li key={course.course} className="py-3 grid grid-cols-4 gap-2 text-sm">
          <span className="font-medium text-primary col-span-2">{course.course}</span>
          <span>Students: {course.total_students}</span>
          <span>Paid: {formatCurrency(course.paid)}</span>
          <span className="text-destructive">Due: {formatCurrency(course.due)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const CourseReport = ({ data }) => (
  <div>
    <h2 className="text-xl font-semibold text-foreground mb-4">Course Report: {data.course}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ReportStat title="Total Students" value={data.total_students} icon={Users} />
      <ReportStat title="Total Expected" value={formatCurrency(data.total_expected)} icon={DollarSign} />
      <ReportStat title="Total Due" value={formatCurrency(data.total_due)} icon={DollarSign} color="text-destructive" />
    </div>
  </div>
);

const BatchReport = ({ data }) => (
  <div>
    <h2 className="text-xl font-semibold text-foreground mb-4">Batch Report: {data.batch} ({data.course})</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ReportStat title="Total Students" value={data.total_students} icon={Users} />
      <ReportStat title="Total Fees" value={formatCurrency(data.total_fees)} icon={DollarSign} />
      <ReportStat title="Total Due" value={formatCurrency(data.total_due)} icon={DollarSign} color="text-destructive" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-4">Student Breakdown</h3>
    <ul className="divide-y divide-border">
      {data.students.map(s => (
        <li key={s.reg_no} className="py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="font-medium text-foreground">{s.student} ({s.reg_no})</span>
          <span className="text-green-600">Paid: {formatCurrency(s.paid)}</span>
          <span className="text-destructive">Due: {formatCurrency(s.due)}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default FinanceReportsPage;