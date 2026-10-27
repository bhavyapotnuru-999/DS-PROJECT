import React, { useState } from 'react';
import { Experiment, ExecutionOutput, ExperimentStatus } from '../types';
import { ExperimentCard } from '../components/ExperimentCard';
import { FileUploadModal } from '../components/FileUploadModal';
import { PDFViewerModal } from '../components/PDFViewerModal';
import { Search, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface LabExecutionsPageProps {
  experiments: Experiment[];
  outputs: ExecutionOutput[];
  onOutputSaved: (output: ExecutionOutput, message: string) => void;
  onStatusChange: (experimentId: string, status: ExperimentStatus) => void;
  onNavigateToModule?: (moduleId: string) => void;
  userId: string;
}

export const LabExecutionsPage: React.FC<LabExecutionsPageProps> = ({
  experiments,
  outputs,
  onOutputSaved,
  onStatusChange,
  onNavigateToModule,
  userId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ExperimentStatus>('All');

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeExpForUpload, setActiveExpForUpload] = useState<Experiment | null>(null);

  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [activeOutputForViewer, setActiveOutputForViewer] = useState<ExecutionOutput | null>(null);
  const [activeExpForViewer, setActiveExpForViewer] = useState<Experiment | null>(null);

  const completedCount = experiments.filter((e) => e.status === 'Completed').length;
  const inProgressCount = experiments.filter((e) => e.status === 'In Progress').length;
  const notStartedCount = experiments.filter((e) => e.status === 'Not Started').length;

  const handleUploadClick = (exp: Experiment) => {
    setActiveExpForUpload(exp);
    setUploadModalOpen(true);
  };

  const handleViewClick = (exp: Experiment, output: ExecutionOutput) => {
    setActiveExpForViewer(exp);
    setActiveOutputForViewer(output);
    setViewerModalOpen(true);
  };

  const handleReplaceClick = (exp: Experiment, _output: ExecutionOutput) => {
    setActiveExpForUpload(exp);
    setUploadModalOpen(true);
  };

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `experiment ${exp.experiment_number}`.includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || exp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lab Executions
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Data Science Digital Laboratory • Exactly 10 experiments with verified execution outputs, test cases, and linked modules
            </p>
          </div>

          {/* Quick Summary Pill Counters */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedCount} Completed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{inProgressCount} In Progress</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{notStartedCount} Pending</span>
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments by title, topic, or number..."
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
            {(['All', 'Completed', 'In Progress', 'Not Started'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiments Grid (10 Experiments) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperiments.map((exp) => {
          const output = outputs.find((o) => o.experiment_id === exp.id) || null;
          return (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              output={output}
              onUploadClick={handleUploadClick}
              onViewClick={handleViewClick}
              onReplaceClick={handleReplaceClick}
              onStatusChange={onStatusChange}
              onNavigateToModule={onNavigateToModule}
            />
          );
        })}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-700">No matching experiments found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('All');
            }}
            className="mt-3 text-xs text-blue-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Upload/Replace Modal */}
      {uploadModalOpen && activeExpForUpload && (
        <FileUploadModal
          experiment={activeExpForUpload}
          existingOutput={outputs.find((o) => o.experiment_id === activeExpForUpload.id) || null}
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={onOutputSaved}
          userId={userId}
        />
      )}

      {/* PDF and Image Preview Modal */}
      {viewerModalOpen && activeExpForViewer && activeOutputForViewer && (
        <PDFViewerModal
          output={activeOutputForViewer}
          experimentTitle={activeExpForViewer.title}
          experimentNumber={activeExpForViewer.experiment_number}
          isOpen={viewerModalOpen}
          onClose={() => setViewerModalOpen(false)}
          onReplaceRequested={(expId) => {
            const exp = experiments.find((e) => e.id === expId);
            if (exp) {
              handleReplaceClick(exp, activeOutputForViewer);
            }
          }}
        />
      )}
    </div>
  );
};
