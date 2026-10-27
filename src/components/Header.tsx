import React, { useState } from 'react';
import { ActiveTab, UserProfile } from '../types';
import { MBULogo } from './MBULogo';
import {
  Menu,
  X,
  Home,
  BookOpen,
  FlaskConical,
  FolderOpen,
  Briefcase,
  Wrench,
  User,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  completedCount?: number;
  totalCount?: number;
  profile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  completedCount = 6,
  totalCount = 10,
  profile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation order requested:
  // 1. Modules, 2. Lab, 3. Resources, 4. Projects (while keeping Home, Tools, Profile)
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'modules', label: 'Modules', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'executions', label: 'Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
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
          {/* Left Brand: MBU Logo | Data Science Digital Laboratory */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2 sm:gap-3 group focus:outline-hidden text-left"
            >
              <MBULogo size="md" showUploadOption={true} />
              <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-2.5 sm:pl-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 text-[13px] xl:text-sm leading-snug whitespace-nowrap group-hover:text-blue-900 transition-colors">
                    Data Science Digital Laboratory
                  </span>
                  <span className="text-[10px] xl:text-[11px] text-slate-500 hidden sm:block whitespace-nowrap leading-tight pt-0.5">
                    Mohan Babu University • School of Computing
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-blue-800' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.id === 'executions' && (
                    <span
                      className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
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
          <div className="hidden xl:flex items-center pl-3 border-l border-slate-200 shrink-0">
            <button
              onClick={() => handleTabClick('profile')}
              title={`View ${profile?.name || 'Student'} profile`}
              className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100 overflow-hidden shadow-2xs">
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {profile?.name
                      ? profile.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                      : 'BP'}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
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
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Student: Bhavya Potnuru (24102A030098)</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {completedCount}/{totalCount} Labs Done
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
