import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {description && (
            <p className="text-white/80 text-sm mt-1">{description}</p>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;