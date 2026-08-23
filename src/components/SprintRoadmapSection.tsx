import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DiagnosticResult, SprintMilestone, SprintTask } from '../types';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Code2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';

interface SprintRoadmapSectionProps {
  onOpenUploadWithSprintTask?: (task: SprintTask, milestoneTitle: string) => void;
  onNavigateToDiagnostic: () => void;
}

export const SprintRoadmapSection: React.FC<SprintRoadmapSectionProps> = ({
  onOpenUploadWithSprintTask,
  onNavigateToDiagnostic
}) => {
  const { user, token } = useAuth();
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCodeTaskId, setExpandedCodeTaskId] = useState<string | null>(null);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const fetchDiagnostic = async () => {
    try {
      const res = await fetch('/api/diagnostic/latest', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setDiagnostic(data.diagnostic);
      }
    } catch (e) {
      console.error('Failed to fetch sprint roadmap:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostic();
  }, [user]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!token) return;
    const newStatus = !currentStatus;

    if (newStatus) {
      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    try {
      const res = await fetch('/api/diagnostic/update-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, completed: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnostic(data.diagnostic);
      }
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  const handleCopyCode = (taskId: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedTaskId(taskId);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  const milestones: SprintMilestone[] = diagnostic?.roadmap30Days || [];
  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Actionable 30-Day Practical Sprint Roadmap
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Project-Based Uplift
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Replaces 6-month generic theoretical courses with targeted 30-day milestone projects directly matching live industry job requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDiagnostic}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Re-evaluate AST Gaps</span>
          </button>
        </div>
      </div>

      {/* Progress & Milestone Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                30-Day Sprint Completion Progress
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {completedTasks} of {totalTasks} Practical Deliverables Completed
              </h3>
            </div>
            <span className="text-2xl font-black text-emerald-600">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 p-0.5 mt-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Every completed deliverable automatically updates your candidate AST score and increases interview clearance rate up to 85%.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Role Benchmark</span>
          <div className="my-2">
            <div className="text-sm font-bold text-slate-900 truncate">
              {diagnostic?.targetJobTitle || 'Cloud Native Backend Engineer'}
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5">
              Live Fit Score: {diagnostic?.overallFitScore || 84}%
            </div>
          </div>
          <span className="text-[11px] text-slate-500">
            Based on high-dimensional Cosine Delta matching
          </span>
        </div>
      </div>

      {/* 4-Week Milestone Cards */}
      <div className="space-y-6">
        {milestones.map((milestone) => {
          const milestoneComplete = milestone.tasks.every(t => t.completed);

          return (
            <div
              key={milestone.week}
              className={`rounded-2xl border transition-all overflow-hidden shadow-xs ${
                milestoneComplete
                  ? 'bg-white border-emerald-200 shadow-emerald-500/5'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Milestone Header */}
              <div className="p-5 md:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      milestoneComplete
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    W{milestone.week}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{milestone.weekTitle}</h3>
                      {milestoneComplete && (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Sprint Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{milestone.goal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    {milestone.tasks.filter(t => t.completed).length}/{milestone.tasks.length} Done
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-5 md:p-6 space-y-4">
                {milestone.tasks.map((task) => {
                  const isCodeExpanded = expandedCodeTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id, task.completed)}
                            className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5 ${
                              task.completed
                                ? 'text-emerald-600 hover:text-emerald-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title={task.completed ? 'Mark as incomplete' : 'Mark task completed'}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-semibold ${
                                  task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.verifiedGalleryItemId && (
                                <span className="text-[10px] px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                                  Portfolio Linked ✓
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                            <div className="text-xs text-slate-700 flex items-center gap-1.5 pt-1">
                              <span className="text-slate-500 font-medium">Deliverable:</span>
                              <span className="text-emerald-700 font-mono font-medium">{task.deliverable}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons on task */}
                        <div className="flex items-center gap-2 shrink-0">
                          {task.starterSnippet && (
                            <button
                              type="button"
                              onClick={() => setExpandedCodeTaskId(isCodeExpanded ? null : task.id)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{isCodeExpanded ? 'Hide Code' : 'Starter Code'}</span>
                              {isCodeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}

                          {onOpenUploadWithSprintTask && (
                            <button
                              type="button"
                              onClick={() => onOpenUploadWithSprintTask(task, milestone.weekTitle)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              title="Publish this milestone project to your gallery"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>To Gallery</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Code Snippet Drawer */}
                      {isCodeExpanded && task.starterSnippet && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono relative group">
                          <div className="flex items-center justify-between mb-2 text-slate-400 border-b border-slate-800/80 pb-1.5">
                            <span className="text-[11px] font-semibold text-slate-300">Implementation Reference Snippet:</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(task.id, task.starterSnippet!)}
                              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                            >
                              {copiedTaskId === task.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Snippet</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {task.starterSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
