import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function CommentCard({ comment }) {
  const isToxic = comment.label === 'TOXIC';
  const isMild = comment.label === 'MILD TOXIC';

  let bgColor = 'bg-surface';
  let badgeColor = 'bg-surface';
  let Icon = CheckCircle2;

  if (isToxic) {
    bgColor = 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50';
    badgeColor = 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400';
    Icon = AlertOctagon;
  } else if (isMild) {
    bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50';
    badgeColor = 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400';
    Icon = AlertOctagon; // or AlertTriangle if imported
  } else {
    bgColor = 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50';
    badgeColor = 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400';
    Icon = CheckCircle2;
  }

  // Format date if it exists
  const dateStr = comment.timestamp ? new Date(comment.timestamp).toLocaleString() : '';

  return (
    <div className={`p-4 rounded-xl border ${bgColor} transition-colors duration-300 shadow-sm backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <p className="text-sm md:text-base text-text leading-relaxed">
            {comment.text}
          </p>
          {dateStr && (
            <p className="text-xs text-text-secondary mt-2 font-mono">
              {dateStr}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{comment.label === 'MILD TOXIC' ? 'Mild Toxic' : comment.label === 'TOXIC' ? 'Toxic' : 'Safe'}</span>
          </div>
          <span className="text-xs text-text-secondary font-medium">
            Conf: {(comment.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
