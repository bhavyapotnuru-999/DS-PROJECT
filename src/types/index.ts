export type ExperimentStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface UserProfile {
  id: string;
  name: string;
  roll_no: string;
  section: string;
  branch: string;
  year: string;
  university: string;
  assistant_professor: string;
  github: string;
  linkedin: string;
  skills: string[];
  profile_photo?: string;
  email?: string;
  updated_at?: string;
}

export interface Experiment {
  id: string;
  experiment_number: number;
  title: string;
  description: string;
  aim: string;
  status: ExperimentStatus;
  user_id: string;
  output_id?: string;
  updated_at: string;
}

export interface ExecutionOutput {
  id: string;
  experiment_id: string;
  user_id: string;
  file_name: string;
  file_type: string; // 'application/pdf' | 'image/png' | 'image/jpeg', etc.
  file_size: number;
  file_url: string; // blob url or data url
  file_data?: string; // base64 or stored in IndexedDB Blob
  uploaded_at: string;
  notes?: string;
}

export interface ExperimentTool {
  id: string;
  experiment_number: number;
  tool_name: string;
  category: 'Language' | 'Library' | 'Environment' | 'Framework' | 'Database';
  purpose: string;
  version?: string;
  documentation_url?: string;
}

export type ActiveTab = 'home' | 'executions' | 'tools' | 'profile';
