import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import {
  FlaskConical,
  Wrench,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  FolderOpen,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { MBULogo } from '../components/MBULogo';
import { StudentIDCard } from '../components/StudentIDCard';

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
    <div className="pt-3 sm:pt-5 pb-8 sm:pb-12 space-y-10 sm:space-y-14">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-8 lg:gap-12 items-start">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-1 shadow-2xs">
              <School className="w-3.5 h-3.5 text-blue-700" />
              <span>Mohan Babu University • School of Computing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Data Science Digital Laboratory
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A simple and professional platform to manage, execute, document, and track Data Science laboratory experiments.
            </p>

            <div className="pt-1">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-left max-w-2xl mx-auto lg:mx-0 shadow-2xs">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Welcome to Data Science Digital Laboratory
                </h2>
                <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
                  Manage your Data Science laboratory experiments, read digital textbook modules, access learning resources, build applied projects, and track your laboratory progress in one place.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-700" />
                    <span>
                      Student: <strong className="text-slate-900">{profile.name}</strong> ({profile.roll_no})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>
                      Faculty: <strong className="text-slate-900">{profile.assistant_professor}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Digital ID Badge */}
          <div className="flex justify-center lg:justify-end">
            <StudentIDCard profile={profile} compact />
          </div>
        </div>
      </div>

      {/* Feature Cards Grid (Modules, Lab, Resources, Projects, Tools, Progress) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Modules */}
          <div
            onClick={() => onNavigate('modules')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  Modules
                </h3>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Textbook
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book-style learning with chapter notes, definitions, interactive code, SVG diagrams, and self-assessment questions.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
              <span>Read 10 Curriculum Volumes</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Lab Executions */}
          <div
            onClick={() => onNavigate('executions')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                  Lab Executions
                </h3>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  10 Labs
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                View and manage all Data Science laboratory experiments, upload execution PDFs, preview documents, and check test cases.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700 group-hover:text-indigo-800">
              <span>Open 10 Experiments</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Resources Library */}
          <div
            onClick={() => onNavigate('resources')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  Resources
                </h3>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Library
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access curated cheat sheets, benchmark CSV datasets, official documentation, and academic video lectures.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
              <span>Explore Resource Library</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4: Projects */}
          <div
            onClick={() => onNavigate('projects')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-purple-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                  Lab Projects
                </h3>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Applied
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Beginner to Advanced capstone projects with step-by-step implementation roadmaps, GitHub repos, and deliverable uploads.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700 group-hover:text-purple-800">
              <span>View Applied Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 5: Experiment Tools */}
          <div
            onClick={() => onNavigate('tools')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                Experiment Tools
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View the software, programming languages, and libraries used across each experiment with clear academic explanations.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700 group-hover:text-amber-800">
              <span>View Tool Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 6: Lab Progress */}
          <div
            onClick={() => onNavigate('profile')}
            className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center transition-transform group-hover:scale-105">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Lab Progress
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track completed and pending experiments dynamically linked to database status.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Current Progress:</span>
                <span className="text-emerald-800 font-bold">
                  {completedCount} / {totalCount} Done ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* University Institution Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg border border-slate-800">
          <MBULogo size="lg" />
          <div className="text-center sm:text-left flex-1 space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Mohan Babu University — Department of Data Science
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Course Code: DS-3101 | Data Science Digital Laboratory | Under supervision of Bosubabu Sir
            </p>
            <p className="text-xs text-slate-400 pt-1">
              All 10 required experiments conform to standard syllabus guidelines and require PDF execution reports.
            </p>
          </div>
          <button
            onClick={() => onNavigate('executions')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Start Lab Executions
          </button>
        </div>
      </div>
    </div>
  );
};
