import React, { useState } from 'react';
import { LearningResource, ResourceCategory } from '../types';
import { ResourceUploadModal } from '../components/ResourceUploadModal';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';
import {
  FolderOpen,
  Search,
  Filter,
  Download,
  ExternalLink,
  Plus,
  FileText,
  Database,
  Video,
  Code2,
  BookMarked,
  Tag,
  Eye,
} from 'lucide-react';

interface ResourcesPageProps {
  resources: LearningResource[];
  onUploadResource: (resource: LearningResource) => void;
  userId: string;
  userName: string;
}

const CATEGORY_TABS: ('All' | ResourceCategory)[] = [
  'All',
  'Cheat Sheet',
  'Dataset',
  'Lecture Notes',
  'Documentation',
  'Video Tutorial',
  'Code Template',
];

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  resources,
  onUploadResource,
  userId,
  userName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ResourceCategory>('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null);

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === 'All' || res.category === selectedCategory;

    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'Dataset':
        return <Database className="w-5 h-5 text-emerald-600" />;
      case 'Video Tutorial':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'Code Template':
        return <Code2 className="w-5 h-5 text-indigo-600" />;
      case 'Documentation':
        return <ExternalLink className="w-5 h-5 text-sky-600" />;
      case 'Lecture Notes':
        return <BookMarked className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold mb-2">
              <FolderOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Academic Resource Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning Resources Library
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Curated cheat sheets, tabular benchmark datasets, lecture notes, official documentation, and code templates for Data Science.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, tag (e.g. NumPy, Dataset, PCA, Classification)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Top: Icon & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                    {getCategoryIcon(res.category)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {res.category}
                  </span>
                </div>

                {/* Title & Subject */}
                <div>
                  <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                    {res.subject}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 mt-0.5">
                    {res.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {res.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      {tag}
                    </span>
                  ))}
                  {res.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{res.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate">
                  By {res.uploaded_by.split(' ')[0]}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {res.external_url ? (
                    <a
                      href={res.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setPreviewResource(res)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Get</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No resources found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or upload a new resource.
          </p>
        </div>
      )}

      {/* Upload Resource Modal */}
      {uploadModalOpen && (
        <ResourceUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={onUploadResource}
          userId={userId}
          userName={userName}
        />
      )}

      {/* Preview Resource Modal */}
      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource}
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
};
