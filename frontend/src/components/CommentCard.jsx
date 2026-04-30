import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function CommentCard({ comment }) {
  const isToxic = comment.label === 'Toxic';

  return (
    <div 
      className={`p-4 rounded-xl border ${
        isToxic 
          ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' 
          : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50'
      } transition-colors duration-300`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm md:text-base text-text leading-relaxed flex-1 pr-4">
          {comment.text}
        </p>
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isToxic 
              ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' 
              : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
          }`}>
            {isToxic ? <AlertOctagon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{comment.label}</span>
          </div>
          <span className="text-xs text-text-secondary font-medium">
            Conf: {(comment.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
