import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-5 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 flex items-center gap-3 min-w-0 overflow-hidden">
      {/* Icon — smaller on mobile */}
      <div className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${colorClass}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      {/* Text — prevent overflow */}
      <div className="min-w-0 flex-1">
        <p className="text-text-secondary text-xs sm:text-sm font-medium truncate">{title}</p>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-text mt-0.5 leading-tight break-all">{value}</p>
      </div>
    </div>
  );
}
