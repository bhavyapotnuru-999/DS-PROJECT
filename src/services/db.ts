import {
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
} from '../types';
import {
  DEFAULT_USER_ID,
  INITIAL_STUDENT_PROFILE,
  INITIAL_EXPERIMENTS,
  INITIAL_TOOLS,
} from '../data/defaultData';
import { INITIAL_MODULES } from '../data/modulesData';
import { INITIAL_RESOURCES } from '../data/resourcesData';
import { INITIAL_PROJECTS } from '../data/projectsData';

const DB_NAME = 'MBU_DS_Lab_Portal_DB';
const DB_VERSION = 2; // Upgraded to v2 to support Modules, Resources, and Projects

// Generate a valid minimal PDF Data URI for default experiments so preview works immediately
export function createSamplePdfDataUri(title: string, experimentNum: number): string {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 280 >>
stream
BT
/F1 20 Tf
50 720 Td
(MOHAN BABU UNIVERSITY - DS LAB) Tj
/F1 12 Tf
0 -30 Td
(Department of Data Science - B.Tech 3rd Year) Tj
0 -25 Td
(Student: Bhavya Potnuru | Roll: 24102A030098) Tj
0 -25 Td
(Faculty In-charge: Bosubabu Sir) Tj
0 -35 Td
(Experiment ${experimentNum}: ${title.substring(0, 45)}) Tj
0 -30 Td
(Status: Verified & Executed in Python 3.11 Environment) Tj
0 -25 Td
(Execution Output: Success [Exit Code: 0]) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000566 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
637
%%EOF`;

  return 'data:application/pdf;base64,' + btoa(content);
}

// Generate valid minimal PDF Data URI for default modules
export function createModulePdfDataUri(title: string, moduleNum: number): string {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 320 >>
stream
BT
/F1 18 Tf
50 720 Td
(MOHAN BABU UNIVERSITY - DS LAB PORTAL) Tj
/F1 12 Tf
0 -30 Td
(Department of Data Science - Curriculum Modules) Tj
0 -25 Td
(Student: Bhavya Potnuru | Roll: 24102A030098) Tj
0 -25 Td
(Faculty In-charge: Bosubabu Sir) Tj
0 -35 Td
(Module ${moduleNum}: ${title.substring(0, 42)}) Tj
0 -30 Td
(Status: Official Lab Reference Curriculum Document) Tj
0 -25 Td
(Format: Standard Laboratory PDF Courseware) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000606 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
677
%%EOF`;

  return 'data:application/pdf;base64,' + btoa(content);
}

// Generate sample SVG/PNG plot output for image outputs
export function createSamplePlotDataUri(title: string, expNum: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#0f172a"/>
    <rect x="20" y="20" width="760" height="460" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    
    <!-- Title and Student Header -->
    <text x="40" y="60" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Mohan Babu University — Data Science Digital Laboratory</text>
    <text x="40" y="90" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14">Experiment ${expNum}: ${title}</text>
    <text x="40" y="115" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12">Student: Bhavya Potnuru (24102A030098) | Section 2 | Guide: Bosubabu Sir</text>
    
    <!-- Chart Box -->
    <rect x="60" y="140" width="680" height="280" fill="#0b1120" rx="8" stroke="#1e293b"/>
    
    <!-- Grid Lines -->
    <line x1="60" y1="210" x2="740" y2="210" stroke="#334155" stroke-dasharray="4"/>
    <line x1="60" y1="280" x2="740" y2="280" stroke="#334155" stroke-dasharray="4"/>
    <line x1="60" y1="350" x2="740" y2="350" stroke="#334155" stroke-dasharray="4"/>
    <line x1="230" y1="140" x2="230" y2="420" stroke="#334155" stroke-dasharray="4"/>
    <line x1="400" y1="140" x2="400" y2="420" stroke="#334155" stroke-dasharray="4"/>
    <line x1="570" y1="140" x2="570" y2="420" stroke="#334155" stroke-dasharray="4"/>
    
    <!-- Visual Curve / Scatter Data Points -->
    <path d="M 90 380 Q 200 340, 320 250 T 520 190 T 710 160" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <path d="M 90 395 Q 220 370, 350 310 T 540 240 T 710 210" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="6"/>
    
    <!-- Data points -->
    <circle cx="120" cy="370" r="5" fill="#f59e0b"/>
    <circle cx="210" cy="320" r="5" fill="#f59e0b"/>
    <circle cx="310" cy="260" r="5" fill="#f59e0b"/>
    <circle cx="420" cy="220" r="5" fill="#f59e0b"/>
    <circle cx="530" cy="185" r="5" fill="#f59e0b"/>
    <circle cx="640" cy="170" r="5" fill="#f59e0b"/>
    
    <!-- Legend -->
    <rect x="520" y="55" width="220" height="65" rx="6" fill="#0f172a" stroke="#334155"/>
    <circle cx="535" cy="75" r="4" fill="#38bdf8"/>
    <text x="548" y="79" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Model Prediction Curve</text>
    <circle cx="535" cy="95" r="4" fill="#f59e0b"/>
    <text x="548" y="99" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Empirical Test Samples</text>

    <!-- Bottom Metrics -->
    <text x="60" y="450" fill="#10b981" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">&#10003; Metric Scores: Accuracy = 97.4% | Loss = 0.042 | R&#178; = 0.961</text>
    <text x="580" y="450" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Generated via Matplotlib / Seaborn</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

class PortalDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Existing stores
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('experiments')) {
          db.createObjectStore('experiments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('outputs')) {
          const store = db.createObjectStore('outputs', { keyPath: 'id' });
          store.createIndex('experiment_id', 'experiment_id', { unique: false });
          store.createIndex('user_id', 'user_id', { unique: false });
        }
        if (!db.objectStoreNames.contains('tools')) {
          db.createObjectStore('tools', { keyPath: 'id' });
        }

        // New stores for Modules, Resources, Projects, Notes
        if (!db.objectStoreNames.contains('modules')) {
          db.createObjectStore('modules', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('module_notes')) {
          const noteStore = db.createObjectStore('module_notes', { keyPath: 'id' });
          noteStore.createIndex('module_id', 'module_id', { unique: false });
          noteStore.createIndex('user_id', 'user_id', { unique: false });
        }
        if (!db.objectStoreNames.contains('resources')) {
          const resStore = db.createObjectStore('resources', { keyPath: 'id' });
          resStore.createIndex('category', 'category', { unique: false });
        }
        if (!db.objectStoreNames.contains('projects')) {
          const projStore = db.createObjectStore('projects', { keyPath: 'id' });
          projStore.createIndex('category', 'category', { unique: false });
          projStore.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // Initial Seeding
  async initDefaultData(): Promise<void> {
    try {
      const db = await this.openDB();

      const tx = db.transaction(
        ['profiles', 'experiments', 'outputs', 'tools', 'modules', 'resources', 'projects'],
        'readwrite'
      );
      const profileStore = tx.objectStore('profiles');
      const expStore = tx.objectStore('experiments');
      const outStore = tx.objectStore('outputs');
      const toolStore = tx.objectStore('tools');
      const modStore = tx.objectStore('modules');
      const resStore = tx.objectStore('resources');
      const projStore = tx.objectStore('projects');

      // Check profile
      const existingProfileReq = profileStore.get(DEFAULT_USER_ID);
      await new Promise<void>((resolve, reject) => {
        existingProfileReq.onsuccess = () => {
          if (!existingProfileReq.result) {
            profileStore.put(INITIAL_STUDENT_PROFILE);
          }
          resolve();
        };
        existingProfileReq.onerror = () => reject(existingProfileReq.error);
      });

      // Check experiments
      const countReq = expStore.count();
      await new Promise<void>((resolve, reject) => {
        countReq.onsuccess = () => {
          if (countReq.result === 0) {
            INITIAL_EXPERIMENTS.forEach((exp) => {
              expStore.put(exp);
            });
          }
          resolve();
        };
        countReq.onerror = () => reject(countReq.error);
      });

      // Check tools
      const toolCountReq = toolStore.count();
      await new Promise<void>((resolve, reject) => {
        toolCountReq.onsuccess = () => {
          if (toolCountReq.result === 0) {
            INITIAL_TOOLS.forEach((tool) => {
              toolStore.put(tool);
            });
          }
          resolve();
        };
        toolCountReq.onerror = () => reject(toolCountReq.error);
      });

      // Check Modules
      const modCountReq = modStore.count();
      await new Promise<void>((resolve, reject) => {
        modCountReq.onsuccess = () => {
          if (modCountReq.result === 0) {
            INITIAL_MODULES.forEach((mod) => {
              modStore.put(mod);
            });
          }
          resolve();
        };
        modCountReq.onerror = () => reject(modCountReq.error);
      });

      // Check Resources
      const resCountReq = resStore.count();
      await new Promise<void>((resolve, reject) => {
        resCountReq.onsuccess = () => {
          if (resCountReq.result === 0) {
            INITIAL_RESOURCES.forEach((res) => {
              resStore.put(res);
            });
          }
          resolve();
        };
        resCountReq.onerror = () => reject(resCountReq.error);
      });

      // Check Projects
      const projCountReq = projStore.count();
      await new Promise<void>((resolve, reject) => {
        projCountReq.onsuccess = () => {
          if (projCountReq.result === 0) {
            INITIAL_PROJECTS.forEach((proj) => {
              projStore.put(proj);
            });
          }
          resolve();
        };
        projCountReq.onerror = () => reject(projCountReq.error);
      });

      // Seed starter outputs for completed experiments (Exp 1, 2, 3 as PDF, Exp 4, 5, 6 as Plot Images)
      const outCountReq = outStore.count();
      await new Promise<void>((resolve, reject) => {
        outCountReq.onsuccess = () => {
          if (outCountReq.result === 0) {
            outStore.put({
              id: 'out-1',
              experiment_id: 'exp-1',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp1_NumPy_Vectorization_Output.pdf',
              file_type: 'application/pdf',
              file_size: 148200,
              file_url: createSamplePdfDataUri(INITIAL_EXPERIMENTS[0].title, 1),
              file_data: createSamplePdfDataUri(INITIAL_EXPERIMENTS[0].title, 1),
              uploaded_at: new Date(Date.now() - 86400000 * 10).toISOString(),
              notes: 'All NumPy multi-dimensional test cases and vectorized benchmarking passed.',
            });

            outStore.put({
              id: 'out-2',
              experiment_id: 'exp-2',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp2_Pandas_DataWrangling_Report.pdf',
              file_type: 'application/pdf',
              file_size: 215400,
              file_url: createSamplePdfDataUri(INITIAL_EXPERIMENTS[1].title, 2),
              file_data: createSamplePdfDataUri(INITIAL_EXPERIMENTS[1].title, 2),
              uploaded_at: new Date(Date.now() - 86400000 * 8).toISOString(),
              notes: 'Cleaned null values, grouped by departmental demographics, generated summary metrics.',
            });

            outStore.put({
              id: 'out-3',
              experiment_id: 'exp-3',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp3_EDA_Distribution_Plots.png',
              file_type: 'image/png',
              file_size: 320500,
              file_url: createSamplePlotDataUri(INITIAL_EXPERIMENTS[2].title, 3),
              file_data: createSamplePlotDataUri(INITIAL_EXPERIMENTS[2].title, 3),
              uploaded_at: new Date(Date.now() - 86400000 * 6).toISOString(),
              notes: 'Visualized feature pair correlations and histogram densities.',
            });

            outStore.put({
              id: 'out-4',
              experiment_id: 'exp-4',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp4_Feature_Scaling_Verification.pdf',
              file_type: 'application/pdf',
              file_size: 184000,
              file_url: createSamplePdfDataUri(INITIAL_EXPERIMENTS[3].title, 4),
              file_data: createSamplePdfDataUri(INITIAL_EXPERIMENTS[3].title, 4),
              uploaded_at: new Date(Date.now() - 86400000 * 4).toISOString(),
              notes: 'StandardScaler verified with zero mean and unit variance.',
            });

            outStore.put({
              id: 'out-5',
              experiment_id: 'exp-5',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp5_Regression_Fit_Graph.png',
              file_type: 'image/png',
              file_size: 289000,
              file_url: createSamplePlotDataUri(INITIAL_EXPERIMENTS[4].title, 5),
              file_data: createSamplePlotDataUri(INITIAL_EXPERIMENTS[4].title, 5),
              uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
              notes: 'Polynomial degree 2 fitted with R² score of 0.941.',
            });

            outStore.put({
              id: 'out-6',
              experiment_id: 'exp-6',
              user_id: DEFAULT_USER_ID,
              file_name: 'Exp6_DecisionTree_Classification.pdf',
              file_type: 'application/pdf',
              file_size: 265000,
              file_url: createSamplePdfDataUri(INITIAL_EXPERIMENTS[5].title, 6),
              file_data: createSamplePdfDataUri(INITIAL_EXPERIMENTS[5].title, 6),
              uploaded_at: new Date(Date.now() - 86400000 * 1).toISOString(),
              notes: 'Confusion matrix generated with 92% classification accuracy.',
            });
          }
          resolve();
        };
        outCountReq.onerror = () => reject(outCountReq.error);
      });
    } catch (err) {
      console.warn('Database initialization note:', err);
    }
  }

  // Profile Methods
  async getUserProfile(userId = DEFAULT_USER_ID): Promise<UserProfile> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('profiles', 'readonly');
      const store = tx.objectStore('profiles');
      const req = store.get(userId);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
        } else {
          resolve(INITIAL_STUDENT_PROFILE);
        }
      };
      req.onerror = () => resolve(INITIAL_STUDENT_PROFILE);
    });
  }

  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    const db = await this.openDB();
    const updated = {
      ...profile,
      updated_at: new Date().toISOString(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('profiles', 'readwrite');
      const store = tx.objectStore('profiles');
      const req = store.put(updated);
      req.onsuccess = () => {
        try {
          localStorage.setItem('mbu_user_profile', JSON.stringify(updated));
        } catch (_) {}
        resolve(updated);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // Experiments Methods
  async getExperiments(userId = DEFAULT_USER_ID): Promise<Experiment[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('experiments', 'readonly');
      const store = tx.objectStore('experiments');
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result as Experiment[];
        if (results && results.length > 0) {
          resolve(results.sort((a, b) => a.experiment_number - b.experiment_number));
        } else {
          resolve(INITIAL_EXPERIMENTS as Experiment[]);
        }
      };
      req.onerror = () => resolve(INITIAL_EXPERIMENTS as Experiment[]);
    });
  }

  async updateExperimentStatus(
    id: string,
    status: ExperimentStatus,
    outputId?: string
  ): Promise<Experiment> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('experiments', 'readwrite');
      const store = tx.objectStore('experiments');
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const item: Experiment = getReq.result || {
          id,
          experiment_number: 1,
          title: '',
          description: '',
          aim: '',
          status,
          user_id: DEFAULT_USER_ID,
          updated_at: new Date().toISOString(),
        };

        item.status = status;
        item.updated_at = new Date().toISOString();
        if (outputId !== undefined) {
          item.output_id = outputId;
        }

        const putReq = store.put(item);
        putReq.onsuccess = () => resolve(item);
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Execution Outputs Methods
  async getExecutionOutputs(userId = DEFAULT_USER_ID): Promise<ExecutionOutput[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('outputs', 'readonly');
      const store = tx.objectStore('outputs');
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result || []) as ExecutionOutput[];
        resolve(all.filter((o) => !userId || o.user_id === userId));
      };
      req.onerror = () => resolve([]);
    });
  }

  async getExecutionOutputForExperiment(
    experimentId: string,
    userId = DEFAULT_USER_ID
  ): Promise<ExecutionOutput | null> {
    const outputs = await this.getExecutionOutputs(userId);
    const found = outputs.find((o) => o.experiment_id === experimentId);
    return found || null;
  }

  async saveExecutionOutput(output: ExecutionOutput): Promise<ExecutionOutput> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['outputs', 'experiments'], 'readwrite');
      const outStore = tx.objectStore('outputs');
      const expStore = tx.objectStore('experiments');

      const allReq = outStore.getAll();
      allReq.onsuccess = () => {
        const all = (allReq.result || []) as ExecutionOutput[];
        const existing = all.find(
          (o) => o.experiment_id === output.experiment_id && o.user_id === output.user_id
        );

        const targetId = existing ? existing.id : output.id;
        const toSave: ExecutionOutput = {
          ...output,
          id: targetId,
          uploaded_at: new Date().toISOString(),
        };

        const putReq = outStore.put(toSave);
        putReq.onsuccess = () => {
          const expReq = expStore.get(output.experiment_id);
          expReq.onsuccess = () => {
            if (expReq.result) {
              const exp = expReq.result;
              exp.status = 'Completed';
              exp.output_id = targetId;
              exp.updated_at = new Date().toISOString();
              expStore.put(exp);
            }
            resolve(toSave);
          };
          expReq.onerror = () => resolve(toSave);
        };
        putReq.onerror = () => reject(putReq.error);
      };
      allReq.onerror = () => reject(allReq.error);
    });
  }

  async deleteExecutionOutput(outputId: string, experimentId?: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['outputs', 'experiments'], 'readwrite');
      const outStore = tx.objectStore('outputs');
      const expStore = tx.objectStore('experiments');

      const delReq = outStore.delete(outputId);
      delReq.onsuccess = () => {
        if (experimentId) {
          const expReq = expStore.get(experimentId);
          expReq.onsuccess = () => {
            if (expReq.result) {
              const exp = expReq.result;
              exp.status = 'Not Started';
              delete exp.output_id;
              expStore.put(exp);
            }
            resolve();
          };
          expReq.onerror = () => resolve();
        } else {
          resolve();
        }
      };
      delReq.onerror = () => reject(delReq.error);
    });
  }

  // Tools Methods
  async getTools(): Promise<ExperimentTool[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('tools', 'readonly');
      const store = tx.objectStore('tools');
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result as ExperimentTool[];
        if (list && list.length > 0) {
          resolve(list.sort((a, b) => a.experiment_number - b.experiment_number));
        } else {
          resolve(INITIAL_TOOLS);
        }
      };
      req.onerror = () => resolve(INITIAL_TOOLS);
    });
  }

  // ==================== NEW MODULES METHODS ====================
  async getModules(): Promise<TextbookModule[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('modules', 'readwrite');
      const store = tx.objectStore('modules');
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result || []) as TextbookModule[];
        const mapByNum = new Map<number, TextbookModule>();
        all.forEach((m) => {
          if (m.module_number >= 1 && m.module_number <= 5) {
            mapByNum.set(m.module_number, m);
          } else {
            store.delete(m.id);
          }
        });

        const list: TextbookModule[] = [];
        for (let num = 1; num <= 5; num++) {
          let mod = mapByNum.get(num);
          if (!mod) {
            const initial = INITIAL_MODULES.find((m) => m.module_number === num) || {
              id: `mod-${num}`,
              module_number: num,
              title: `Module ${num}`,
              subtitle: 'Data Science Laboratory Curriculum',
              author: 'Mohan Babu University',
              edition: '2026',
              cover_gradient: 'from-blue-900 via-indigo-950 to-slate-900',
              cover_accent: '#38bdf8',
              description: 'Laboratory curriculum notes and practical study materials.',
              estimated_read_time: '45 mins',
              chapters: [],
            };
            mod = { ...initial, id: `mod-${num}`, module_number: num };
            store.put(mod);
          }
          if (mod.uploaded_file_name && !mod.uploaded_file_data) {
            mod.uploaded_file_data = createModulePdfDataUri(mod.title, mod.module_number);
            mod.uploaded_file_url = mod.uploaded_file_data;
            store.put(mod);
          }
          list.push(mod);
        }
        resolve(list.sort((a, b) => a.module_number - b.module_number));
      };
      req.onerror = () => resolve(INITIAL_MODULES.slice(0, 5));
    });
  }

  async saveModule(module: TextbookModule): Promise<TextbookModule> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('modules', 'readwrite');
      const store = tx.objectStore('modules');
      const req = store.put(module);
      req.onsuccess = () => resolve(module);
      req.onerror = () => reject(req.error);
    });
  }

  async uploadModuleMaterial(
    moduleIdOrNumber: string | number,
    file: {
      fileName: string;
      fileType: string;
      fileSize: number;
      fileData?: string;
    }
  ): Promise<TextbookModule> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('modules', 'readwrite');
      const store = tx.objectStore('modules');
      const allReq = store.getAll();

      allReq.onsuccess = () => {
        const all = (allReq.result || []) as TextbookModule[];
        let target = all.find(
          (m) =>
            m.id === String(moduleIdOrNumber) ||
            m.module_number === Number(moduleIdOrNumber)
        );

        if (!target) {
          const modNum =
            typeof moduleIdOrNumber === 'number'
              ? moduleIdOrNumber
              : parseInt(String(moduleIdOrNumber).replace(/\D/g, '')) || 1;
          const defaultMod = INITIAL_MODULES.find((m) => m.module_number === modNum);
          target = {
            ...(defaultMod || {
              id: `mod-${modNum}`,
              module_number: modNum,
              title: `Module ${modNum}`,
              subtitle: 'Data Science Lab Module',
              author: 'Mohan Babu University',
              edition: '2026',
              cover_gradient: 'from-blue-900 via-indigo-950 to-slate-900',
              cover_accent: '#38bdf8',
              description: 'Laboratory curriculum notes',
              estimated_read_time: '45 mins',
              chapters: [],
            }),
            id: `mod-${modNum}`,
            module_number: modNum,
          };
        }

        // Strictly update the PDF details on the target module without altering number or title
        target.uploaded_file_name = file.fileName;
        target.uploaded_file_type = file.fileType || 'application/pdf';
        target.uploaded_file_size = file.fileSize;
        target.uploaded_file_data = file.fileData || '';
        target.uploaded_file_url = file.fileData || '';
        target.uploaded_at = new Date().toISOString();

        const putReq = store.put(target);
        putReq.onsuccess = () => {
          tx.oncomplete = () => {
            resolve(target!);
          };
        };
        putReq.onerror = () =>
          reject(putReq.error || new Error('Failed to save PDF to module database'));
      };

      allReq.onerror = () => reject(allReq.error || new Error('Failed to access modules database'));
      tx.onerror = () => reject(tx.error || new Error('Database transaction failed'));
      tx.onabort = () => reject(tx.error || new Error('Database transaction aborted'));
    });
  }

  async toggleModuleCompletion(moduleId: string, isCompleted: boolean): Promise<TextbookModule> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('modules', 'readwrite');
      const store = tx.objectStore('modules');
      const getReq = store.get(moduleId);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const mod = getReq.result as TextbookModule;
          mod.is_completed = isCompleted;
          mod.progress_percent = isCompleted ? 100 : mod.progress_percent || 0;
          store.put(mod);
          resolve(mod);
        } else {
          reject(new Error('Module not found'));
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  async updateModuleProgress(moduleId: string, progress: number): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('modules', 'readwrite');
      const store = tx.objectStore('modules');
      const getReq = store.get(moduleId);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const mod = getReq.result as TextbookModule;
          mod.progress_percent = Math.min(100, Math.max(0, progress));
          if (mod.progress_percent === 100) {
            mod.is_completed = true;
          }
          store.put(mod);
          resolve();
        } else {
          resolve();
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  async saveModuleNote(note: ModuleNoteUpload): Promise<ModuleNoteUpload> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['module_notes', 'modules'], 'readwrite');
      const noteStore = tx.objectStore('module_notes');
      const modStore = tx.objectStore('modules');

      const req = noteStore.put(note);
      req.onsuccess = () => {
        // Also attach note reference to the module
        const modReq = modStore.get(note.module_id);
        modReq.onsuccess = () => {
          if (modReq.result) {
            const mod = modReq.result as TextbookModule;
            mod.uploaded_notes = [...(mod.uploaded_notes || []), note];
            modStore.put(mod);
          }
          resolve(note);
        };
        modReq.onerror = () => resolve(note);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getModuleNotes(moduleId?: string): Promise<ModuleNoteUpload[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('module_notes', 'readonly');
      const store = tx.objectStore('module_notes');
      const req = store.getAll();
      req.onsuccess = () => {
        const notes = (req.result || []) as ModuleNoteUpload[];
        if (moduleId) {
          resolve(notes.filter((n) => n.module_id === moduleId));
        } else {
          resolve(notes);
        }
      };
      req.onerror = () => resolve([]);
    });
  }

  // ==================== NEW RESOURCES METHODS ====================
  async getResources(): Promise<LearningResource[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('resources', 'readonly');
      const store = tx.objectStore('resources');
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result as LearningResource[];
        if (list && list.length > 0) {
          resolve(list.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()));
        } else {
          resolve(INITIAL_RESOURCES);
        }
      };
      req.onerror = () => resolve(INITIAL_RESOURCES);
    });
  }

  async saveResource(resource: LearningResource): Promise<LearningResource> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('resources', 'readwrite');
      const store = tx.objectStore('resources');
      const req = store.put(resource);
      req.onsuccess = () => resolve(resource);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteResource(resourceId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('resources', 'readwrite');
      const store = tx.objectStore('resources');
      const req = store.delete(resourceId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==================== NEW PROJECTS METHODS ====================
  async getProjects(): Promise<LabProject[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result as LabProject[];
        const hasSkyCast = list && list.some((p) => p.title.toLowerCase().includes('skycast'));
        if (list && list.length === 5 && hasSkyCast) {
          resolve(list);
        } else {
          store.clear();
          INITIAL_PROJECTS.forEach((proj) => store.put(proj));
          resolve(INITIAL_PROJECTS);
        }
      };
      req.onerror = () => resolve(INITIAL_PROJECTS);
    });
  }

  async saveProject(project: LabProject): Promise<LabProject> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      const updated = {
        ...project,
        updated_at: new Date().toISOString(),
      };
      const req = store.put(updated);
      req.onsuccess = () => resolve(updated);
      req.onerror = () => reject(req.error);
    });
  }

  async updateProjectStatus(projectId: string, status: ProjectStatus): Promise<LabProject> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      const getReq = store.get(projectId);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const proj = getReq.result as LabProject;
          proj.status = status;
          proj.updated_at = new Date().toISOString();
          store.put(proj);
          resolve(proj);
        } else {
          reject(new Error('Project not found'));
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  async saveProjectDeliverable(deliverable: ProjectDeliverable): Promise<ProjectDeliverable> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      const getReq = store.get(deliverable.project_id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const proj = getReq.result as LabProject;
          proj.deliverables = [...(proj.deliverables || []), deliverable];
          proj.updated_at = new Date().toISOString();
          store.put(proj);
          resolve(deliverable);
        } else {
          reject(new Error('Project not found'));
        }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Reset to initial state if needed
  async resetToDefaults(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ['profiles', 'experiments', 'outputs', 'tools', 'modules', 'resources', 'projects'],
        'readwrite'
      );
      tx.objectStore('profiles').clear();
      tx.objectStore('experiments').clear();
      tx.objectStore('outputs').clear();
      tx.objectStore('tools').clear();
      tx.objectStore('modules').clear();
      tx.objectStore('resources').clear();
      tx.objectStore('projects').clear();

      tx.oncomplete = async () => {
        localStorage.clear();
        await this.initDefaultData();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const dbService = new PortalDatabase();
