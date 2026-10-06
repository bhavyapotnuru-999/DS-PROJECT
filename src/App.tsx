import { useState, useEffect } from 'react';
import { ActiveTab, UserProfile, Experiment, ExecutionOutput, ExperimentTool, ExperimentStatus } from './types';
import { dbService } from './services/db';
import { INITIAL_STUDENT_PROFILE } from './data/defaultData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LabExecutionsPage } from './pages/LabExecutionsPage';
import { ToolsPage } from './pages/ToolsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LogIn, LogOut, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Core Data State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_STUDENT_PROFILE);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [outputs, setOutputs] = useState<ExecutionOutput[]>([]);
  const [tools, setTools] = useState<ExperimentTool[]>([]);

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
        const [loadedProfile, loadedExperiments, loadedOutputs, loadedTools] =
          await Promise.all([
            dbService.getUserProfile(),
            dbService.getExperiments(),
            dbService.getExecutionOutputs(),
            dbService.getTools(),
          ]);

        setProfile(loadedProfile);
        setExperiments(loadedExperiments);
        setOutputs(loadedOutputs);
        setTools(loadedTools);
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
    // Refresh outputs and experiments to reflect latest status
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

  // Simulate Logout & Login
  const handleSimulateLogout = () => {
    setIsLoggedIn(false);
    addToast('info', 'Logged out. Experiment files and profile remain safely stored in the database.');
  };

  const handleSimulateLogin = async () => {
    setIsLoading(true);
    // Reload freshly from database upon login
    try {
      const [loadedProfile, loadedExperiments, loadedOutputs] = await Promise.all([
        dbService.getUserProfile(),
        dbService.getExperiments(),
        dbService.getExecutionOutputs(),
      ]);
      setProfile(loadedProfile);
      setExperiments(loadedExperiments);
      setOutputs(loadedOutputs);
      setIsLoggedIn(true);
      addToast('success', `Welcome back, ${loadedProfile.name}! All 10 experiments and outputs restored.`);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = experiments.filter((e) => e.status === 'Completed').length;
  const totalCount = experiments.length || 10;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-700">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          <div className="text-sm font-semibold tracking-wide">
            Loading MBU DS Lab Portal...
          </div>
          <div className="text-xs text-slate-600">
            Connecting to laboratory database &amp; experiments
          </div>
        </div>
      </div>
    );
  }

  // Logged-out state view for testing persistence across logout/login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <header className="bg-white border-b border-slate-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-bold text-slate-900 text-lg">MBU | DS Lab Portal</span>
            <span className="text-xs text-slate-600">Mohan Babu University</span>
          </div>
        </header>

        <main className="max-w-md mx-auto w-full px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Student Portal Login</h1>
              <p className="text-xs text-slate-600">
                Sign in to view your laboratory experiments, uploaded PDFs, and profile
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
              <div className="text-xs text-slate-500 font-medium">Logged-in Account Details:</div>
              <div className="text-sm font-bold text-slate-900">{profile.name}</div>
              <div className="text-xs font-mono text-slate-700">Roll: {profile.roll_no} | Sec 2</div>
              <div className="text-xs text-slate-600">University: {profile.university}</div>
              <div className="text-xs text-slate-600">Faculty: {profile.assistant_professor}</div>
            </div>

            <button
              onClick={handleSimulateLogin}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In as {profile.name}</span>
            </button>

            <p className="text-[11px] text-slate-600">
              Note: All uploaded PDF experiment outputs and profile changes are persistent and will be restored immediately.
            </p>
          </div>
        </main>

        <Footer />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Subtle Student Session Bar */}
        <div className="mt-3 py-1.5 px-3 bg-white/70 border border-slate-200/60 rounded-lg flex items-center justify-between text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Active Session: <strong className="text-slate-900">{profile.name}</strong> ({profile.roll_no}) •{' '}
              {profile.branch} • 3rd Year
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              Guide: {profile.assistant_professor}
            </span>
            <button
              onClick={handleSimulateLogout}
              title="Test logout and login persistence"
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-3 h-3 text-slate-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Router */}
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            profile={profile}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        )}

        {activeTab === 'executions' && (
          <LabExecutionsPage
            experiments={experiments}
            outputs={outputs}
            onOutputSaved={handleOutputSaved}
            onStatusChange={handleStatusChange}
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
