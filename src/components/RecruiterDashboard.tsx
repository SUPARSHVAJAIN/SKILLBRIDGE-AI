import React, { useState, useEffect } from 'react';
import { GalleryItem, User } from '../types';
import {
  Building,
  Search,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  Mail,
  Filter,
  Sparkles,
  Layers,
  Check,
  Cpu
} from 'lucide-react';

interface RecruiterDashboardProps {
  onInspectProject: (project: GalleryItem) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  onInspectProject
}) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [invitedCandidateId, setInvitedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/recruiter-candidates')
      .then(res => res.json())
      .then(data => setCandidates(data.candidates || []))
      .catch(e => console.error('Failed to load candidate pool:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSendInterviewInvite = (candidateId: string) => {
    setInvitedCandidateId(candidateId);
    setTimeout(() => setInvitedCandidateId(null), 3000);
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.headline.toLowerCase().includes(search.toLowerCase()) ||
    (c.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Recruiter & Technical Talent Match Platform
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              Zero-Resume Guesswork
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Discover software engineering candidates with verified hands-on AST capabilities, containerized repositories, and benchmarked project galleries.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, Docker, Redis..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Recruiter Value Banner */}
      <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">AST Verified Candidate Pipelines</h2>
            <p className="text-xs text-slate-600">
              Directly inspect real repository code syntax trees, multi-stage Docker builds, and test suites passing in CI pipelines.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs text-purple-800 font-semibold bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>85% Rejection Reduction Verified</span>
        </div>
      </div>

      {/* Candidate List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-60 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No candidates match the specified filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs space-y-6"
            >
              {/* Candidate Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={candidate.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg font-bold text-slate-900">{candidate.name}</h2>
                      <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> AST Verified Candidate
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{candidate.headline}</p>
                    <span className="text-[11px] text-slate-500">{candidate.universityOrCompany}</span>
                  </div>
                </div>

                {/* Score badge & Invite button */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Overall Fit Score</span>
                    <span className="text-2xl font-black text-purple-700">{candidate.overallFitScore}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendInterviewInvite(candidate.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {invitedCandidateId === candidate.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Interview Request Sent!</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Invite to Fast-Track Screen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Skills Pill */}
              <div className="flex flex-wrap gap-1.5">
                {(candidate.skills || []).map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Verified Project Gallery Snippets */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Verified Engineering Portfolio Projects
                  </span>
                  <span className="text-[11px] text-slate-500">{candidate.topProjects?.length || 0} Projects Available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {candidate.topProjects?.map((proj: GalleryItem) => (
                    <div
                      key={proj.id}
                      onClick={() => onInspectProject(proj)}
                      className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-2 group shadow-xs"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={proj.coverImage || (proj.images && proj.images[0])}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/95 text-indigo-700 font-bold text-[10px] border border-indigo-200 shadow-xs">
                          AST {proj.astScore}/100
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {proj.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{proj.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
