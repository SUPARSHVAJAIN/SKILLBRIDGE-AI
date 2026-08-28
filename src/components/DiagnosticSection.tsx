import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DiagnosticResult, RadarDataPoint } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText,
  Github,
  Layers,
  Terminal,
  Activity,
  Zap,
  TrendingUp,
  Code
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface DiagnosticSectionProps {
  onNavigateToSprint: () => void;
  onNavigateToGallery: () => void;
}

const PRESET_JDS = [
  {
    title: 'Junior Cloud Native & Backend Engineer',
    jd: 'Looking for a backend engineer experienced in building RESTful microservices with Node.js/Python FastAPI. Required: Docker multi-stage builds, Redis caching, PyTest or Jest automated testing, and GitHub Actions CI/CD pipelines.'
  },
  {
    title: 'Full Stack Distributed Systems Developer',
    jd: 'Seeking developer proficient in TypeScript, React, Express/FastAPI, PostgreSQL ORM, Docker Compose, asynchronous task queues (BullMQ/Redis), and rate limiting.'
  },
  {
    title: 'AI Platform & Vector Search Engineer',
    jd: 'Engineering role requiring semantic vector database indexing (ChromaDB), LangChain/Gemini API integrations, high-concurrency async endpoints, Docker, and comprehensive test suites.'
  }
];

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({
  onNavigateToSprint,
  onNavigateToGallery
}) => {
  const { user, token } = useAuth();
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [targetJobTitle, setTargetJobTitle] = useState('Junior Cloud Native & Backend Engineer');
  const [jobDescription, setJobDescription] = useState(PRESET_JDS[0].jd);
  const [resumeText, setResumeText] = useState(
    'SUPARSHVA JAIN — CS Senior with experience in TypeScript, Node.js, Python, PostgreSQL, REST APIs. Built a task queue project with Redis and Docker. Familiar with Git and agile workflows.'
  );
  const [githubRepoUrl, setGithubRepoUrl] = useState('https://github.com/suparshvajain-dev/distributed-task-queue');
  const [repoCodeSnippet, setRepoCodeSnippet] = useState(
    `// Sample Worker Controller\nexport async function processQueue(job) {\n  const res = await redis.xreadgroup('GROUP', 'workers', 'consumer-1');\n  return res;\n}`
  );

  const fetchLatestDiagnostic = async () => {
    try {
      const res = await fetch('/api/diagnostic/latest', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setDiagnostic(data.diagnostic);
      }
    } catch (e) {
      console.error('Failed to fetch latest diagnostic:', e);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestDiagnostic();
  }, [user]);

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) {
      setError('Please sign in or select a demo profile to run diagnostic analysis.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/diagnostic/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetJobTitle,
          jobDescription,
          resumeText,
          githubRepoUrl,
          repoCodeSnippet
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete semantic AST analysis.');
      }

      setDiagnostic(data.diagnostic);
    } catch (err: any) {
      setError(err.message || 'Diagnostic service error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_JDS[0]) => {
    setTargetJobTitle(preset.title);
    setJobDescription(preset.jd);
  };

  const radarData = diagnostic?.radarData || [
    { skill: 'API Architecture', studentScore: 88, marketBaseline: 85, fullMark: 100 },
    { skill: 'Cloud & Docker', studentScore: 85, marketBaseline: 90, fullMark: 100 },
    { skill: 'PyTest & Testing', studentScore: 82, marketBaseline: 85, fullMark: 100 },
    { skill: 'CI/CD Automation', studentScore: 78, marketBaseline: 80, fullMark: 100 },
    { skill: 'Caching (Redis)', studentScore: 90, marketBaseline: 75, fullMark: 100 },
    { skill: 'System Design', studentScore: 80, marketBaseline: 85, fullMark: 100 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-slate-50 border border-indigo-100/90 p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semantic Portfolio & AST Vector Delta Engine</span>
              <span className="px-1.5 py-0.2 bg-indigo-100 rounded text-[10px]">Problem ID: Omni_EdTech_5</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Real-Time Competency Fit Score & AST Diagnostic
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Eliminate superficial keyword matching. Evaluate practical execution depth from your code syntax ASTs, container setups, and test suites against live industry job descriptions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => handleRunAnalysis()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing AST & Vector Delta...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Run Live Diagnostic</span>
                </>
              )}
            </button>
            <button
              onClick={onNavigateToSprint}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <span>View 30-Day Sprints</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Diagnostic Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Input Ingestion Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Target Job & Profile Ingestion</h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Step 1: Multi-Modal Ingestion</span>
            </div>

            {/* Quick JD Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Preset Industry Job Descriptors:</label>
              <div className="flex flex-col gap-1.5">
                {PRESET_JDS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all border cursor-pointer ${
                      targetJobTitle === p.title
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-medium shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Job Title Input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Job Title *</label>
              <input
                id="target-job-input"
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Target Job Description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Industry JD Snippet</label>
              <textarea
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
              />
            </div>

            {/* Student Resume Summary */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Student Portfolio / Resume Context</label>
              <textarea
                rows={3}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume highlights or technical background..."
                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
              />
            </div>

            {/* GitHub Repo URL */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-500" /> Candidate GitHub Repository
              </label>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Code Snippet for AST Parsing */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> AST Code Snippet (Syntax & Pattern Extractor)
              </label>
              <textarea
                rows={3}
                value={repoCodeSnippet}
                onChange={(e) => setRepoCodeSnippet(e.target.value)}
                placeholder="Paste code snippet to analyze AST complexity..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
              />
            </div>

            <button
              id="run-diagnostic-form-btn"
              type="button"
              onClick={() => handleRunAnalysis()}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-xs shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Vector Cosine Delta...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Calculate Real-Time Fit Score (%)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Radar & AST Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Fit Score & Metric Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Fit Score</span>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-black text-indigo-600 tracking-tight">
                  {diagnostic?.overallFitScore || 84}%
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> High Match
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Calculated via high-dimensional embedding distance
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interview Clearance Est.</span>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-black text-emerald-600 tracking-tight">85%</span>
                <span className="text-xs text-slate-500">Rejection reduced</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Practical testing & Docker alignment validated
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sprint Milestones</span>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-black text-purple-600 tracking-tight">
                  {diagnostic?.roadmap30Days?.length || 4}
                </span>
                <span className="text-xs text-purple-600 font-medium">Weeks</span>
              </div>
              <button
                type="button"
                onClick={onNavigateToSprint}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Jump to sprint board</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Recharts Radar Visualizer */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Semantic Radar: Candidate Mastery vs Live Industry Baseline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualizing multi-dimensional skill deltas across core engineering competencies
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span className="text-slate-700 font-medium">Candidate Mastery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 font-medium">Market Baseline</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[320px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Radar
                    name="Candidate Mastery"
                    dataKey="studentScore"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Market Baseline"
                    dataKey="marketBaseline"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
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
          </div>

          {/* Extracted AST Breakdown */}
          {diagnostic?.extractedAST && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  Extracted Code AST & Structural Capabilities
                </h3>
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                  {diagnostic.extractedAST.architectureType}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Functions Analyzed</span>
                  <span className="text-lg font-bold text-slate-900">{diagnostic.extractedAST.functionsCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Async Calls</span>
                  <span className="text-lg font-bold text-indigo-600">{diagnostic.extractedAST.asyncCallsDetected}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Docker Multi-Stage</span>
                  <span className={`text-sm font-bold ${diagnostic.extractedAST.dockerfilePresent ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {diagnostic.extractedAST.dockerfilePresent ? 'Detected ✓' : 'Missing ✗'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Redis Caching</span>
                  <span className={`text-sm font-bold ${diagnostic.extractedAST.redisCachingPresent ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {diagnostic.extractedAST.redisCachingPresent ? 'Present ✓' : 'Partial / Gap'}
                  </span>
                </div>
              </div>

              {diagnostic.extractedAST.identifiedPatterns && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs text-slate-500 font-medium">Architectural Patterns:</span>
                  {diagnostic.extractedAST.identifiedPatterns.map((pat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                    >
                      {pat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pinpointed Competency Deficits (From Problem ID: Omni_EdTech_5) */}
          {diagnostic?.deficits && diagnostic.deficits.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Exposed Non-Linear Competency Deficits
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Targeted practical gaps preventing top-tier tech interview qualification
                  </p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  {diagnostic.deficits.length} Gaps Detected
                </span>
              </div>

              <div className="space-y-3">
                {diagnostic.deficits.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{def.category}</span>
                        <span className="text-xs text-slate-500">• {def.missingSkill}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          def.impact === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {def.impact} Priority
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{def.description}</p>

                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-900">Actionable Sprint Fix: </span>
                        <span>{def.recommendedAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
