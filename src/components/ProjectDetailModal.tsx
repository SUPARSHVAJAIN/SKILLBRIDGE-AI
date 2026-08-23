import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Github, ExternalLink, ShieldCheck, Heart, Share2, Layers, Cpu, CheckCircle2, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GalleryItem | null;
  onLikeToggle?: (projectId: string) => void;
  onEditRequest?: (project: GalleryItem) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  onLikeToggle,
  onEditRequest
}) => {
  const { user } = useAuth();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !project) return null;

  const isOwner = user?.id === project.userId;
  const isLiked = project.likedBy?.includes(user?.id || '');

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="project-detail-modal-card"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-800 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img
              src={project.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={project.authorName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{project.authorName}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                  {project.category}
                </span>
                {project.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> AST Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">Published on {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && onEditRequest && (
              <button
                type="button"
                onClick={() => onEditRequest(project)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Edit Project
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyShare}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share project link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Gallery Image Carousel */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[16/9] max-h-[380px] group shadow-xs">
            <img
              src={images[activeImageIdx]}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white border border-slate-200 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-slate-800 hover:bg-white border border-slate-200 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full border border-slate-200 shadow-xs">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        activeImageIdx === idx ? 'bg-indigo-600 w-4' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Title & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.title}</h1>
              <p className="text-sm text-slate-600 mt-1">{project.summary}</p>
            </div>
            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-all cursor-pointer shadow-xs"
                >
                  <Github className="w-4 h-4" /> View Code Repository
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {onLikeToggle && (
                <button
                  type="button"
                  onClick={() => onLikeToggle(project.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{project.likesCount || 0}</span>
                </button>
              )}
            </div>
          </div>

          {/* AST & Production Readiness Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">AST Index Score</span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{project.astScore}<span className="text-xs text-slate-400 font-normal">/100</span></div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${project.astScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Test Coverage</span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">{project.astBreakdown?.testCoverageEst || 88}%</div>
              <span className="text-[11px] text-slate-500 mt-1">Automated suite verification</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Containerized</span>
                <Layers className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {project.astBreakdown?.containerized ? 'Docker Ready' : 'Non-Containerized'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1">Multi-stage alpine build</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Caching & CI/CD</span>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {project.astBreakdown?.cachingImplemented ? 'Redis & GitHub Actions' : 'Standard Pipeline'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1">High-throughput caching</span>
            </div>
          </div>

          {/* Description & Architecture Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Architecture & Technical Execution</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Key Execution Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {project.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verifiable Benchmark Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Verifiable System Metrics</h3>
              <div className="flex flex-wrap gap-3">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 block">{m.name}</span>
                    <span className="text-lg font-bold text-emerald-700">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Technologies Used</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
