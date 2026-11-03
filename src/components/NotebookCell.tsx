import React, { useRef } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Play, XCircle } from 'lucide-react';
import { PythonRunResult } from '../services/pythonRunner';

interface NotebookCellProps {
  index: number;
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
  disabled: boolean;
  result: PythonRunResult | null;
  stage: string;
}

export const NotebookCell: React.FC<NotebookCellProps> = ({
  index,
  code,
  onChange,
  onRun,
  running,
  disabled,
  result,
  stage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;
  const visibleRows = Math.max(3, Math.min(lineCount, 16));
  const hasError = Boolean(result?.error);
  const succeeded = Boolean(result) && !hasError;

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const handleTab = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const indent = '    ';

    onChange(code.slice(0, start) + indent + code.slice(end));

    window.requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.selectionStart = start + indent.length;
      textareaRef.current.selectionEnd = start + indent.length;
    });
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Cell header */}
      <div className="px-3 sm:px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-mono font-bold text-slate-400">
            In [{running ? '*' : result ? index + 1 : ' '}]:
          </span>
          <span className="text-[11px] font-semibold text-slate-300">
            Cell {index + 1}
          </span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </span>
          {running ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : hasError ? (
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          ) : succeeded ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : null}
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-[11px] font-bold transition-colors shrink-0"
          title={`Run cell ${index + 1}`}
        >
          {running ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          <span>{running ? 'Running…' : 'Run cell'}</span>
        </button>
      </div>

      {/* Editor */}
      <div className="flex bg-slate-950">
        <div
          ref={gutterRef}
          className="shrink-0 w-10 sm:w-12 py-3 bg-slate-900/70 border-r border-slate-800 overflow-hidden select-none text-right"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, lineIndex) => (
            <div
              key={lineIndex}
              className="h-5 leading-5 pr-2 text-[11px] font-mono text-slate-600"
            >
              {lineIndex + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={code}
          onChange={(event) => onChange(event.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleTab}
          disabled={disabled}
          spellCheck={false}
          wrap="off"
          style={{ height: `${visibleRows * 20 + 24}px` }}
          className="flex-1 min-w-0 resize-none bg-transparent text-slate-100 px-3 py-3 text-[12.5px] leading-5 font-mono focus:outline-hidden caret-emerald-400 selection:bg-blue-600/40 disabled:opacity-60"
          aria-label={`Python code for cell ${index + 1}`}
        />
      </div>

      {/* Cell output */}
      {(running || result) && (
        <div className="border-t border-slate-800 bg-slate-950/80 px-3 sm:px-4 py-3 space-y-2 font-mono text-[11.5px]">
          {running && (
            <div className="flex items-center gap-2 text-slate-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
              <span>{stage || 'Running…'}</span>
            </div>
          )}

          {result?.warnings.map((warning, warningIndex) => (
            <div
              key={`warning-${warningIndex}`}
              className="flex items-start gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-2.5 py-1.5 whitespace-pre-wrap break-words"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          ))}

          {result?.stdout && (
            <pre className="whitespace-pre-wrap break-words text-slate-200">
              {result.stdout}
            </pre>
          )}

          {result?.error && (
            <pre className="whitespace-pre-wrap break-words text-red-400">
              {result.error}
            </pre>
          )}

          {result?.figures.map((figure, figureIndex) => (
            <img
              key={`figure-${figureIndex}`}
              src={`data:image/png;base64,${figure}`}
              alt={`Figure ${figureIndex + 1} produced by cell ${index + 1}`}
              className="max-w-full max-h-80 object-contain rounded-lg border border-slate-700 bg-white"
            />
          ))}

          {result &&
            !result.stdout &&
            !result.error &&
            result.figures.length === 0 &&
            result.warnings.length === 0 && (
              <div className="text-slate-500 italic">Cell finished without output.</div>
            )}
        </div>
      )}
    </section>
  );
};
