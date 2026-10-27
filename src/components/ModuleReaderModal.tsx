import React, { useState, useEffect, useRef } from 'react';
import { TextbookModule, ModuleChapter, ModuleNoteUpload } from '../types';
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Upload,
  FileText,
  Search,
  HelpCircle,
  Eye,
  Download,
  AlertCircle,
  Menu,
} from 'lucide-react';

interface ModuleReaderModalProps {
  module: TextbookModule | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (moduleId: string, isCompleted: boolean) => void;
  onUploadNote: (note: ModuleNoteUpload) => void;
  onNavigateToLab?: (expNumber: number) => void;
  userId: string;
}

export const ModuleReaderModal: React.FC<ModuleReaderModalProps> = ({
  module,
  isOpen,
  onClose,
  onToggleComplete,
  onUploadNote,
  onNavigateToLab,
  userId,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadNote, setShowUploadNote] = useState(false);
  const [selectedNoteFile, setSelectedNoteFile] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewingNote, setPreviewingNote] = useState<ModuleNoteUpload | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (module) {
      setCurrentChapterIndex(0);
      setRevealedAnswers({});
      setShowUploadNote(false);
      setPreviewingNote(null);
      // Check if current module/chapter was bookmarked
      const savedBookmark = localStorage.getItem(`mbu_bookmark_${module.id}`);
      setIsBookmarked(!!savedBookmark);
    }
  }, [module]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentChapterIndex]);

  if (!isOpen || !module) return null;

  const currentChapter: ModuleChapter | undefined = module.chapters[currentChapterIndex] || module.chapters[0];
  const totalChapters = module.chapters.length;
  const isCompleted = module.is_completed || false;

  const handleToggleBookmark = () => {
    const key = `mbu_bookmark_${module.id}`;
    if (isBookmarked) {
      localStorage.removeItem(key);
      setIsBookmarked(false);
    } else {
      localStorage.setItem(key, JSON.stringify({
        moduleId: module.id,
        chapterIndex: currentChapterIndex,
        timestamp: new Date().toISOString(),
      }));
      setIsBookmarked(true);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  const toggleAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    const isPdf = file.name.endsWith('.pdf');
    const isTxt = file.name.endsWith('.txt');

    if (!allowed.includes(file.type) && !isDocx && !isPdf && !isTxt) {
      setUploadError('Supported file types: PDF, TXT, DOCX files.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File exceeds 20MB limit.');
      return;
    }

    setSelectedNoteFile(file);
    if (!noteTitle) {
      setNoteTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSaveUploadedNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoteFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newNote: ModuleNoteUpload = {
        id: `note-${Date.now()}`,
        module_id: module.id,
        chapter_id: currentChapter?.id,
        user_id: userId,
        file_name: selectedNoteFile.name,
        file_type: selectedNoteFile.type || (selectedNoteFile.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
        file_size: selectedNoteFile.size,
        file_data: result,
        uploaded_at: new Date().toISOString(),
        notes: noteTitle,
      };

      onUploadNote(newNote);
      setSelectedNoteFile(null);
      setNoteTitle('');
      setShowUploadNote(false);
    };

    if (selectedNoteFile.name.endsWith('.txt')) {
      reader.readAsText(selectedNoteFile);
    } else {
      reader.readAsDataURL(selectedNoteFile);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        {/* Textbook Navigation Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              title="Table of Contents"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="p-2 bg-blue-600/30 text-blue-300 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  Module {module.module_number}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• {module.edition}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {module.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* Mark as Completed Button */}
            <button
              onClick={() => onToggleComplete(module.id, !isCompleted)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              aria-label="Close textbook"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Textbook Main Layout: Table of Contents Sidebar + Reader Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Table of Contents Sidebar */}
          <aside
            className={`w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 z-30 absolute md:relative inset-y-0 left-0 ${
              sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="p-4 border-b border-slate-200/80 bg-white">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Table of Contents</span>
                <span className="text-[11px] font-mono text-slate-500">{totalChapters} Chapters</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{module.subtitle}</p>

              {/* Reading Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Reading Progress</span>
                  <span>{module.progress_percent || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${module.progress_percent || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {module.chapters.map((chap, idx) => {
                const isCurrent = idx === currentChapterIndex;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {chap.chapter_number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{chap.title}</div>
                      <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>{chap.reading_time_mins} mins</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions: Upload Notes & Linked Lab */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              <button
                onClick={() => setShowUploadNote(true)}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Study Notes</span>
              </button>

              {module.linked_experiment_number && onNavigateToLab && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToLab(module.linked_experiment_number!);
                  }}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-blue-200/60"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                  <span>Open Lab Exp #{module.linked_experiment_number}</span>
                </button>
              )}
            </div>
          </aside>

          {/* Reader Main Content Area */}
          <main
            ref={contentScrollRef}
            className="flex-1 bg-white overflow-y-auto p-4 sm:p-8 md:p-10 space-y-8"
          >
            {/* Chapter Header */}
            {currentChapter && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
                    <span>CHAPTER {currentChapter.chapter_number} OF {totalChapters}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {currentChapter.reading_time_mins} minutes read
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {currentChapter.title}
                  </h1>

                  {/* Subheadings list */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentChapter.subheadings.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700"
                      >
                        § {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formal Definition Callout Box */}
                {currentChapter.definition && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 border-l-4 border-blue-600 rounded-r-xl space-y-1 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                      <span>Formal Academic Definition — {currentChapter.definition.term}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                      "{currentChapter.definition.explanation}"
                    </p>
                  </div>
                )}

                {/* Chapter Markdown / Prose Content */}
                <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                  {currentChapter.content_markdown.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Code Snippets Section */}
                {currentChapter.code_snippets && currentChapter.code_snippets.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>Hands-on Code Implementation</span>
                    </h3>

                    {currentChapter.code_snippets.map((snip, snipIdx) => {
                      const snippetId = `snip-${currentChapter.id}-${snipIdx}`;
                      const isCopied = copiedCodeSnippet === snippetId;
                      return (
                        <div key={snipIdx} className="rounded-xl overflow-hidden border border-slate-800 shadow-md bg-slate-950">
                          <div className="px-4 py-2 bg-slate-900 flex items-center justify-between border-b border-slate-800 text-xs">
                            <span className="font-mono text-slate-300 font-semibold">{snip.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                                {snip.language.toUpperCase()}
                              </span>
                              <button
                                onClick={() => handleCopyCode(snip.code, snippetId)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                            <code>{snip.code}</code>
                          </pre>
                          {snip.output && (
                            <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Execution Console Output:
                              </div>
                              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                                {snip.output}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SVG Visual Diagram */}
                {currentChapter.diagram_svg && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Architectural Diagram &amp; Schematic
                    </h3>
                    <div
                      className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs bg-slate-900 p-2"
                      dangerouslySetInnerHTML={{ __html: currentChapter.diagram_svg }}
                    />
                  </div>
                )}

                {/* Key Concepts Summary Card */}
                {currentChapter.summary_bullets && (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Chapter Summary Takeaways</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                      {currentChapter.summary_bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Practice Questions */}
                {currentChapter.practice_questions && currentChapter.practice_questions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Self-Assessment &amp; Practice Questions
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {currentChapter.practice_questions.map((q, qIdx) => {
                        const isRevealed = !!revealedAnswers[q.id];
                        return (
                          <div
                            key={q.id || qIdx}
                            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                          >
                            <div className="text-xs sm:text-sm font-semibold text-slate-900">
                              Q{qIdx + 1}. {q.question}
                            </div>
                            {isRevealed ? (
                              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1 animate-in fade-in">
                                <div className="font-bold text-emerald-900">Answer: {q.answer}</div>
                                <div className="text-emerald-800 leading-relaxed">{q.explanation}</div>
                              </div>
                            ) : null}
                            <button
                              onClick={() => toggleAnswer(q.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                            >
                              {isRevealed ? 'Hide Explanation' : 'Reveal Answer & Explanation'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chapter Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentChapterIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentChapterIndex === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-xs text-slate-500 font-medium">
                    {currentChapterIndex + 1} / {totalChapters}
                  </span>

                  <button
                    onClick={() => setCurrentChapterIndex((prev) => Math.min(totalChapters - 1, prev + 1))}
                    disabled={currentChapterIndex === totalChapters - 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors shadow-xs"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Upload Notes Modal Slide-over / Dialog */}
        {showUploadNote && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Upload Study Notes &amp; Handouts</span>
                </h3>
                <button
                  onClick={() => setShowUploadNote(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleSaveUploadedNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes Title / Description
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Chapter 1 Quick Revision Notes"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-6 rounded-xl text-center cursor-pointer bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {selectedNoteFile ? (
                    <div className="space-y-1">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedNoteFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(selectedNoteFile.size / 1024).toFixed(1)} KB • Ready to save
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-semibold text-slate-700">Click to select notes file</div>
                      <div className="text-[11px] text-slate-500">Supports PDF, TXT, DOCX (Max: 20MB)</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadNote(false)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedNoteFile}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Upload &amp; Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
