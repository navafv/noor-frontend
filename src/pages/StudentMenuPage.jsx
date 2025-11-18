import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Phone, User, MapPin, Award, Calendar, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentMenuPage = () => {
  const { user, logout } = useAuth();
  const student = user?.student_details || {}; 

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

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mb-4">
          {user?.first_name?.[0]}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
        <p className="text-gray-500 font-mono text-sm">{student.reg_no || user?.username}</p>
        <Link to="/student/settings" className="text-xs text-primary-600 font-semibold mt-2 border border-primary-100 px-3 py-1 rounded-full">
            Account Settings
        </Link>
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Institute</h3>
        <MenuLink icon={Award} label="My Certificates" to="/student/certificates" color="text-yellow-600" bgColor="bg-yellow-50" />
        <MenuLink icon={Calendar} label="Events & Holidays" to="/events" color="text-blue-600" bgColor="bg-blue-50" />
        <MenuLink icon={Bell} label="Notifications" to="/notifications" color="text-purple-600" bgColor="bg-purple-50" />
      </div>

      {/* Personal Info */}
      <div className="space-y-3 mt-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Personal Info</h3>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-gray-50 text-gray-600 p-2 rounded-xl"><Phone size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || 'N/A'}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-gray-50 text-gray-600 p-2 rounded-xl"><User size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Guardian</p>
                <p className="font-medium text-gray-900">{student.guardian_name || 'N/A'}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-gray-50 text-gray-600 p-2 rounded-xl"><MapPin size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-medium text-gray-900">{student.address || 'N/A'}</p>
            </div>
        </div>
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors cursor-pointer">
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  );
};

export default StudentMenuPage;