import React, { useState } from 'react';
import { Experiment, ExperimentTool } from '../types';
import { Wrench, Terminal, Layers, BookOpen, Search, CheckCircle } from 'lucide-react';

interface ToolsPageProps {
  experiments: Experiment[];
  tools: ExperimentTool[];
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ experiments, tools }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', 'Language', 'Library', 'Framework', 'Environment'];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.tool_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `experiment ${tool.experiment_number}`.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Experiment Tools Used
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Programming environments, machine learning libraries, and computing frameworks across all 10 Data Science experiments
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold self-start sm:self-auto">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Structured Tool Catalog</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools (e.g. Python, Scikit-learn, NumPy, Pandas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structured 10 Experiments Tools List */}
      <div className="space-y-6">
        {experiments.map((exp) => {
          // Get tools associated with this experiment number
          const expTools = filteredTools.filter(
            (t) => t.experiment_number === exp.experiment_number
          );

          if (expTools.length === 0 && (searchQuery || selectedCategory !== 'All')) {
            return null;
          }

          return (
            <div
              key={exp.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-sm"
            >
              {/* Experiment Banner */}
              <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-blue-900 text-white rounded-md text-xs font-bold font-mono tracking-tight">
                    EXPERIMENT {exp.experiment_number}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    {exp.title}
                  </h2>
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
                  <span>{expTools.length} Tools Specified</span>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {tool.category === 'Language' ? (
                            <Terminal className="w-4 h-4 text-amber-600" />
                          ) : tool.category === 'Framework' ? (
                            <Layers className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Wrench className="w-4 h-4 text-blue-600" />
                          )}
                          <h3 className="font-bold text-sm text-slate-900">
                            {tool.tool_name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                          {tool.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {tool.purpose}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
                      Data Science Standard Library
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
