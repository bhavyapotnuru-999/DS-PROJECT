import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { MBULogo } from './MBULogo';
import { Menu, X, Home, FlaskConical, Wrench, User, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  completedCount?: number;
  totalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  completedCount = 6,
  totalCount = 10,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'executions', label: 'Lab Executions', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left Brand: MBU Logo | DS Lab Portal */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 group focus:outline-hidden text-left"
            >
              <MBULogo size="md" showUploadOption={true} />
              <div className="flex items-center gap-2.5 sm:gap-3 border-l border-slate-200 pl-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-blue-900 transition-colors">
                      MBU
                    </span>
                    <span className="text-slate-300 font-light">|</span>
                    <span className="font-semibold text-slate-800 text-base sm:text-lg">
                      DS Lab Portal
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 hidden sm:block tracking-wide">
                    Mohan Babu University • Data Science Dept
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-blue-800' : 'text-slate-600'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.id === 'executions' && (
                    <span
                      className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-200 text-blue-950 font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Academic Status Indicator (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedCount}/{totalCount} Completed</span>
            </div>
            <button
              onClick={() => handleTabClick('profile')}
              title="Go to student profile"
              className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100">
                BP
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Student: Bhavya Potnuru (24102A030098)</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {completedCount}/{totalCount} Done
            </span>
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-blue-700' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'executions' && (
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    {completedCount}/{totalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
