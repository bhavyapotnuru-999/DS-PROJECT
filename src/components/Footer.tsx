import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Mandatory Fair Use Text at bottom-left */}
          <div className="text-slate-500">
            By{' '}
            <a
              href="https://www.mbu.asia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 underline font-medium"
            >
              https://www.mbu.asia
            </a>
            , Fair use
          </div>

          {/* Academic Portal Meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500 text-[11px]">
            <span>Mohan Babu University</span>
            <span>•</span>
            <span>Department of Data Science</span>
            <span>•</span>
            <span>B.Tech Data Science Digital Laboratory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
