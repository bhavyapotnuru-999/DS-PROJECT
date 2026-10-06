import {
  UserProfile,
  Experiment,
  ExecutionOutput,
  ExperimentTool,
  ExperimentStatus,
} from '../types';
import {
  DEFAULT_USER_ID,
  INITIAL_STUDENT_PROFILE,
  INITIAL_EXPERIMENTS,
  INITIAL_TOOLS,
} from '../data/defaultData';

const DB_NAME = 'MBU_DS_Lab_Portal_DB';
const DB_VERSION = 1;

interface DBSchema {
  profiles: UserProfile;
  experiments: Experiment;
  outputs: ExecutionOutput;
  tools: ExperimentTool;
}

// Generate a valid minimal PDF Data URI for default experiments so preview works immediately
export function createSamplePdfDataUri(title: string, experimentNum: number): string {
  // A clean data URI for a formatted minimal PDF with university header
  // Minimal valid PDF binary string
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

// Generate sample SVG/PNG plot output for image outputs
export function createSamplePlotDataUri(title: string, expNum: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#0f172a"/>
    <rect x="20" y="20" width="760" height="460" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    
    <!-- Title and Student Header -->
    <text x="40" y="60" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">Mohan Babu University — Data Science Laboratory</text>
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

      // Check profile
      const tx = db.transaction(['profiles', 'experiments', 'outputs', 'tools'], 'readwrite');
      const profileStore = tx.objectStore('profiles');
      const expStore = tx.objectStore('experiments');
      const outStore = tx.objectStore('outputs');
      const toolStore = tx.objectStore('tools');

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

      // Seed starter outputs for completed experiments (Exp 1, 2, 3 as PDF, Exp 4, 5, 6 as Plot Images)
      const outCountReq = outStore.count();
      await new Promise<void>((resolve, reject) => {
        outCountReq.onsuccess = () => {
          if (outCountReq.result === 0) {
            // Exp 1: PDF
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

            // Exp 2: PDF
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

            // Exp 3: Image plot
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

            // Exp 4: PDF
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

            // Exp 5: Image plot
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

            // Exp 6: PDF
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
        // Also cache in localStorage for fast synchronous bootstrap if needed
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
          // Sort by experiment_number 1 to 10
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
        // Filter by user if specified
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

      // Check if there is already an output for this experiment, if so, replace/update it
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
          // Automatically mark the experiment as Completed
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

  // Reset to initial state if needed
  async resetToDefaults(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['profiles', 'experiments', 'outputs', 'tools'], 'readwrite');
      tx.objectStore('profiles').clear();
      tx.objectStore('experiments').clear();
      tx.objectStore('outputs').clear();
      tx.objectStore('tools').clear();

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
