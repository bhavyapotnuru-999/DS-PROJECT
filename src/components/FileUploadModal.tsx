import React, { useState, useRef } from 'react';
import { Experiment, ExecutionOutput } from '../types';
import { dbService } from '../services/db';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadModalProps {
  experiment: Experiment | null;
  existingOutput: ExecutionOutput | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (output: ExecutionOutput, message: string) => void;
  userId: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  experiment,
  existingOutput,
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !experiment) return null;

  const isReplacing = !!existingOutput;

  const handleFileChange = (file: File) => {
    setError(null);

    // Validate type
    const isSupported =
      ALLOWED_TYPES.includes(file.type) ||
      /\.(pdf|png|jpe?g|webp)$/i.test(file.name);

    if (!isSupported) {
      setError('Please select a valid PDF file, PNG, or JPG/JPEG image.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum supported file size is 25MB.');
      return;
    }

    setSelectedFile(file);

    // Generate local preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !previewDataUrl) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const outputData: ExecutionOutput = {
        id: existingOutput ? existingOutput.id : `out-${Date.now()}`,
        experiment_id: experiment.id,
        user_id: userId,
        file_name: selectedFile.name,
        file_type: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        file_size: selectedFile.size,
        file_url: previewDataUrl,
        file_data: previewDataUrl,
        uploaded_at: new Date().toISOString(),
        notes: notes.trim() || (isReplacing ? 'Output updated.' : 'Lab execution verified with expected output.'),
      };

      // Save to IndexedDB and update experiment status to Completed
      const saved = await dbService.saveExecutionOutput(outputData);

      const successMsg = isReplacing
        ? `Output for Experiment ${experiment.experiment_number} replaced successfully.`
        : `PDF / Output for Experiment ${experiment.experiment_number} uploaded successfully.`;

      onSuccess(saved, successMsg);
      handleClose();
    } catch (err) {
      console.error('Failed to upload execution output:', err);
      setError('Upload error: Failed to save the file to database storage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewDataUrl(null);
    setNotes('');
    setError(null);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              {isReplacing ? 'Replace Execution Output' : 'Upload PDF / Output'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Experiment {experiment.experiment_number}: {experiment.title}
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
        <form onSubmit={handleUploadSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {isReplacing && existingOutput && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold">Current Output:</span>{' '}
                <span className="font-mono">{existingOutput.file_name}</span>
              </div>
              <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Will be overwritten
              </span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-100'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/40'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                {selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf') ? (
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <span className="font-semibold text-slate-800 text-sm break-all">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  {formatFileSize(selectedFile.size)} • Ready to upload
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to select or drag and drop file here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported: <strong>PDF (preferred)</strong>, PNG, JPG/JPEG (Max: 25MB)
                </p>
              </div>
            )}
          </div>

          {/* Optional execution notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Execution Remarks / Observations (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Model achieved 94.2% test accuracy; confusion matrix verified."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isSubmitting ? (
                <span>Saving to Database...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isReplacing ? 'Confirm & Replace' : 'Upload & Save'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
