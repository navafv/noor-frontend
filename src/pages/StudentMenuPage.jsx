import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Phone, User, MapPin } from 'lucide-react';

const StudentMenuPage = () => {
  const { user, logout } = useAuth();
  const student = user?.student_details || {}; // Assumes loaded in AuthContext or separate fetch

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mb-4">
          {user?.first_name?.[0]}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
        <p className="text-gray-500 font-mono text-sm">{student.reg_no || user?.username}</p>
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Personal Info</h3>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><Phone size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || 'N/A'}</p>
            </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 text-purple-600 p-2 rounded-xl"><User size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Guardian</p>
                <p className="font-medium text-gray-900">{student.guardian_name || 'N/A'}</p>
            </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-green-50 text-green-600 p-2 rounded-xl"><MapPin size={20}/></div>
            <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-medium text-gray-900">{student.address || 'N/A'}</p>
            </div>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

export default StudentMenuPage;