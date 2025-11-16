import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Users, CheckSquare, Book, Calendar, UserX } from 'lucide-react'; // <-- NEW
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// StatCard Component
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

// NavCard Component
const NavCard = ({ title, description, to, icon: Icon }) => (
  <Link to={to} className="block p-4 card hover:shadow-md transition-all">
    <div className="flex items-center space-x-3">
      <Icon className="w-6 h-6 text-primary" />
      <div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Link>
);

// --- NEW: Helper to format date ---
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // This endpoint now returns: { active_batch_count, active_student_count, todays_classes, recent_absences }
        const summaryRes = await api.get('/teacher/my-dashboard/');
        setStats(summaryRes.data);
      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <>
      <PageHeader title={`Welcome, ${user?.first_name || 'Teacher'}`} showBackButton={false} />
      
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          
          {!loading && stats && (
            <>
              {/* Stats */}
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatCard 
                  title="Active Batches" 
                  value={stats.active_batch_count} 
                  icon={Book} 
                  colorClass="text-blue-600" 
                />
                <StatCard 
                  title="Active Students" 
                  value={stats.active_student_count} 
                  icon={Users} 
                  colorClass="text-green-600" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Today's Classes */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    Today's Classes
                  </h3>
                  {stats.todays_classes.length > 0 ? (
                    <ul className="space-y-3">
                      {stats.todays_classes.map(cls => (
                        <li key={cls.batch_code} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium text-foreground">{cls.batch_code}</p>
                            <p className="text-xs text-muted-foreground">{cls.course_title}</p>
                          </div>
                          <span className="font-medium text-primary">{cls.schedule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
                  )}
                </div>

                {/* Recent Absences */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <UserX size={20} className="text-destructive" />
                    Recent Absences
                  </h3>
                  {stats.recent_absences.length > 0 ? (
                    <ul className="space-y-3">
                      {stats.recent_absences.map((abs, i) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium text-foreground">{abs.student_name}</p>
                            <p className="text-xs text-muted-foreground">{abs.batch_code}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(abs.date)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent absences in your batches.</p>
                  )}
                </div>
              </div>

              {/* Navigation Cards */}
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NavCard 
                  title="Take Attendance" 
                  description="Mark attendance for your batches" 
                  to="/teacher/attendance" 
                  icon={CheckSquare} 
                />
                <NavCard 
                  title="My Batches" 
                  description="View students in your active batches" 
                  to="/teacher/my-batches"
                  icon={Users} 
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default TeacherDashboard;