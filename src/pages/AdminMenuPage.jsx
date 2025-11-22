import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, ChevronRight, TrendingDown, AlertCircle, BarChart2, Users, Shield, Database, Download, Smartphone } from 'lucide-react'; // Added Database icon
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdminMenuPage = () => {
  const { user, logout } = useAuth();
  const [backingUp, setBackingUp] = useState(false);

  const handleBackup = async () => {
    setBackingUp(true);
    const toastId = toast.loading("Generating system backup...");
    try {
        const response = await api.get('/system/backup/', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `noor_backup_${new Date().toISOString().split('T')[0]}.json.gz`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Backup downloaded", { id: toastId });
    } catch (e) {
        toast.error("Backup failed", { id: toastId });
    } finally {
        setBackingUp(false);
    }
  };

  const MenuLink = ({ icon: Icon, label, to, color = "text-gray-600", bgColor = "bg-gray-50" }) => (
    <Link to={to} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
          <Icon size={20} />
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-300" />
    </Link>
  );

  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
          {user?.first_name?.[0] || 'A'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-500">Administrator</p>
          <Link to="/admin/profile" className="text-xs text-primary-600 font-semibold mt-1 block">Account Settings</Link>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Analytics</h3>
        <MenuLink icon={BarChart2} label="Finance Overview" to="/admin/finance-stats" color="text-green-600" bgColor="bg-green-50" />
        <MenuLink icon={Users} label="Attendance Stats" to="/admin/attendance-stats" color="text-blue-600" bgColor="bg-blue-50" />

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6">Management</h3>
        <MenuLink icon={Shield} label="Staff Management" to="/admin/staff" color="text-purple-600" bgColor="bg-purple-50" />
        <MenuLink icon={TrendingDown} label="Manage Expenses" to="/admin/expenses" color="text-red-600" bgColor="bg-red-50" />
        <MenuLink icon={AlertCircle} label="Outstanding Fees" to="/admin/outstanding" color="text-orange-600" bgColor="bg-orange-50" />

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6">Academic</h3>
        <MenuLink icon={FileText} label="Course Materials" to="/admin/materials" color="text-indigo-600" bgColor="bg-indigo-50" />
        <MenuLink icon={FileText} label="Certificates" to="/admin/certificates" color="text-yellow-600" bgColor="bg-yellow-50" />
      </div>

      {deferredPrompt && (
        <button onClick={handleInstallClick} className="w-full bg-gray-900 text-white p-4 rounded-2xl font-bold mt-4 flex items-center justify-center gap-2">
          <Smartphone size={20} /> Install App to Home Screen
        </button>
      )}

      {/* NEW SECTION: System Tools */}
      <div className="mt-8">
          <button 
            onClick={handleBackup}
            disabled={backingUp}
            className="w-full flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl shadow-lg active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-70"
          >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                    <Database size={20} />
                </div>
                <span className="font-medium">Download Database Backup</span>
            </div>
            <Download size={20} className="text-gray-400" />
          </button>
      </div>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors mt-4 cursor-pointer"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

export default AdminMenuPage;