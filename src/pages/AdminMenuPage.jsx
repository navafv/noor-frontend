import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, CreditCard, CalendarCheck, 
  Award, Bell, Settings, UserPlus, FileText,
  DollarSign, BarChart2, Briefcase
} from 'lucide-react';

const AdminMenuPage = () => {
  const menuSections = [
    {
      title: "Academic",
      items: [
        { label: "Students", icon: Users, path: "/admin/students", color: "text-blue-600 bg-blue-50" },
        { label: "Courses", icon: BookOpen, path: "/admin/courses", color: "text-purple-600 bg-purple-50" },
        { label: "Enrollments", icon: UserPlus, path: "/admin/enrollments", color: "text-indigo-600 bg-indigo-50" },
        { label: "Certificates", icon: Award, path: "/admin/certificates", color: "text-yellow-600 bg-yellow-50" },
      ]
    },
    {
      title: "Finance",
      items: [
        { label: "Fee Receipts", icon: CreditCard, path: "/admin/finance", color: "text-green-600 bg-green-50" },
        { label: "Expenses", icon: DollarSign, path: "/admin/expenses", color: "text-red-600 bg-red-50" },
        { label: "Outstanding", icon: FileText, path: "/admin/outstanding", color: "text-orange-600 bg-orange-50" },
        { label: "Analytics", icon: BarChart2, path: "/admin/finance-stats", color: "text-emerald-600 bg-emerald-50" },
      ]
    },
    {
      title: "Operations",
      items: [
        { label: "Attendance", icon: CalendarCheck, path: "/admin/attendance", color: "text-teal-600 bg-teal-50" },
        { label: "Staff", icon: Briefcase, path: "/admin/staff", color: "text-gray-600 bg-gray-50" },
        { label: "Notify", icon: Bell, path: "/admin/notifications/send", color: "text-pink-600 bg-pink-50" },
        { label: "Settings", icon: Settings, path: "/admin/profile", color: "text-gray-600 bg-gray-100" },
      ]
    }
  ];

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Menu</h1>
      
      <div className="space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">{section.title}</h3>
            <div className="grid grid-cols-2 gap-3">
              {section.items.map((item, i) => (
                <Link 
                  key={i} 
                  to={item.path}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-2 text-center"
                >
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenuPage;