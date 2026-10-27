import React from 'react';
import { LearningResource } from '../types';
import { X, Download, ExternalLink, FileText, Database, HardDrive, Calendar, Tag } from 'lucide-react';

interface ResourcePreviewModalProps {
  resource: LearningResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  resource,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !resource) return null;

  const isCsv =
    resource.file_type === 'text/csv' ||
    (resource.file_data && resource.file_data.startsWith('data:text/csv'));

  const isPdf =
    resource.file_type === 'application/pdf' ||
    (resource.file_data && resource.file_data.startsWith('data:application/pdf'));

  const handleDownload = () => {
    if (resource.external_url) {
      window.open(resource.external_url, '_blank');
      return;
    }

    const fileContent = resource.file_data || resource.file_url;
    if (!fileContent) return;

    const link = document.createElement('a');
    link.href = fileContent;
    link.download = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + (isCsv ? '.csv' : isPdf ? '.pdf' : '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV if it's a dataset
  let csvRows: string[][] = [];
  if (isCsv && resource.file_data) {
    try {
      const decoded = decodeURIComponent(resource.file_data.replace('data:text/csv;charset=utf-8,', ''));
      csvRows = decoded
        .split('\n')
        .map((r) => r.split(','))
        .filter((r) => r.length > 1);
    } catch (_) {
      // fallback
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 bg-blue-600/30 text-blue-300 rounded-lg shrink-0">
              {isCsv ? <Database className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {resource.category}
                </span>
                <span className="text-xs text-slate-400">• {resource.subject}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {resource.external_url ? (
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open URL</span>
              </a>
            ) : (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {resource.description || 'No additional description provided.'}
            </p>
          </div>

          {/* Meta Information Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Added: {new Date(resource.uploaded_at).toLocaleDateString()}</span>
            </div>
            {resource.file_size && (
              <div className="flex items-center gap-1.5 font-mono">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>{(resource.file_size / 1024).toFixed(1)} KB</span>
              </div>
            )}
            <div>
              <span>Curated by: <strong>{resource.uploaded_by}</strong></span>
            </div>
          </div>

          {/* CSV Table Preview */}
          {isCsv && csvRows.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Dataset Preview ({csvRows.length - 1} rows displayed)</span>
                <span className="text-[11px] text-slate-500">Comma-separated tabular benchmark</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-200 font-bold">
                    <tr>
                      {csvRows[0].map((head, hIdx) => (
                        <th key={hIdx} className="px-3.5 py-2 whitespace-nowrap">
                          {head.trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvRows.slice(1, 15).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 font-mono text-[11px] text-slate-700">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-1.5 whitespace-nowrap">
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : isPdf && resource.file_data ? (
            <div className="h-96 rounded-xl overflow-hidden border border-slate-200">
              <iframe
                src={resource.file_data}
                title={resource.title}
                className="w-full h-full border-0"
              />
            </div>
          ) : resource.external_url ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
              <ExternalLink className="w-10 h-10 text-blue-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">External Documentation Resource</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto truncate">
                  {resource.external_url}
                </p>
              </div>
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                <span>Launch in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-5 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {resource.file_data ? decodeURIComponent(resource.file_data.replace('data:text/plain;charset=utf-8,', '')) : 'File available for download.'}
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {resource.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
