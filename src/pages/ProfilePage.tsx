import React, { useState } from 'react';
import { UserProfile, Experiment } from '../types';
import { EditProfileModal } from '../components/EditProfileModal';
import {
  User,
  ExternalLink,
  Edit3,
  Award,
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  profile: UserProfile;
  experiments: Experiment[];
  onProfileUpdated: (updated: UserProfile) => void;
  onNavigateToExecutions?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  experiments,
  onProfileUpdated,
  onNavigateToExecutions,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const completedCount = experiments.filter((e) => e.status === 'Completed').length;
  const inProgressCount = experiments.filter((e) => e.status === 'In Progress').length;
  const notStartedCount = experiments.filter((e) => e.status === 'Not Started').length;
  const totalCount = experiments.length || 10;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Cover Graphic Header */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 relative px-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold bg-white/10 backdrop-blur-md text-white/90 px-3 py-1 rounded-full border border-white/20">
              Mohan Babu University • B.Tech DS
            </span>
          </div>
        </div>

        {/* Profile Card Main Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-blue-900 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-slate-100">
                  {profile.profile_photo ? (
                    <img
                      src={profile.profile_photo}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {profile.name
                        ? profile.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                        : 'BP'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="bg-blue-100 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-bold font-mono">
                    {profile.roll_no}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {profile.branch} • {profile.year} • Section {profile.section}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.university}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors self-center sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Academic Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Student Name</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{profile.name}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Roll Number</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 truncate">{profile.roll_no}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Section & Year</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">Section {profile.section} • {profile.year}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Branch & Program</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{profile.branch}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Assistant Professor</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{profile.assistant_professor}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-slate-200 text-slate-700 rounded-lg shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">University</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{profile.university}</div>
              </div>
            </div>
          </div>

          {/* Social Profiles & Professional Links */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1">Professional Profiles:</span>

            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0077b5] hover:bg-[#006097] text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* LAB PROGRESS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lab Progress</h2>
            <p className="text-xs text-slate-500">
              Dynamically calculated from real laboratory experiment submission statuses
            </p>
          </div>
          <div className="text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Completed: {completedCount} / {totalCount} Experiments
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Overall Completion Rate:</span>
            <span className="font-mono text-emerald-800">{completedCount} / {totalCount} Completed ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-base font-bold text-emerald-900">{completedCount}</div>
            <div className="text-[11px] text-emerald-700 font-medium">Completed</div>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
            <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="text-base font-bold text-amber-900">{inProgressCount}</div>
            <div className="text-[11px] text-amber-700 font-medium">In Progress</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
            <AlertCircle className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <div className="text-base font-bold text-slate-700">{notStartedCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Not Started</div>
          </div>
        </div>

        {onNavigateToExecutions && (
          <div className="pt-2 text-right">
            <button
              onClick={onNavigateToExecutions}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              View detailed experiment submissions →
            </button>
          </div>
        )}
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Technical Skills</h2>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            Edit Skills
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-800 hover:text-blue-900 rounded-lg text-xs font-semibold transition-colors"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500">No skills specified yet.</p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <EditProfileModal
          profile={profile}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={onProfileUpdated}
        />
      )}
    </div>
  );
};
