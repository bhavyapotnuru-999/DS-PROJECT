import React from 'react';
import { Experiment, ExecutionOutput, ExperimentStatus } from '../types';
import {
  FileText,
  Upload,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  HardDrive,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface ExperimentCardProps {
  experiment: Experiment;
  output: ExecutionOutput | null;
  onUploadClick: (experiment: Experiment) => void;
  onViewClick: (experiment: Experiment, output: ExecutionOutput) => void;
  onReplaceClick: (experiment: Experiment, output: ExecutionOutput) => void;
  onStatusChange: (experimentId: string, status: ExperimentStatus) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  output,
  onUploadClick,
  onViewClick,
  onReplaceClick,
  onStatusChange,
}) => {
  const isCompleted = experiment.status === 'Completed';
  const isInProgress = experiment.status === 'In Progress';

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isPdf =
    output &&
    (output.file_type === 'application/pdf' ||
      output.file_name.toLowerCase().endsWith('.pdf'));

  const isImage =
    output &&
    (output.file_type.startsWith('image/') ||
      /\.(png|jpe?g|webp|svg)$/i.test(output.file_name));

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          {/* Badge & Number */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-bold font-mono tracking-tight">
              EXP {experiment.experiment_number.toString().padStart(2, '0')}
            </span>

            {/* Status Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isInProgress
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              ) : isInProgress ? (
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{experiment.status}</span>
            </span>
          </div>

          {/* Quick Status Dropdown for Academic Flexibility */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="text-[11px] text-slate-600">Status:</span>
            <select
              value={experiment.status}
              onChange={(e) =>
                onStatusChange(experiment.id, e.target.value as ExperimentStatus)
              }
              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Experiment Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {experiment.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          {experiment.description}
        </p>
      </div>

      {/* Output Section */}
      <div className="p-5 sm:p-6 pt-4 flex-1 flex flex-col justify-between space-y-4">
        {output ? (
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {isPdf ? (
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Execution Output
                  </div>
                  <div className="font-mono text-xs font-semibold text-slate-800 truncate" title={output.file_name}>
                    {output.file_name}
                  </div>
                </div>
              </div>

              {/* Action buttons on file card */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onViewClick(experiment, output)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition-colors"
                  title="View full output"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onReplaceClick(experiment, output)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                  title="Replace with new output"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
              </div>
            </div>

            {/* Embedded Inline Preview */}
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
              {isImage ? (
                <div
                  onClick={() => onViewClick(experiment, output)}
                  className="relative group cursor-pointer max-h-48 overflow-hidden flex items-center justify-center bg-slate-900"
                >
                  <img
                    src={output.file_url || output.file_data}
                    alt={output.file_name}
                    className="max-h-48 w-auto object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Click to enlarge preview</span>
                  </div>
                </div>
              ) : isPdf ? (
                <div className="relative group p-3 bg-gradient-to-r from-red-50/50 to-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-red-600 text-white flex flex-col items-center justify-center shadow-xs">
                      <span className="text-[10px] font-bold tracking-wider">PDF</span>
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        Browser PDF Document
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formatFileSize(output.file_size)} • Ready for professor review
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewClick(experiment, output)}
                    className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
                  >
                    <span>Open Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="p-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>Standard Document Format</span>
                  <button
                    onClick={() => onViewClick(experiment, output)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>

            {/* Output Meta: Upload Date & Size */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Uploaded: {new Date(output.uploaded_at).toLocaleDateString()} {new Date(output.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <HardDrive className="w-3 h-3 text-slate-400" />
                {formatFileSize(output.file_size)}
              </span>
            </div>
          </div>
        ) : (
          /* Empty State - Prompting PDF Upload */
          <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">No Execution Output Uploaded</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Upload lab execution PDF, graphs, or output logs to complete this experiment.
              </p>
            </div>
            <button
              onClick={() => onUploadClick(experiment)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF / Output</span>
            </button>
          </div>
        )}

        {/* Footer Buttons Bar */}
        {output && (
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={() => onViewClick(experiment, output)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Output</span>
            </button>
            <button
              onClick={() => onReplaceClick(experiment, output)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
