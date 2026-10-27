import React, { useState } from 'react';
import { TextbookModule } from '../types';
import {
  FileText,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
  Download,
  X,
  ExternalLink,
} from 'lucide-react';

interface ModulesPageProps {
  modules: TextbookModule[];
  onToggleComplete: (moduleId: string, isCompleted: boolean) => void;
  onNavigateToLab?: (expNumber: number) => void;
  userId: string;
}

export const ModulesPage: React.FC<ModulesPageProps> = ({
  modules,
  onToggleComplete,
  onNavigateToLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Pending'>('All');

  // Simple, Normal PDF Viewer State
  const [activePdfModule, setActivePdfModule] = useState<TextbookModule | null>(null);

  // Bundled official module PDFs shipped with the app
  const getModulePdfUrl = (module: TextbookModule) =>
    `/pdfs/module${module.module_number}.pdf`;
  const getModulePdfName = (module: TextbookModule) =>
    `module${module.module_number}.pdf`;

  // Strictly enforce 5 module slots: Module 1, Module 2, Module 3, Module 4, Module 5
  const fiveModules = modules
    .filter((m) => m.module_number >= 1 && m.module_number <= 5)
    .sort((a, b) => a.module_number - b.module_number)
    .slice(0, 5);

  const filteredModules = fiveModules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `module ${mod.module_number}`.includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? mod.is_completed
        : !mod.is_completed;

    return matchesSearch && matchesStatus;
  });

  const completedCount = fiveModules.filter((m) => m.is_completed).length;

  // Helper to open PDF in a new window/tab safely
  const handleOpenPdfInNewTab = (module: TextbookModule) => {
    const pdfUrl = getModulePdfUrl(module);

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Module ${module.module_number}: ${module.title}</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #0f172a; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${pdfUrl}" type="application/pdf"></iframe>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  // Helper to download the module's PDF
  const handleDownloadPdf = (module: TextbookModule) => {
    const a = document.createElement('a');
    a.href = getModulePdfUrl(module);
    a.download = getModulePdfName(module);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Curriculum Modules (5 Slots)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curriculum Modules
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Official 5-module digital laboratory curriculum. Open the bundled PDF learning material for each module directly in the built-in viewer or download it instantly.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedCount} / 5 Modules Completed</span>
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by module title, description, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {(['All', 'Completed', 'Pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid — Exactly 5 module slots: Module 1, Module 2, Module 3, Module 4, Module 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredModules.map((mod) => {
          const isDone = mod.is_completed || false;

          return (
            <div
              key={mod.id}
              onClick={() => setActivePdfModule(mod)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
            >
              {/* Module Cover Top */}
              <div
                className={`h-44 sm:h-48 bg-gradient-to-br ${mod.cover_gradient} p-6 flex flex-col justify-between relative overflow-hidden text-white border-b border-slate-900/40`}
              >
                {/* Book Spine Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/30 border-r border-white/10 shadow-inner" />

                {/* Subtle Background Pattern */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

                {/* Top Cover Bar */}
                <div className="flex items-center justify-between z-10 pl-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md font-bold text-white/95 border border-white/20">
                    MODULE {mod.module_number.toString().padStart(2, '0')}
                  </span>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

                {/* Cover Title */}
                <div className="z-10 pl-2 space-y-1">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug line-clamp-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 font-medium">
                    {mod.subtitle}
                  </p>
                </div>

                {/* Cover Bottom Meta */}
                <div className="z-10 pl-2 flex items-center justify-between text-[11px] text-slate-300/90 pt-2 border-t border-white/10">
                  <span>{mod.edition}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-sky-300" />
                    {mod.estimated_read_time}
                  </span>
                </div>
              </div>

              {/* Module Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Module Progress</span>
                      <span>{mod.progress_percent || (isDone ? 100 : 0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${mod.progress_percent || (isDone ? 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Primary Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePdfModule(mod);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open PDF Viewer</span>
                  </button>

                  {mod.linked_experiment_number && onNavigateToLab && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToLab(mod.linked_experiment_number!);
                      }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title={`Go to Experiment ${mod.linked_experiment_number}`}
                    >
                      <span>Lab #{mod.linked_experiment_number}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No matching modules found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or status filter.
          </p>
        </div>
      )}

      {/* SIMPLE, NORMAL PDF VIEWER MODAL (NO BOOK-STYLE DESIGN) */}
      {activePdfModule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
            {/* Viewer Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="p-2 bg-rose-600/30 rounded-lg text-rose-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">
                    Module {activePdfModule.module_number}: {activePdfModule.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5 truncate">
                    <span className="font-mono text-rose-200">
                      {getModulePdfName(activePdfModule)}
                    </span>
                    <span>•</span>
                    <span>Official Module Notes</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenPdfInNewTab(activePdfModule)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  title="Open PDF in new window tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(activePdfModule)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePdfModule(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
                  aria-label="Close PDF viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simple, Normal PDF Viewer Body */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full h-full flex flex-col bg-slate-900">
                <iframe
                  src={getModulePdfUrl(activePdfModule)}
                  title={`Module ${activePdfModule.module_number} PDF - ${activePdfModule.title}`}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>

            {/* Viewer Footer Bar */}
            <div className="px-5 py-2.5 bg-white border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Course:</span>
                <span>Department of Data Science — Mohan Babu University</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const done = !activePdfModule.is_completed;
                    onToggleComplete(activePdfModule.id, done);
                    setActivePdfModule({ ...activePdfModule, is_completed: done, progress_percent: done ? 100 : 50 });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    activePdfModule.is_completed
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{activePdfModule.is_completed ? 'Completed' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
