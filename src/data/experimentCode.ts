import exp1 from './experiment-code/exp1.py?raw';
import exp2 from './experiment-code/exp2.py?raw';
import exp3 from './experiment-code/exp3.py?raw';
import exp4 from './experiment-code/exp4.py?raw';
import exp5 from './experiment-code/exp5.py?raw';
import exp6 from './experiment-code/exp6.py?raw';
import exp7 from './experiment-code/exp7.py?raw';
import exp8 from './experiment-code/exp8.py?raw';
import exp9 from './experiment-code/exp9.py?raw';
import exp10 from './experiment-code/exp10.py?raw';

import type { ExecutionOutput } from '../types';

export interface NotebookSection {
  /** Short tab label shown above the notebook, e.g. "A". */
  label: string;
  /** Section title read from the cell comment, e.g. "Reading and Writing CSV Data". */
  title: string;
  /** Indices into `ExperimentCodeEntry.cells` covered by this section. */
  cellIndices: number[];
}

export interface ExperimentCodeEntry {
  /** PDF in the public/pdfs folder this program was taken from. */
  sourceFile: string;
  /** Public URL of the PDF so it can be opened from the editor. */
  pdfPath: string;
  /** Full Python program written in the lab manual. */
  code: string;
  /** Notebook cells, split on the `# %%` markers used by Jupyter. */
  cells: string[];
  /** Cells grouped into the A, B, C… sections of the lab manual. */
  sections: NotebookSection[];
}

/** Split a program into notebook-style cells on `# %%` marker lines. */
export function splitNotebookCells(code: string): string[] {
  const cells = code
    .split(/^# %%.*$/m)
    .map((cell) => cell.replace(/^\n+/, '').trimEnd())
    .filter((cell) => cell.trim().length > 0);

  // A leading cell that only holds the file header is merged into the first
  // real cell, so the notebook does not start with an empty cell.
  if (cells.length > 1) {
    const isCommentOnly = cells[0]
      .split('\n')
      .every((line) => !line.trim() || line.trim().startsWith('#'));

    if (isCommentOnly) {
      return [`${cells[0]}\n\n${cells[1]}`, ...cells.slice(2)];
    }
  }

  return cells;
}

/** 0 -> A, 1 -> B, … 25 -> Z, 26 -> AA (used when a cell has no letter). */
function sectionLabel(index: number): string {
  let value = index;
  let label = '';

  do {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return label;
}

/** Comment lines that are decoration or document headers, not section titles. */
function isSkippableComment(line: string): boolean {
  return (
    /^#\s*[-=]{3,}\s*$/.test(line) ||
    /^#\s*Data Science\b/i.test(line) ||
    /^#\s*Experiment\s+\d+\b/i.test(line) ||
    /^#\s*$/.test(line)
  );
}

function extractSectionHeading(
  cell: string,
  fallbackLabel: string
): { label: string; title: string } {
  for (const rawLine of cell.split('\n')) {
    const line = rawLine.trim();
    if (!line.startsWith('#') || isSkippableComment(line)) continue;

    // "a. Reading and Writing CSV Data" -> A / Reading and Writing CSV Data
    const letterMatch = line.match(/^#\s*([A-Za-z])[.)]\s+(.+)$/);
    if (letterMatch) {
      return {
        label: letterMatch[1].toUpperCase(),
        title: letterMatch[2].trim(),
      };
    }

    // "1. Matplotlib - Line Plot" -> keeps the generated letter as the label
    const numberedMatch = line.match(/^#\s*\d+(?:\.\d+)*[.)]?\s+(.+)$/);
    if (numberedMatch) {
      return { label: fallbackLabel, title: numberedMatch[1].trim() };
    }

    return { label: fallbackLabel, title: line.replace(/^#\s*/, '').trim() };
  }

  return { label: fallbackLabel, title: `Section ${fallbackLabel}` };
}

/**
 * Group cells into the A, B, C… sections the lab manual uses. Every cell has
 * its own heading, so each section maps to one (or more) cell indices.
 */
export function buildNotebookSections(cells: string[]): NotebookSection[] {
  const sections: NotebookSection[] = [];

  cells.forEach((cell, index) => {
    const fallbackLabel = sectionLabel(index);
    const { label, title } = extractSectionHeading(cell, fallbackLabel);
    const previous = sections[sections.length - 1];

    // Consecutive cells that repeat the same heading stay in one section.
    if (previous && previous.label === label) {
      previous.cellIndices.push(index);
      // The leading header/import cell has no title of its own; take the
      // heading from the cell that follows it.
      if (/^Section [A-Z]+$/.test(previous.title) && !/^Section [A-Z]+$/.test(title)) {
        previous.title = title;
      }
      return;
    }

    sections.push({ label, title, cellIndices: [index] });
  });

  // Guarantee unique, readable tab labels even if the PDF repeats a heading.
  const used = new Set<string>();

  return sections.map((section, index) => {
    let label = section.label;
    if (!label || used.has(label)) label = sectionLabel(index);
    used.add(label);
    return { ...section, label };
  });
}

function buildEntry(sourceFile: string, code: string): ExperimentCodeEntry {
  const cells = splitNotebookCells(code);

  return {
    sourceFile,
    pdfPath: `/pdfs/${sourceFile}`,
    code,
    cells,
    sections: buildNotebookSections(cells),
  };
}

export const EXPERIMENT_CODE: Record<number, ExperimentCodeEntry> = {
  1: buildEntry('exp1.pdf', exp1),
  2: buildEntry('exp2.pdf', exp2),
  3: buildEntry('exp3.pdf', exp3),
  4: buildEntry('exp4.pdf', exp4),
  5: buildEntry('exp5.pdf', exp5),
  6: buildEntry('exp6.pdf', exp6),
  7: buildEntry('exp7.pdf', exp7),
  8: buildEntry('exp8.pdf', exp8),
  9: buildEntry('exp9.pdf', exp9),
  10: buildEntry('exp10.pdf', exp10),
};

export function getExperimentCode(experimentNumber: number): ExperimentCodeEntry {
  return (
    EXPERIMENT_CODE[experimentNumber] ?? {
      sourceFile: `exp${experimentNumber}.pdf`,
      pdfPath: `/pdfs/exp${experimentNumber}.pdf`,
      code: `# No lab program found for Experiment ${experimentNumber}.`,
      cells: [`# No lab program found for Experiment ${experimentNumber}.`],
      sections: [
        {
          label: 'A',
          title: `Experiment ${experimentNumber}`,
          cellIndices: [0],
        },
      ],
    }
  );
}

const LAB_PDF_SIZES: Record<number, number> = {
  1: 72361,
  2: 140575,
  3: 70126,
  4: 83009,
  5: 587416,
  6: 472878,
  7: 165363,
  8: 615100,
  9: 146983,
  10: 210693,
};

/**
 * Lab manual PDF bundled in public/pdfs, used as the card's document when the
 * database has no saved execution output for the experiment.
 */
export function createLabManualOutput(
  experimentNumber: number,
  experimentId: string,
  userId: string
): ExecutionOutput {
  return {
    id: `lab-manual-${experimentNumber}`,
    experiment_id: experimentId,
    user_id: userId,
    file_name: `exp${experimentNumber}.pdf`,
    file_type: 'application/pdf',
    file_size: LAB_PDF_SIZES[experimentNumber] ?? 0,
    file_url: `/pdfs/exp${experimentNumber}.pdf`,
    uploaded_at: new Date().toISOString(),
  };
}
