import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface UniversityDashboardProps {
  onNavigateToDiagnostic: () => void;
}

export const UniversityDashboard: React.FC<UniversityDashboardProps> = ({
  onNavigateToDiagnostic
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/university-batch')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.error('Failed to load batch stats:', e))
      .finally(() => setLoading(false));
  }, []);

  const radarData = stats?.cohortRadar || [
    { skill: 'API Architecture', studentScore: 84, marketBaseline: 85, fullMark: 100 },
    { skill: 'Cloud & Docker', studentScore: 68, marketBaseline: 90, fullMark: 100 },
    { skill: 'PyTest & Testing', studentScore: 62, marketBaseline: 85, fullMark: 100 },
    { skill: 'CI/CD Automation', studentScore: 59, marketBaseline: 80, fullMark: 100 },
    { skill: 'Caching (Redis)', studentScore: 71, marketBaseline: 75, fullMark: 100 },
    { skill: 'System Design', studentScore: 78, marketBaseline: 85, fullMark: 100 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              University Training & Placement (T&P) Cell Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Batch Readiness
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Access macro data analytics on cohort-wide AST skill readiness to update university elective syllabi and eliminate corporate retraining periods.
          </p>
        </div>

        <button
          onClick={onNavigateToDiagnostic}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Inspect Student AST Engine</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled Batch Size</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.batchSize || 450}</div>
          <span className="text-[11px] text-emerald-700 font-medium">382 Active Diagnostic Submissions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Interview Clearance Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats?.interviewClearanceRate || '85.4%'}</div>
          <span className="text-[11px] text-slate-500">vs 22.0% Traditional Placement</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average AST Fit Score</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">{stats?.averageFitScore || 82.5}%</div>
          <span className="text-[11px] text-slate-500">Across 6 Core Vector Axes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Projects in DB</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{stats?.verifiedProjectsCount || '1,243'}</div>
          <span className="text-[11px] text-emerald-700 font-medium">100% AST Syntax Verified</span>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Curriculum Upgrades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Batch-Wide Skill Gap Radar</h2>
              <p className="text-xs text-slate-500">Comparing 2026 CS Batch average against live tech market baseline</p>
            </div>
          </div>

          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Cohort Average"
                  dataKey="studentScore"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Market Target"
                  dataKey="marketBaseline"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> High Deficit Alert:
            </span>
            <p>
              Cohort exhibits a 31% delta in CI/CD Automation and a 23% deficit in PyTest & Automated Regression fixtures.
            </p>
          </div>
        </div>

        {/* Actionable Curriculum Upgrades (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Real-Time Syllabus & Elective Modernization
              </h2>
              <p className="text-xs text-slate-500">Automated recommendations derived from vector delta deficits</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats?.curriculumRecommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 font-mono">{rec.module}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase">
                    {rec.urgency}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-0.5">Identified Gap:</span>
                  <p className="text-xs text-slate-600">{rec.identifiedDeficit}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900">
                  <span className="font-bold text-indigo-800">Action Plan: </span>
                  <span>{rec.action}</span>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Transformational Stakeholder Outcome:
              </span>
              <p className="text-slate-600 leading-relaxed">
                Traditional Training & Placement cells rely on historic placement metrics and generic workshops. With SkillBridge AI, universities access live data radars on batch skill readiness and dynamically update elective modules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
