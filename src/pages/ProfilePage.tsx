import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Experiment } from '../types';
import { dbService } from '../services/db';
import {
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Mail,
  School,
  ExternalLink,
  FlaskConical,
  Camera,
  Check,
  X,
  Plus,
  UploadCloud,
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
  const [isEditingInline, setIsEditingInline] = useState(false);

  // Inline form state
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData when profile changes
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const completedCount = experiments.filter((e) => e.status === 'Completed').length;
  const inProgressCount = experiments.filter((e) => e.status === 'In Progress').length;
  const notStartedCount = experiments.filter((e) => e.status === 'Not Started').length;
  const totalCount = experiments.length || 10;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Directly handle photo updates from ID card or file input
  const handlePhotoUpdated = async (newPhotoUrl: string) => {
    try {
      const updated: UserProfile = {
        ...profile,
        profile_photo: newPhotoUrl,
      };
      await dbService.saveUserProfile(updated);
      onProfileUpdated(updated);
    } catch (err) {
      console.error('Failed to update student photo:', err);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setInlineError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setInlineError('Profile photo must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, profile_photo: dataUrl }));
      setInlineError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (formData.skills.includes(newSkillInput.trim())) {
      setNewSkillInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()],
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveInline = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.roll_no.trim()) {
      setInlineError('Name and Roll No are required fields.');
      return;
    }

    try {
      setIsSaving(true);
      setInlineError(null);
      const saved = await dbService.saveUserProfile(formData);
      onProfileUpdated(saved);
      setIsEditingInline(false);
    } catch (err) {
      console.error('Failed to save profile changes:', err);
      setInlineError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelInline = () => {
    setFormData({ ...profile });
    setInlineError(null);
    setIsEditingInline(false);
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-5xl mx-auto">
      {/* ================= PROFESSIONAL STUDENT PROFILE PAGE / CARD ================= */}
      <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Professional Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Header Banner */}
            <div className="h-32 sm:h-36 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 relative px-6 flex items-end">
              <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-amber-300" />
                  <span>{profile.university || 'Mohan Babu University'}</span>
                </span>
                <span className="text-[11px] font-semibold bg-blue-500/20 backdrop-blur-md text-blue-200 px-3 py-1 rounded-full border border-blue-400/30">
                  Department of Data Science
                </span>
                {isEditingInline && (
                  <span className="text-[11px] font-bold bg-amber-500 text-slate-950 px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editing Mode Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 sm:p-8 pt-0 relative">
              {inlineError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inlineError}</span>
                </div>
              )}

              {/* VIEW MODE vs EDITING MODE */}
              {!isEditingInline ? (
                /* ================= VIEW MODE ================= */
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-12 sm:-mt-14 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                      {/* 1. Profile Photo */}
                      <div className="relative shrink-0 group">
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 flex items-center justify-center text-white text-3xl font-extrabold ring-2 ring-slate-200">
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

                      {/* 2. Name, Roll No, Section, Branch, Assistant Professor */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {profile.name}
                          </h1>
                          <span className="bg-blue-100 text-blue-900 text-xs px-3 py-1 rounded-full font-black font-mono tracking-wider border border-blue-200">
                            {profile.roll_no}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 justify-center sm:justify-start">
                          <span>{profile.branch}</span>
                          <span>•</span>
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                            Section {profile.section}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600">{profile.year}</span>
                        </div>

                        <div className="text-xs text-slate-600">
                          <span>Assistant Professor (Faculty Guide): </span>
                          <strong className="text-slate-900 font-bold">{profile.assistant_professor}</strong>
                        </div>

                        <div className="text-xs text-slate-500">
                          <span>University: </span>
                          <span className="font-semibold text-slate-700">{profile.university}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Social & Professional Profiles: GitHub & LinkedIn */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
                      Profiles:
                    </span>

                    {profile.github ? (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No GitHub link provided</span>
                    )}

                    {profile.linkedin ? (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0077b5] hover:bg-[#006097] text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No LinkedIn link provided</span>
                    )}

                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                        <span>{profile.email}</span>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                /* ================= INLINE EDITING MODE ================= */
                <form onSubmit={handleSaveInline} className="space-y-6 pt-4">
                  {/* Photo Edit & Preview */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 sm:-mt-20 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                        {formData.profile_photo ? (
                          <img
                            src={formData.profile_photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {formData.name
                              ? formData.name.split(' ').map((n) => n[0]).join('').substring(0, 2)
                              : 'BP'}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors"
                        title="Upload photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="text-sm font-bold text-slate-900">
                        Student Profile Photo
                      </div>
                      <div className="text-xs text-slate-500">
                        Upload your personal portrait image (PNG, JPG, or WEBP under 5MB).
                      </div>
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Choose Photo File</span>
                        </button>
                        {formData.profile_photo && (
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, profile_photo: '' }))}
                            className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Grid for Name, Roll No, Section, Branch, Year, University, Assistant Professor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. Bhavya Potnuru"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        value={formData.roll_no}
                        onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. 24102A030098"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Section
                      </label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. 2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Branch / Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. B.Tech – Data Science"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. 3rd Year"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. Mohan Babu University"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Assistant Professor (Faculty Guide)
                      </label>
                      <input
                        type="text"
                        value={formData.assistant_professor}
                        onChange={(e) =>
                          setFormData({ ...formData, assistant_professor: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="e.g. Bosubabu Sir"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="https://github.com/bhavyapotnuru-999"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                        placeholder="https://www.linkedin.com/in/bhavya-potnuru/"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* 4. Skills Section (Interactive in both view & edit modes) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Skills</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {(isEditingInline ? formData.skills : profile.skills)?.length || 0} skills listed
              </span>
            </div>

            {isEditingInline ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add a new skill (e.g. Python, SQL, Tableau, Pandas)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[52px]">
                  {formData.skills && formData.skills.length > 0 ? (
                    formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 text-slate-800 rounded-full text-xs font-semibold shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills added yet.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-800 hover:text-blue-900 rounded-xl text-xs font-semibold transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No skills added yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky or Bottom Action Bar in Editing Mode */}
          {isEditingInline && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready to update your student profile?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelInline}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveInline}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {isSaving ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 5. Lab Progress Section: completed / total experiments */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Lab Progress
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time synchronization with laboratory experiment deliverables
                </p>
              </div>

              <div className="text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full self-start sm:self-auto">
                Completed: {completedCount} / {totalCount} experiments
              </div>
            </div>

            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Progress: completed / total experiments</span>
                <span className="font-mono text-emerald-800 font-bold">
                  {completedCount} / {totalCount} ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-emerald-600 h-3.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Metric Status Badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-emerald-900">{completedCount}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Completed</div>
              </div>
              <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-center">
                <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-amber-900">{inProgressCount}</div>
                <div className="text-[11px] text-amber-700 font-semibold">In Progress</div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <AlertCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-extrabold text-slate-700">{notStartedCount}</div>
                <div className="text-[11px] text-slate-500 font-semibold">Not Started</div>
              </div>
            </div>

            {onNavigateToExecutions && (
              <div className="pt-2 text-right">
                <button
                  onClick={onNavigateToExecutions}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
                >
                  <span>Go to Lab Experiments</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};
