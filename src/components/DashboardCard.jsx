import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, icon: Icon, color = "bg-white", to }) => {
  const CardContent = (
    <div className={`${color} p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all`}>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      {Icon && (
        <div className="p-3 bg-gray-50 rounded-xl text-primary-600">
          <Icon size={24} />
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{CardContent}</Link>;
  }
  return CardContent;
};

export default DashboardCard;