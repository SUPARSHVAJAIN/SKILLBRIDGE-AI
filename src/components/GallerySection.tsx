import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  Heart,
  ExternalLink,
  Github,
  Edit,
  Trash2,
  Share2,
  CheckCircle2,
  Sparkles,
  Cpu,
  Eye,
  Check
} from 'lucide-react';

interface GallerySectionProps {
  onOpenUploadModal: () => void;
  onEditProject: (project: GalleryItem) => void;
  onViewProjectDetail: (project: GalleryItem) => void;
}

const CATEGORIES = [
  'All',
  'Full-Stack',
  'Cloud & DevOps',
  'AI & ML',
  'System Architecture',
  'Open Source',
  'Mobile'
];

export const GallerySection: React.FC<GallerySectionProps> = ({
  onOpenUploadModal,
  onEditProject,
  onViewProjectDetail
}) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (activeTab === 'my' && user) {
        queryParams.set('userId', user.id);
      }
      if (selectedCategory !== 'All') {
        queryParams.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        queryParams.set('search', searchQuery.trim());
      }

      const res = await fetch(`/api/gallery?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch gallery items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, [activeTab, selectedCategory, searchQuery, user]);

  const handleToggleLike = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;

    try {
      const res = await fetch(`/api/gallery/${itemId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(prev => prev.map(item => item.id === itemId ? data.item : item));
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleDeleteProject = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this project from your gallery?')) return;
    if (!token) return;

    try {
      const res = await fetch(`/api/gallery/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== itemId));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Personal Engineering Portfolio Gallery
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              Live Database
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Upload, edit, and showcase practical fullstack repositories, AST code quality matrices, and live microservice architectures.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Gallery</span>
              </>
            )}
          </button>
          <button
            id="gallery-add-project-btn"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Project</span>
          </button>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Tab switch: All vs My Portfolio */}
        <div className="flex items-center p-1 bg-slate-100/90 border border-slate-200 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Verified Projects ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'my'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Personal Gallery ({items.filter(i => i.userId === user?.id).length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, Redis, Docker, FastAPI, author..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === 'my'
              ? 'You have not uploaded any personal projects yet. Showcase your practical code AST and system architectures!'
              : 'Try selecting a different category or clearing your search keywords.'}
          </p>
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((project) => {
            const isOwner = user?.id === project.userId;
            const isLiked = project.likedBy?.includes(user?.id || '');

            return (
              <div
                key={project.id}
                id={`gallery-item-${project.id}`}
                onClick={() => onViewProjectDetail(project)}
                className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Cover Image & Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.coverImage || (project.images && project.images[0])}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold border border-slate-200 shadow-xs">
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50/95 backdrop-blur-sm text-indigo-700 text-[11px] font-bold border border-indigo-200 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      AST: {project.astScore}/100
                    </span>
                  </div>

                  {/* Author Overlay on Bottom of Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={project.authorName}
                        className="w-6 h-6 rounded-full object-cover border border-white/80"
                      />
                      <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                        {project.authorName}
                      </span>
                    </div>
                    {project.verificationStatus === 'verified' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.summary || project.description}
                    </p>
                  </div>

                  {/* Benchmark Metrics Bar */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px]">
                      {project.metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx}>
                          <span className="text-slate-500 block truncate">{m.name}</span>
                          <span className="text-emerald-700 font-semibold truncate">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Bottom Footer Action Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(project.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          isLiked
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Applaud project"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
                        <span className="font-medium">{project.likesCount || 0}</span>
                      </button>

                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Open GitHub repo"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Open live demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isOwner && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditProject(project);
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewProjectDetail(project)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
