import React, { useState } from 'react';
import { LabProject, ProjectCategory, ProjectStatus, ProjectDeliverable } from '../types';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';
import { ProjectDeliverableUploadModal } from '../components/ProjectDeliverableUploadModal';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Github,
  ExternalLink,
  Upload,
  ArrowRight,
  BookOpen,
  FlaskConical,
} from 'lucide-react';

interface ProjectsPageProps {
  projects: LabProject[];
  onStatusChange: (projectId: string, status: ProjectStatus) => void;
  onUploadDeliverable: (deliverable: ProjectDeliverable) => void;
  onNavigateToModule?: (moduleId: string) => void;
  onNavigateToLab?: (expNumber: number) => void;
  userId: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onStatusChange,
  onUploadDeliverable,
  onNavigateToModule,
  onNavigateToLab,
  userId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ProjectStatus>('All');
  const [activeProjectForDetails, setActiveProjectForDetails] = useState<LabProject | null>(null);
  const [activeProjectForUpload, setActiveProjectForUpload] = useState<LabProject | null>(null);

  // Dynamic categories list from loaded projects
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const allCategories = ['All', ...uniqueCategories];

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory =
      selectedCategory === 'All' || proj.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || proj.status === selectedStatus;

    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;

  const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('weather') || cat.includes('web development')) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    if (cat.includes('agriculture') || cat.includes('green') || cat.includes('beginner')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (cat.includes('artificial intelligence') || cat.includes('ai') || cat.includes('advanced')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    if (cat.includes('frontend') || cat.includes('intermediate')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-700" />
              <span>Capstone &amp; Course Projects</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Data Science Lab Projects
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Applied project portfolios featuring real-world web applications, sustainable technology, frontend development, and artificial intelligence architectures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedCount} Completed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{inProgressCount} In Progress</span>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, category, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-xl pb-1 sm:pb-0">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={cat}
                >
                  {cat === 'All' ? 'All Categories' : cat.split('/')[0].trim()}
                </button>
              ))}
            </div>

            {/* Status dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const isDone = proj.status === 'Completed';
          const isInProgress = proj.status === 'In Progress';

          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header: Level & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border truncate max-w-[200px] ${getCategoryStyle(
                      proj.category
                    )}`}
                    title={proj.category}
                  >
                    {proj.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-900'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    ) : isInProgress ? (
                      <Clock className="w-3 h-3 text-amber-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{proj.status}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                  {proj.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {proj.description}
                </p>

                {/* Cross references */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {proj.related_module_title && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60 truncate max-w-full">
                      <BookOpen className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="truncate">{proj.related_module_title.split(':')[0]}</span>
                    </span>
                  )}
                  {proj.related_experiment_numbers && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <FlaskConical className="w-3 h-3 text-slate-500" />
                      <span>Labs: #{proj.related_experiment_numbers.join(', #')}</span>
                    </span>
                  )}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1">
                  {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions — Only display GitHub and Live Demo when real links exist */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.live_demo_url && (
                    <a
                      href={proj.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-blue-700 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveProjectForUpload(proj)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title="Upload Project Deliverable"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </div>

                <button
                  onClick={() => setActiveProjectForDetails(proj)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No projects found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your category or status filters.
          </p>
        </div>
      )}

      {/* Project Details Modal */}
      {activeProjectForDetails && (
        <ProjectDetailsModal
          project={activeProjectForDetails}
          isOpen={!!activeProjectForDetails}
          onClose={() => setActiveProjectForDetails(null)}
          onStatusChange={(projId, stat) => {
            onStatusChange(projId, stat);
            if (activeProjectForDetails.id === projId) {
              setActiveProjectForDetails({ ...activeProjectForDetails, status: stat });
            }
          }}
          onUploadDeliverableClick={(proj) => {
            setActiveProjectForDetails(null);
            setActiveProjectForUpload(proj);
          }}
          onNavigateToModule={onNavigateToModule}
          onNavigateToLab={onNavigateToLab}
        />
      )}

      {/* Deliverable Submission Modal */}
      {activeProjectForUpload && (
        <ProjectDeliverableUploadModal
          project={activeProjectForUpload}
          isOpen={!!activeProjectForUpload}
          onClose={() => setActiveProjectForUpload(null)}
          onSuccess={(deliv: ProjectDeliverable) => {
            onUploadDeliverable(deliv);
            if (activeProjectForUpload.id === deliv.project_id) {
              setActiveProjectForUpload({
                ...activeProjectForUpload,
                deliverables: [...(activeProjectForUpload.deliverables || []), deliv],
              });
            }
          }}
          userId={userId}
        />
      )}
    </div>
  );
};
