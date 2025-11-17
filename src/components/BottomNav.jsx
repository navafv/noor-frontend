import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, Wallet, Calendar, User, Scissors } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.is_staff;

  // --- Navigation Items Configuration ---
  const adminLinks = [
    { to: "/admin/dashboard", icon: Home, label: "Home" },
    { to: "/admin/students", icon: Users, label: "Students" },
    { to: "/admin/courses", icon: Scissors, label: "Courses" }, // Stitching Icon substitute
    { to: "/admin/finance", icon: Wallet, label: "Fees" },
    { to: "/admin/menu", icon: User, label: "Menu" }, // More options
  ];

  const studentLinks = [
    { to: "/student/home", icon: Home, label: "Home" },
    { to: "/student/materials", icon: BookOpen, label: "Learn" },
    { to: "/student/finance", icon: Wallet, label: "Fees" },
    { to: "/student/profile", icon: User, label: "Profile" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 h-(--bottom-nav-height)">
      <div className="flex justify-around items-center h-full px-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full space-y-1
              transition-colors duration-200
              ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {({ isActive }) => (
              <>
                <link.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill={isActive ? "currentColor" : "none"} 
                  className={isActive ? "opacity-20" : ""}
                />
                {/* Overlay Outline Icon for crispness */}
                <div className="absolute">
                     <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className="text-[10px] font-medium">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;