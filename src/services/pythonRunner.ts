/**
 * In-browser Python runner powered by Pyodide (WebAssembly).
 * The runtime and scientific packages are downloaded from a CDN on first use.
 *
 * Programs run cell by cell like a Jupyter notebook: every cell shares the same
 * Python globals, so variables defined in one cell are available in the next.
 */

export interface PythonRunResult {
  stdout: string;
  error: string;
  figures: string[];
  warnings: string[];
}

export type RunProgress = (message: string) => void;

const PYODIDE_VERSION = '0.29.5';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<any> | null = null;
const installedPackages = new Set<string>();
let httpPatched = false;
let samplesLoaded = false;
let micropipPromise: Promise<any> | null = null;

/**
 * Sample data bundled with the portal. They are copied into the in-memory
 * Python file system so programs that open local files still run.
 */
const SAMPLE_FILES: Record<string, string> = {
  'hw_200.csv': 'datasets/hw_200.csv',
  'reviews.html': 'datasets/reviews.html',
  'marketing_campaign.csv': 'datasets/marketing_campaign.csv',
};

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = (window as any).loadPyodide;
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Could not download the Python runtime from the CDN.'));
    document.head.appendChild(script);
  });
}

async function getPyodide(): Promise<any> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadPyodideScript();
      const loadPyodide = (window as any).loadPyodide;
      if (typeof loadPyodide !== 'function') {
        throw new Error('Python runtime failed to initialise.');
      }
      return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
    })().catch((error) => {
      pyodidePromise = null;
      throw error;
    });
  }

  return pyodidePromise;
}

async function getMicropip(pyodide: any): Promise<any> {
  if (!micropipPromise) {
    micropipPromise = (async () => {
      await pyodide.loadPackage('micropip');
      return pyodide.pyimport('micropip');
    })().catch((error) => {
      micropipPromise = null;
      throw error;
    });
  }

  return micropipPromise;
}

async function preloadSampleFiles(pyodide: any): Promise<void> {
  if (samplesLoaded) return;

  const base = import.meta.env.BASE_URL || '/';

  await Promise.all(
    Object.entries(SAMPLE_FILES).map(async ([target, source]) => {
      try {
        const response = await fetch(`${base}${source}`);
        if (!response.ok) return;
        const bytes = new Uint8Array(await response.arrayBuffer());
        pyodide.FS.writeFile(target, bytes);
      } catch {
        // A missing sample is not fatal: the program will report its own error.
      }
    })
  );

  samplesLoaded = true;
}

/** Packages shipped with the Pyodide distribution. */
const PYODIDE_PACKAGES = new Set([
  'pandas',
  'numpy',
  'matplotlib',
  'scikit-learn',
  'scipy',
  'beautifulsoup4',
  'requests',
  'nltk',
  'wordcloud',
]);

/** Map imported module names to installable package names. */
const PACKAGE_BY_MODULE: Record<string, string> = {
  pandas: 'pandas',
  numpy: 'numpy',
  matplotlib: 'matplotlib',
  seaborn: 'seaborn',
  sklearn: 'scikit-learn',
  scipy: 'scipy',
  bs4: 'beautifulsoup4',
  requests: 'requests',
  nltk: 'nltk',
  vaderSentiment: 'vaderSentiment',
  wordcloud: 'wordcloud',
  PIL: 'pillow',
};

export function detectPackages(code: string): string[] {
  const packages = new Set<string>();
  const importPattern = /^\s*(?:import|from)\s+([A-Za-z_][\w.]*)/gm;

  let match: RegExpExecArray | null;
  while ((match = importPattern.exec(code)) !== null) {
    const moduleName = match[1].split('.')[0];
    const packageName = PACKAGE_BY_MODULE[moduleName];
    if (packageName) packages.add(packageName);
  }

  // vaderSentiment depends on requests.
  if (packages.has('vaderSentiment')) packages.add('requests');

  // Excel support is provided by openpyxl, which pandas imports internally.
  if (/\.(?:to|read)_excel\s*\(/.test(code)) packages.add('openpyxl');

  return Array.from(packages);
}

function buildRunnerScript(code: string, sessionId: number): string {
  const encodedCode = JSON.stringify(code);

  return `
import builtins
import contextlib
import io
import json
import traceback

_code = ${encodedCode}
_session_id = ${sessionId}

# Each browser session gets its own globals dict, kept between cells so the
# notebook behaves like Jupyter (variables survive from one cell to the next).
if getattr(builtins, "_lab_session_id", None) != _session_id:
    builtins._lab_session = {"__name__": "__main__"}
    builtins._lab_session_id = _session_id

_globals = builtins._lab_session
builtins._lab_figures = []

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    def _capture_show(*args, **kwargs):
        import base64

        buffer = io.BytesIO()
        plt.gcf().savefig(buffer, format="png", dpi=110, bbox_inches="tight")
        buffer.seek(0)
        builtins._lab_figures.append(
            base64.b64encode(buffer.read()).decode("ascii")
        )
        plt.close("all")

    plt.show = _capture_show
except Exception:
    pass

_stdout = io.StringIO()
_error = ""

try:
    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stdout):
        exec(compile(_code, "<cell>", "exec"), _globals)
except Exception:
    _error = traceback.format_exc()

json.dumps({
    "stdout": _stdout.getvalue(),
    "error": _error,
    "figures": builtins._lab_figures[:6]
})
`;
}

export async function runPythonCell(
  code: string,
  sessionId: number,
  onProgress: RunProgress
): Promise<PythonRunResult> {
  const warnings: string[] = [];

  onProgress('Starting Python runtime…');
  const pyodide = await getPyodide();

  const packages = detectPackages(code);
  const builtinPackages = packages.filter(
    (name) => PYODIDE_PACKAGES.has(name) && !installedPackages.has(name)
  );

  for (const packageName of builtinPackages) {
    onProgress(`Loading ${packageName}…`);
    try {
      await pyodide.loadPackage(packageName);
      installedPackages.add(packageName);
    } catch (error) {
      warnings.push(`Could not load ${packageName}: ${toMessage(error)}`);
    }
  }

  const externalPackages = packages.filter(
    (name) => !PYODIDE_PACKAGES.has(name) && !installedPackages.has(name)
  );

  for (const packageName of externalPackages) {
    onProgress(`Installing ${packageName}…`);
    try {
      const micropip = await getMicropip(pyodide);
      await micropip.install(packageName);
      installedPackages.add(packageName);
    } catch (error) {
      warnings.push(`Could not install ${packageName}: ${toMessage(error)}`);
    }
  }

  if (!httpPatched) {
    try {
      onProgress('Enabling network access…');
      await pyodide.loadPackage('pyodide-http');
      await pyodide.runPythonAsync(
        'import pyodide_http; pyodide_http.patch_all()'
      );
      httpPatched = true;
    } catch (error) {
      warnings.push(`Network support unavailable: ${toMessage(error)}`);
    }
  }

  onProgress('Preparing sample data…');
  await preloadSampleFiles(pyodide);

  onProgress('Running cell…');
  const rawResult = await pyodide.runPythonAsync(
    buildRunnerScript(code, sessionId)
  );
  const parsed = JSON.parse(rawResult as string);

  const error = String(parsed.error ?? '');
  if (/unknown url type|Failed to fetch|NetworkError|CORS/i.test(error)) {
    warnings.push(
      'The program tried to download a file but the browser blocked it (CORS). ' +
        'Use a URL that allows cross-origin requests, or download the .py file and run it locally.'
    );
  }

  return {
    stdout: String(parsed.stdout ?? '').slice(0, 20000),
    error: error.slice(0, 20000),
    figures: Array.isArray(parsed.figures) ? parsed.figures : [],
    warnings,
  };
}
