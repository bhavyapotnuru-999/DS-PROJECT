import React, { useState, useRef } from 'react';
import { LearningResource, ResourceCategory } from '../types';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resource: LearningResource) => void;
  userId: string;
  userName: string;
}

const CATEGORIES: ResourceCategory[] = [
  'Cheat Sheet',
  'Dataset',
  'Lecture Notes',
  'Documentation',
  'Video Tutorial',
  'Code Template',
];

export const ResourceUploadModal: React.FC<ResourceUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userName,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Cheat Sheet');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB maximum limit.');
      return;
    }
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Resource title is required.');
      return;
    }

    if (!subject.trim()) {
      setError('Subject or field is required.');
      return;
    }

    if (uploadType === 'link' && !externalUrl.trim()) {
      setError('Please provide a valid external URL or link.');
      return;
    }

    if (uploadType === 'file' && !selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setIsSubmitting(true);

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (uploadType === 'link') {
      const newRes: LearningResource = {
        id: `res-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        subject: subject.trim(),
        external_url: externalUrl.trim(),
        uploaded_by: `${userName} (Student)`,
        uploaded_at: new Date().toISOString(),
        tags: tagList.length > 0 ? tagList : [category, subject],
        download_count: 0,
      };
      onSuccess(newRes);
      handleClose();
      return;
    }

    // Handle File Upload
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      const newRes: LearningResource = {
        id: `res-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        subject: subject.trim(),
        file_name: selectedFile?.name,
        file_type: selectedFile?.type || 'application/octet-stream',
        file_size: selectedFile?.size || 0,
        file_data: fileData,
        uploaded_by: `${userName} (Student)`,
        uploaded_at: new Date().toISOString(),
        tags: tagList.length > 0 ? tagList : [category, subject],
        download_count: 0,
      } as LearningResource;

      onSuccess(newRes);
      handleClose();
    };

    if (selectedFile?.name.endsWith('.csv') || selectedFile?.name.endsWith('.txt')) {
      reader.readAsText(selectedFile);
    } else if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('Cheat Sheet');
    setSubject('');
    setTags('');
    setExternalUrl('');
    setSelectedFile(null);
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
            <h2 className="text-base sm:text-lg font-bold">Add Learning Resource</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Upload study materials, cheat sheets, CSV datasets, or documentation links
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle: File or External Link */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                uploadType === 'file'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document/Dataset</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadType('link')}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                uploadType === 'link'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>External Link / Docs</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scikit-learn Supervised Classification Guide"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject / Topic *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Machine Learning, Pandas"
                required
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Learning Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what students will learn from this resource..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Python, CSV, Classification, Cheatsheet"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {uploadType === 'link' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                External Resource URL *
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://scikit-learn.org/ or YouTube video link"
                required
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-5 rounded-xl text-center cursor-pointer bg-slate-50/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.csv,.txt,.docx,.png,.jpg,.jpeg,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-1">
                  <FileText className="w-7 h-7 text-blue-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready to save in database
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">Select file to attach</div>
                  <div className="text-[11px] text-slate-500">
                    Supports PDF, CSV, TXT, DOCX, JSON (Max: 25MB)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
