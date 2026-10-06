import React from 'react';
import { ExecutionOutput } from '../types';
import { X, ExternalLink, Download, FileText, Calendar, HardDrive } from 'lucide-react';

interface PDFViewerModalProps {
  output: ExecutionOutput | null;
  experimentTitle: string;
  experimentNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onReplaceRequested?: (experimentId: string) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  output,
  experimentTitle,
  experimentNumber,
  isOpen,
  onClose,
  onReplaceRequested,
}) => {
  if (!isOpen || !output) return null;

  const isPdf = output.file_type === 'application/pdf' || output.file_name.toLowerCase().endsWith('.pdf');
  const isImage = output.file_type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(output.file_name);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = output.file_url || output.file_data || '';
    link.download = output.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    const targetUrl = output.file_url || output.file_data || '';
    // Open in separate window/tab safely
    const win = window.open('', '_blank');
    if (win) {
      if (isPdf) {
        win.document.write(
          `<html><head><title>${output.file_name}</title><style>body{margin:0;height:100vh;background:#1e293b;}</style></head><body><embed width="100%" height="100%" src="${targetUrl}" type="application/pdf"></embed></body></html>`
        );
      } else {
        win.document.write(
          `<html><head><title>${output.file_name}</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#0f172a;}img{max-width:95%;max-height:95%;box-shadow:0 10px 25px rgba(0,0,0,0.5);border-radius:8px;}</style></head><body><img src="${targetUrl}" alt="${output.file_name}" /></body></html>`
        );
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 bg-blue-600/30 rounded-lg text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="modal-title" className="text-base sm:text-lg font-bold text-white truncate">
                Experiment {experimentNumber}: {experimentTitle}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5 truncate">
                <span className="font-mono text-blue-200">{output.file_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  {formatFileSize(output.file_size)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {new Date(output.uploaded_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenNewTab}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Tab</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
              title="Download execution output file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {onReplaceRequested && (
              <button
                onClick={() => {
                  onClose();
                  onReplaceRequested(output.experiment_id);
                }}
                className="hidden md:inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-medium transition-colors"
              >
                Replace
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center">
          {isPdf ? (
            <div className="w-full h-full flex flex-col">
              <iframe
                src={output.file_url || output.file_data}
                title={`Execution Output PDF - ${output.file_name}`}
                className="w-full h-full border-0"
              />
            </div>
          ) : isImage ? (
            <div className="w-full h-full overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950">
              <img
                src={output.file_url || output.file_data}
                alt={output.file_name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-800"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200 max-w-md">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{output.file_name}</h3>
              <p className="text-sm text-slate-500 mb-4">
                This document type cannot be rendered inline in the browser preview.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Notes */}
        {output.notes && (
          <div className="px-5 py-2.5 bg-white border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold text-slate-700 mr-2">Execution Notes:</span>
            <span className="truncate flex-1 italic text-slate-600">{output.notes}</span>
            <span className="ml-4 text-emerald-800 font-medium shrink-0 bg-emerald-50 px-2 py-0.5 rounded">
              Verified by Faculty: Bosubabu Sir
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
