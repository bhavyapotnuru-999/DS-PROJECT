import React, { useEffect, useRef, useState } from 'react';
import { Experiment } from '../types';
import { getExperimentCode } from '../data/experimentCode';
import { NotebookCell } from './NotebookCell';
import { PythonRunResult, runPythonCell } from '../services/pythonRunner';
import {
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';

interface ExperimentEditorModalProps {
  experiment: Experiment;
  onClose: () => void;
}

/** Monotonic id so every modal session starts with a clean Python namespace. */
let sessionCounter = 0;

export const ExperimentEditorModal: React.FC<ExperimentEditorModalProps> = ({
  experiment,
  onClose,
}) => {
  const entry = getExperimentCode(experiment.experiment_number);

  const [cells, setCells] = useState<string[]>(entry.cells);
  const [results, setResults] = useState<(PythonRunResult | null)[]>(() =>
    entry.cells.map(() => null)
  );
  const [runningIndex, setRunningIndex] = useState<number | null>(null);
  const [runStage, setRunStage] = useState('');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sessionRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sections = entry.sections;

  useEffect(() => {
    sessionCounter += 1;
    sessionRef.current = sessionCounter;

    setCells(entry.cells);
    setResults(entry.cells.map(() => null));
    setRunningIndex(null);
    setRunStage('');
    setIsRunningAll(false);
    setActiveSection(null);
  }, [entry.code]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isBusy = runningIndex !== null || isRunningAll;
  const totalLines = cells.reduce((sum, cell) => sum + cell.split('\n').length, 0);

  const visibleSections =
    activeSection === null
      ? sections
      : sections.filter((section) => section.label === activeSection);
  const visibleCellCount = visibleSections.reduce(
    (sum, section) => sum + section.cellIndices.length,
    0
  );

  const handleSelectSection = (label: string | null) => {
    setActiveSection(label);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const updateCell = (index: number, value: string) => {
    setCells((previous) =>
      previous.map((cell, cellIndex) => (cellIndex === index ? value : cell))
    );
  };

  const storeResult = (index: number, result: PythonRunResult) => {
    setResults((previous) => {
      const next = [...previous];
      next[index] = result;
      return next;
    });
  };

  const executeCell = async (
    index: number,
    sessionId: number
  ): Promise<PythonRunResult> => {
    setRunningIndex(index);
    setRunStage('Starting Python runtime…');

    try {
      const result = await runPythonCell(cells[index], sessionId, setRunStage);
      storeResult(index, result);
      return result;
    } catch (error) {
      const result: PythonRunResult = {
        stdout: '',
        error:
          error instanceof Error
            ? error.message
            : 'The Python program could not be started.',
        figures: [],
        warnings: [],
      };
      storeResult(index, result);
      return result;
    } finally {
      setRunningIndex(null);
      setRunStage('');
    }
  };

  const handleRunCell = (index: number) => {
    if (isBusy) return;
    void executeCell(index, sessionRef.current);
  };

  const handleRunAll = async () => {
    if (isBusy) return;

    // Restart the Python kernel, then run every cell in order.
    sessionCounter += 1;
    sessionRef.current = sessionCounter;

    setResults(cells.map(() => null));
    setIsRunningAll(true);

    try {
      for (let index = 0; index < cells.length; index += 1) {
        const result = await executeCell(index, sessionRef.current);
        if (result.error) break;
      }
    } finally {
      setIsRunningAll(false);
    }
  };

  const handleReset = () => {
    if (isBusy) return;

    sessionCounter += 1;
    sessionRef.current = sessionCounter;

    setCells(entry.cells);
    setResults(entry.cells.map(() => null));
  };

  const handleClearOutputs = () => {
    if (isBusy) return;
    setResults(cells.map(() => null));
  };

  const handleDownload = () => {
    const program = cells.join('\n\n# %%\n\n');
    const blob = new Blob([program], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment_${experiment.experiment_number
      .toString()
      .padStart(2, '0')}.py`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Experiment ${experiment.experiment_number} notebook`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[94vh] sm:h-[92vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-4 sm:px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-bold uppercase tracking-wide">
                <Terminal className="w-3.5 h-3.5" />
                Notebook
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                EXP {experiment.experiment_number.toString().padStart(2, '0')}
              </span>
              <a
                href={entry.pdfPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md hover:bg-blue-500/20 transition-colors"
                title={`Open ${entry.sourceFile}`}
              >
                <FileText className="w-3 h-3" />
                {entry.sourceFile}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-bold text-white truncate">
              {experiment.title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {sections.length} sections · {cells.length} cells · each cell runs on its own and
              shares variables with the cells above it
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Close notebook"
            aria-label="Close notebook"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-mono font-bold text-slate-300">
              experiment_{experiment.experiment_number.toString().padStart(2, '0')}.py
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {totalLines} lines ·{' '}
              {activeSection === null
                ? `${cells.length} cells`
                : `${visibleCellCount} of ${cells.length} cells`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleRunAll}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-md text-[11px] font-bold transition-colors"
              title="Restart the kernel and run every cell in order"
            >
              {isRunningAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>{isRunningAll ? 'Running…' : 'Run All'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-semibold transition-colors"
              title="Download as .py"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>

            <button
              type="button"
              onClick={handleClearOutputs}
              disabled={isBusy || results.every((result) => result === null)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded-md text-[11px] font-semibold transition-colors"
              title="Clear all cell outputs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear outputs</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded-md text-[11px] font-semibold transition-colors"
              title="Restore the code from the PDF and restart the kernel"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Section tabs — A, B, C… exactly like the lab manual */}
        <div className="px-3 sm:px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleSelectSection(null)}
            aria-pressed={activeSection === null}
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
              activeSection === null
                ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
            title="Show every section"
          >
            All
            <span className="text-[10px] font-mono opacity-70">{cells.length}</span>
          </button>

          <span className="shrink-0 w-px h-4 bg-slate-800 mx-0.5" aria-hidden="true" />

          {sections.map((section) => {
            const isActive = activeSection === section.label;
            return (
              <button
                key={section.label}
                type="button"
                onClick={() => handleSelectSection(section.label)}
                aria-pressed={isActive}
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors max-w-[18rem] ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
                title={`Section ${section.label} · ${section.title}`}
              >
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold ${
                    isActive
                      ? 'bg-emerald-500/25 text-emerald-200'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {section.label}
                </span>
                <span className="truncate hidden sm:inline">{section.title}</span>
                <span className="text-[10px] font-mono opacity-60">
                  {section.cellIndices.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cells, divided into sections */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto bg-slate-950 p-3 sm:p-4 space-y-5"
        >
          {visibleSections.map((section) => (
            <section
              key={`section-${section.label}`}
              className="space-y-2.5"
              aria-label={`Section ${section.label}: ${section.title}`}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold shrink-0">
                  {section.label}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 truncate">
                  {section.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {section.cellIndices.length}{' '}
                  {section.cellIndices.length === 1 ? 'cell' : 'cells'}
                </span>
                <span className="flex-1 h-px bg-slate-800" aria-hidden="true" />
              </div>

              {section.cellIndices.map((index) => (
                <NotebookCell
                  key={index}
                  index={index}
                  code={cells[index]}
                  onChange={(value) => updateCell(index, value)}
                  onRun={() => handleRunCell(index)}
                  running={runningIndex === index}
                  disabled={isBusy}
                  result={results[index]}
                  stage={runStage}
                />
              ))}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
            Python runs in your browser via Pyodide · first run downloads the runtime and
            packages from a CDN
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
