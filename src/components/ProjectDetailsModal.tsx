import React from 'react';
import { LabProject, ProjectStatus } from '../types';
import {
  X,
  Github,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  FlaskConical,
  Upload,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: LabProject | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (projectId: string, status: ProjectStatus) => void;
  onUploadDeliverableClick: (project: LabProject) => void;
  onNavigateToModule?: (moduleId: string) => void;
  onNavigateToLab?: (expNumber: number) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onStatusChange,
  onUploadDeliverableClick,
  onNavigateToModule,
  onNavigateToLab,
}) => {
  if (!isOpen || !project) return null;

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
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                project.category === 'Beginner'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : project.category === 'Intermediate'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {project.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status & External Links Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Project Status:</span>
              <select
                value={project.status}
                onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
              <button
                onClick={() => onUploadDeliverableClick(project)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Submit Deliverable</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Description &amp; Scope
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Connected Modules & Labs */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Curriculum Cross-References &amp; Prerequisites</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {project.related_module_title && (
                <button
                  onClick={() => {
                    if (onNavigateToModule && project.related_module_id) {
                      onClose();
                      onNavigateToModule(project.related_module_id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-900 hover:bg-blue-100 transition-colors shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                  <span>{project.related_module_title}</span>
                </button>
              )}

              {project.related_experiment_numbers?.map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (onNavigateToLab) {
                      onClose();
                      onNavigateToLab(num);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-900 hover:bg-blue-100 transition-colors shadow-2xs"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-blue-700" />
                  <span>Linked Lab Exp #{num}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Key Learning Objectives
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
              {project.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Implementation Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Step-by-Step Implementation Guide
            </h4>
            <div className="space-y-2.5">
              {project.implementation_steps.map((step) => (
                <div
                  key={step.step_number}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {step.step_number}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      {step.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Technologies &amp; Libraries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Submitted Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Submitted Deliverables ({project.deliverables.length})</span>
              </h4>
              <div className="space-y-2">
                {project.deliverables.map((deliv) => (
                  <div
                    key={deliv.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-semibold text-slate-900 block truncate">
                        {deliv.file_name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Submitted: {new Date(deliv.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Uploaded to DB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
