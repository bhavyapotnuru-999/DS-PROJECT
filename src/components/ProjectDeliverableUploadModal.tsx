import React, { useState, useRef } from 'react';
import { LabProject, ProjectDeliverable } from '../types';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProjectDeliverableUploadModalProps {
  project: LabProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deliverable: ProjectDeliverable) => void;
  userId: string;
}

export const ProjectDeliverableUploadModal: React.FC<ProjectDeliverableUploadModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !project) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a project report, archive, or code file.');
      return;
    }

    setIsSubmitting(true);
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      const deliverable: ProjectDeliverable = {
        id: `deliv-${Date.now()}`,
        project_id: project.id,
        user_id: userId,
        file_name: selectedFile.name,
        file_type: selectedFile.type || 'application/octet-stream',
        file_size: selectedFile.size,
        file_data: fileData,
        uploaded_at: new Date().toISOString(),
      };

      onSuccess(deliverable);
      handleClose();
    };

    if (selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.zip') || selectedFile.name.endsWith('.png') || selectedFile.name.endsWith('.jpg')) {
      reader.readAsDataURL(selectedFile);
    } else {
      reader.readAsText(selectedFile);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setNotes('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Upload Project Deliverable</h2>
            <p className="text-xs text-slate-300 mt-0.5 truncate max-w-xs sm:max-w-md">
              {project.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deliverable Remarks (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Final Phase Report, Pipeline Architecture Diagram"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-6 rounded-xl text-center cursor-pointer bg-slate-50/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.zip,.py,.ipynb,.docx,.png,.jpg,.jpeg,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="space-y-1">
                <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-xs font-bold text-slate-900 truncate">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready to submit
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">
                  Click to select deliverable file
                </div>
                <div className="text-[11px] text-slate-500">
                  PDF reports, ZIP source code, Jupyter notebooks (Max: 25MB)
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit Deliverable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
