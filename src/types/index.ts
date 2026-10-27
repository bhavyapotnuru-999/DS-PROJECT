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
  blood_group?: string;
  valid_thru?: string;
  phone?: string;
  emergency_contact?: string;
  hostel_room?: string;
  dob?: string;
  updated_at?: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  description: string;
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
  linked_module_id?: string;
  test_cases?: TestCase[];
  expected_output_summary?: string;
  practical_steps?: string[];
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

// ==================== NEW MODULES TYPES ====================

export interface PracticeQuestion {
  id: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface ModuleChapter {
  id: string;
  chapter_number: number;
  title: string;
  subheadings: string[];
  reading_time_mins: number;
  definition: {
    term: string;
    explanation: string;
  };
  content_markdown: string;
  code_snippets?: {
    title: string;
    language: string;
    code: string;
    output?: string;
  }[];
  diagram_svg?: string;
  summary_bullets: string[];
  practice_questions: PracticeQuestion[];
}

export interface ModuleNoteUpload {
  id: string;
  module_id: string;
  chapter_id?: string;
  user_id: string;
  file_name: string;
  file_type: string; // 'application/pdf' | 'text/plain' | etc.
  file_size: number;
  file_data: string; // Base64 or text content
  uploaded_at: string;
  notes?: string;
}

export interface TextbookModule {
  id: string;
  module_number: number;
  title: string;
  subtitle: string;
  author: string;
  edition: string;
  cover_gradient: string;
  cover_accent: string;
  description: string;
  estimated_read_time: string;
  chapters: ModuleChapter[];
  linked_experiment_number?: number;
  is_completed?: boolean;
  progress_percent?: number;
  uploaded_notes?: ModuleNoteUpload[];
  uploaded_file_name?: string;
  uploaded_file_type?: string;
  uploaded_file_size?: number;
  uploaded_file_data?: string;
  uploaded_file_url?: string;
  uploaded_at?: string;
}

// ==================== NEW RESOURCES TYPES ====================

export type ResourceCategory =
  | 'Cheat Sheet'
  | 'Dataset'
  | 'Lecture Notes'
  | 'Documentation'
  | 'Video Tutorial'
  | 'Code Template';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  subject: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  file_data?: string;
  external_url?: string;
  uploaded_by: string;
  uploaded_at: string;
  tags: string[];
  download_count?: number;
}

// ==================== NEW PROJECTS TYPES ====================

export type ProjectCategory =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Weather Application / Web Development'
  | 'Sustainable Agriculture / Green Technology'
  | 'ApexPlanet Internship / Web Development'
  | 'ApexPlanet Internship / Frontend Development'
  | 'Artificial Intelligence'
  | (string & {});
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ProjectDeliverable {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_data: string;
  uploaded_at: string;
}

export interface LabProject {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  estimated_duration: string;
  description: string;
  objectives: string[];
  technologies: string[];
  requirements: string[];
  implementation_steps: {
    step_number: number;
    title: string;
    details: string;
  }[];
  github_url?: string;
  live_demo_url?: string;
  related_module_id?: string;
  related_module_title?: string;
  related_experiment_numbers?: number[];
  deliverables?: ProjectDeliverable[];
  updated_at: string;
}

// Update ActiveTab to support the exact requested navigation order
// 1. Modules, 2. Lab (executions), 3. Resources, 4. Projects, plus existing Home, Tools, Profile
export type ActiveTab =
  | 'home'
  | 'modules'
  | 'executions'
  | 'resources'
  | 'projects'
  | 'tools'
  | 'profile';
