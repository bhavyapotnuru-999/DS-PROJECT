import { useState, useEffect } from 'react';
import {
  ActiveTab,
  UserProfile,
  Experiment,
  ExecutionOutput,
  ExperimentTool,
  ExperimentStatus,
  TextbookModule,
  ModuleNoteUpload,
  LearningResource,
  LabProject,
  ProjectStatus,
  ProjectDeliverable,
} from './types';
import { dbService } from './services/db';
import { INITIAL_STUDENT_PROFILE } from './data/defaultData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ModulesPage } from './pages/ModulesPage';
import { LabExecutionsPage } from './pages/LabExecutionsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ToolsPage } from './pages/ToolsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Data State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_STUDENT_PROFILE);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [outputs, setOutputs] = useState<ExecutionOutput[]>([]);
  const [tools, setTools] = useState<ExperimentTool[]>([]);
  const [modules, setModules] = useState<TextbookModule[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [projects, setProjects] = useState<LabProject[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load initial data from Database (IndexedDB)
  useEffect(() => {
    async function initAndLoad() {
      try {
        setIsLoading(true);
        // Ensure default data is initialized
        await dbService.initDefaultData();

        // Load all entities
        const [
          loadedProfile,
          loadedExperiments,
          loadedOutputs,
          loadedTools,
          loadedModules,
          loadedResources,
          loadedProjects,
        ] = await Promise.all([
          dbService.getUserProfile(),
          dbService.getExperiments(),
          dbService.getExecutionOutputs(),
          dbService.getTools(),
          dbService.getModules(),
          dbService.getResources(),
          dbService.getProjects(),
        ]);

        setProfile({
          ...loadedProfile,
          profile_photo: INITIAL_STUDENT_PROFILE.profile_photo,
        });
        setExperiments(loadedExperiments);
        setOutputs(loadedOutputs);
        setTools(loadedTools);
        setModules(loadedModules);
        setResources(loadedResources);
        setProjects(loadedProjects);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        addToast('error', 'Database initialization warning: Using local cache.');
      } finally {
        setIsLoading(false);
      }
    }

    initAndLoad();
  }, []);

  // Handle Profile Update
  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
    addToast('success', 'Profile updated successfully.');
  };

  // Handle Output Upload/Replace
  const handleOutputSaved = async (savedOutput: ExecutionOutput, message: string) => {
    const [freshOutputs, freshExperiments] = await Promise.all([
      dbService.getExecutionOutputs(),
      dbService.getExperiments(),
    ]);
    setOutputs(freshOutputs);
    setExperiments(freshExperiments);
    addToast('success', message);
  };

  // Handle Status Manual Change
  const handleStatusChange = async (experimentId: string, status: ExperimentStatus) => {
    try {
      await dbService.updateExperimentStatus(experimentId, status);
      const freshExperiments = await dbService.getExperiments();
      setExperiments(freshExperiments);
      addToast('info', `Experiment status updated to ${status}.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to update experiment status.');
    }
  };

  // Handle Module Toggle Complete
  const handleToggleModuleComplete = async (moduleId: string, isCompleted: boolean) => {
    try {
      const updated = await dbService.toggleModuleCompletion(moduleId, isCompleted);
      setModules((prev) => prev.map((m) => (m.id === moduleId ? updated : m)));
      addToast('success', isCompleted ? 'Module marked as completed!' : 'Module marked as in progress.');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to update module completion.');
    }
  };

  // Handle Module Note Upload
  const handleUploadModuleNote = async (note: ModuleNoteUpload) => {
    try {
      await dbService.saveModuleNote(note);
      const freshModules = await dbService.getModules();
      setModules(freshModules);
      addToast('success', `Study notes "${note.file_name}" uploaded and saved.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to save module notes.');
    }
  };

  // Handle Resource Upload
  const handleUploadResource = async (resource: LearningResource) => {
    try {
      const saved = await dbService.saveResource(resource);
      setResources((prev) => [saved, ...prev]);
      addToast('success', `Resource "${saved.title}" added to library.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to save learning resource.');
    }
  };

  // Handle Project Status Change
  const handleProjectStatusChange = async (projectId: string, status: ProjectStatus) => {
    try {
      const updated = await dbService.updateProjectStatus(projectId, status);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      addToast('info', `Project status updated to ${status}.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to update project status.');
    }
  };

  // Handle Project Deliverable Upload
  const handleUploadProjectDeliverable = async (deliverable: ProjectDeliverable) => {
    try {
      await dbService.saveProjectDeliverable(deliverable);
      const freshProjects = await dbService.getProjects();
      setProjects(freshProjects);
      addToast('success', `Deliverable "${deliverable.file_name}" submitted successfully.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to submit project deliverable.');
    }
  };

  // Cross-Navigation Helpers
  const handleNavigateToLab = (_expNumber?: number) => {
    setActiveTab('executions');
  };

  const handleNavigateToModule = (_moduleId?: string) => {
    setActiveTab('modules');
  };

  const completedCount = experiments.filter((e) => e.status === 'Completed').length;
  const totalCount = experiments.length || 10;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-700">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          <div className="text-sm font-semibold tracking-wide">
            Loading MBU Data Science Digital Laboratory...
          </div>
          <div className="text-xs text-slate-600">
            Connecting to laboratory database, modules, resources, and experiments
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Official Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        completedCount={completedCount}
        totalCount={totalCount}
        profile={profile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Subtle Student Session Bar */}
        <div className="mt-3 py-1.5 px-3 bg-white/70 border border-slate-200/60 rounded-lg flex flex-wrap items-center justify-between text-xs text-slate-600 shadow-2xs gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Active Student: <strong className="text-slate-900">{profile.name}</strong> ({profile.roll_no}) •{' '}
              {profile.branch} • {profile.year}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              Faculty Guide: <strong className="text-slate-800">{profile.assistant_professor}</strong>
            </span>
          </div>
        </div>

        {/* Tab Router in requested order: 1. Modules, 2. Lab (executions), 3. Resources, 4. Projects */}
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            profile={profile}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesPage
            modules={modules}
            onToggleComplete={handleToggleModuleComplete}
            onNavigateToLab={handleNavigateToLab}
            userId={profile.id}
          />
        )}

        {activeTab === 'executions' && (
          <LabExecutionsPage
            experiments={experiments}
            outputs={outputs}
            onOutputSaved={handleOutputSaved}
            onStatusChange={handleStatusChange}
            onNavigateToModule={handleNavigateToModule}
            userId={profile.id}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesPage
            resources={resources}
            onUploadResource={handleUploadResource}
            userId={profile.id}
            userName={profile.name}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsPage
            projects={projects}
            onStatusChange={handleProjectStatusChange}
            onUploadDeliverable={handleUploadProjectDeliverable}
            onNavigateToModule={handleNavigateToModule}
            onNavigateToLab={handleNavigateToLab}
            userId={profile.id}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsPage experiments={experiments} tools={tools} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            profile={profile}
            experiments={experiments}
            onProfileUpdated={handleProfileUpdated}
            onNavigateToExecutions={() => setActiveTab('executions')}
          />
        )}
      </main>

      {/* Footer with Fair Use Link */}
      <Footer />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
