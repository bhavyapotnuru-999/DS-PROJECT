import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { FlaskConical, Wrench, CheckCircle2, ArrowRight, BookOpen, GraduationCap, School } from 'lucide-react';
import { MBULogo } from '../components/MBULogo';

interface HomePageProps {
  onNavigate: (tab: ActiveTab) => void;
  profile: UserProfile;
  completedCount: number;
  totalCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  profile,
  completedCount,
  totalCount,
}) => {
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="py-8 sm:py-12 space-y-10 sm:space-y-14">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-2">
          <School className="w-3.5 h-3.5" />
          <span>Mohan Babu University • School of Computing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          DS Lab Portal
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
          A simple and professional platform to manage, execute, document, and track Data Science laboratory experiments.
        </p>

        <div className="pt-2">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-left max-w-2xl mx-auto shadow-2xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Welcome to DS Lab Portal
            </h2>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              Manage your Data Science laboratory experiments, upload execution outputs, view experiment tools, and track your laboratory progress in one place.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Student: <strong className="text-slate-900">{profile.name}</strong> ({profile.roll_no})</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Faculty: <strong className="text-slate-900">{profile.assistant_professor}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Lab Executions */}
          <div
            onClick={() => onNavigate('executions')}
            className="group bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                Lab Executions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View and manage all Data Science laboratory experiments and their execution outputs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
              <span>Open 10 Experiments</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Experiment Tools */}
          <div
            onClick={() => onNavigate('tools')}
            className="group bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                Experiment Tools
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View the software, programming languages, and libraries used for each experiment.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700 group-hover:text-indigo-800">
              <span>View Tool Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Lab Progress */}
          <div
            onClick={() => onNavigate('profile')}
            className="group bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Lab Progress
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track completed and pending experiments.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Current Progress:</span>
                <span className="text-emerald-800">{completedCount} / {totalCount} Done ({percentage}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* University Institution Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
          <MBULogo size="lg" />
          <div className="text-center sm:text-left flex-1 space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Mohan Babu University — Department of Data Science
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Course Code: DS-3101 | Data Science Laboratory | Under supervision of Bosubabu Sir
            </p>
            <p className="text-xs text-slate-400 pt-1">
              All 10 required experiments conform to standard syllabus guidelines and require PDF execution reports.
            </p>
          </div>
          <button
            onClick={() => onNavigate('executions')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Start Submitting
          </button>
        </div>
      </div>
    </div>
  );
};
