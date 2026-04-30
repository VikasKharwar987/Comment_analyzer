import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow duration-300 flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-text mt-1">{value}</p>
      </div>
    </div>
  );
}
