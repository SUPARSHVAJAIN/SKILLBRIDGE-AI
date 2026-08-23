import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Plus, Trash2, Code, ShieldCheck, Sparkles, Image as ImageIcon, ExternalLink, Github } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (item: GalleryItem) => void;
  projectToEdit?: GalleryItem | null;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80'
];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  projectToEdit
}) => {
  const { user, token } = useAuth();
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [summary, setSummary] = useState(projectToEdit?.summary || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [category, setCategory] = useState<GalleryItem['category']>(projectToEdit?.category || 'Full-Stack');
  const [tagsText, setTagsText] = useState((projectToEdit?.tags || ['TypeScript', 'Docker', 'REST API']).join(', '));
  const [repoUrl, setRepoUrl] = useState(projectToEdit?.repoUrl || user?.githubUrl ? `${user?.githubUrl}/new-service` : 'https://github.com/myusername/service');
  const [liveUrl, setLiveUrl] = useState(projectToEdit?.liveUrl || '');
  const [images, setImages] = useState<string[]>(projectToEdit?.images || [PRESET_COVERS[0]]);
  const [coverImage, setCoverImage] = useState(projectToEdit?.coverImage || PRESET_COVERS[0]);
  const [astScore, setAstScore] = useState<number>(projectToEdit?.astScore || 92);
  
  // AST breakdown
  const [testCoverage, setTestCoverage] = useState(projectToEdit?.astBreakdown?.testCoverageEst || 88);
  const [containerized, setContainerized] = useState(projectToEdit?.astBreakdown?.containerized ?? true);
  const [cachingImplemented, setCachingImplemented] = useState(projectToEdit?.astBreakdown?.cachingImplemented ?? true);
  const [ciCdPipelines, setCiCdPipelines] = useState(projectToEdit?.astBreakdown?.ciCdPipelines ?? true);

  // Key Features & Metrics
  const [features, setFeatures] = useState<string[]>(
    projectToEdit?.keyFeatures || [
      'Asynchronous worker architecture with Redis Stream consumer groups',
      'Automated integration test suites passing in CI pipeline',
      'Multi-stage Alpine Docker containerization with non-root user'
    ]
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  const [metrics, setMetrics] = useState<{ name: string; value: string }[]>(
    projectToEdit?.metrics || [
      { name: 'Throughput', value: '12.5k req/sec' },
      { name: 'Test Coverage', value: '92%' }
    ]
  );
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');

  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (result) {
            setImages(prev => [result, ...prev]);
            if (images.length === 0) setCoverImage(result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      if (!coverImage) setCoverImage(newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (coverImage === images[index]) {
      setCoverImage(updated[0] || PRESET_COVERS[0]);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures(prev => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddMetric = () => {
    if (metricName.trim() && metricValue.trim()) {
      setMetrics(prev => [...prev, { name: metricName.trim(), value: metricValue.trim() }]);
      setMetricName('');
      setMetricValue('');
    }
  };

  const handleRemoveMetric = (idx: number) => {
    setMetrics(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a project title');
      return;
    }

    setSubmitting(true);
    setError(null);

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      summary: summary || description.slice(0, 140),
      description,
      category,
      tags,
      repoUrl,
      liveUrl: liveUrl || undefined,
      images: images.length > 0 ? images : [PRESET_COVERS[0]],
      coverImage: coverImage || images[0] || PRESET_COVERS[0],
      astScore,
      astBreakdown: {
        complexityScore: astScore,
        testCoverageEst: testCoverage,
        containerized,
        cachingImplemented,
        asyncConcurrency: true,
        ciCdPipelines
      },
      keyFeatures: features,
      techStack: tags,
      metrics,
      verificationStatus: 'verified' as const
    };

    try {
      const endpoint = projectToEdit ? `/api/gallery/${projectToEdit.id}` : '/api/gallery';
      const method = projectToEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project to gallery');
      }

      onSaved(data.item);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="project-edit-dialog"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <button
          id="project-edit-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {projectToEdit ? 'Edit Personal Gallery Project' : 'Upload & Publish Portfolio Project'}
            </h2>
            <p className="text-xs text-slate-600">
              Showcase practical execution depth, AST complexity, code repositories, and verifiable system benchmarks
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Title *</label>
              <input
                id="proj-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Task Queue with Redis Streams"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition-colors"
              >
                <option value="Full-Stack">Full-Stack</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI & ML">AI & ML</option>
                <option value="System Architecture">System Architecture</option>
                <option value="Open Source">Open Source</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">One-Line Summary</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="High-throughput fault-tolerant task queue with worker pools and real-time metrics."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Technical Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain architecture decisions, concurrency handling, database optimizations, and design patterns..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Links & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub Repository Link
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Live Demo / API Docs URL (Optional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://demo.project.dev"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Technologies & Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Redis, Docker, TypeScript, Fastify, PyTest, Prometheus"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Gallery Media Upload & Management */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> Project Gallery Screenshots & Architecture Diagrams
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste screenshot image URL..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Add URL
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500">Architecture Presets:</span>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!images.includes(preset)) setImages(prev => [...prev, preset]);
                      setCoverImage(preset);
                    }}
                    className="w-10 h-7 rounded border border-slate-200 overflow-hidden opacity-70 hover:opacity-100 transition-all cursor-pointer shadow-xs"
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Image List Preview */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white aspect-video shadow-xs">
                  <img src={imgUrl} alt={`Gallery upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    <button
                      type="button"
                      onClick={() => setCoverImage(imgUrl)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                        coverImage === imgUrl ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-indigo-600'
                      }`}
                    >
                      {coverImage === imgUrl ? '★ Cover' : 'Set Cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AST Verification Matrix */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> AST Code Complexity & Quality Matrix
              </label>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                AST Score: {astScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Overall Code Complexity Score</span>
                  <span className="text-slate-900 font-bold">{astScore}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  value={astScore}
                  onChange={(e) => setAstScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Automated Test Coverage (%)</span>
                  <span className="text-slate-900 font-bold">{testCoverage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={testCoverage}
                  onChange={(e) => setTestCoverage(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs shadow-xs">
                <input
                  type="checkbox"
                  checked={containerized}
                  onChange={(e) => setContainerized(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">Docker Containerized</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs shadow-xs">
                <input
                  type="checkbox"
                  checked={cachingImplemented}
                  onChange={(e) => setCachingImplemented(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">Redis / Multi-Tier Cache</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer text-xs shadow-xs">
                <input
                  type="checkbox"
                  checked={ciCdPipelines}
                  onChange={(e) => setCiCdPipelines(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">CI/CD Automation</span>
              </label>
            </div>
          </div>

          {/* Key Features List */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Key Execution Highlights (3-4 points)</label>
            <div className="space-y-2 mb-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs shadow-xs">
                  <span className="text-slate-700">• {feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="e.g. Asynchronous worker pool handling 10k messages/sec"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium hover:bg-indigo-100 cursor-pointer transition-colors shadow-xs"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Verifiable Benchmark Metrics</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {metrics.map((m, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs shadow-xs">
                  <span className="text-slate-500">{m.name}:</span>
                  <span className="text-emerald-700 font-semibold">{m.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="Metric (e.g. P99 Latency)"
                className="sm:col-span-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
              <input
                type="text"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder="Value (e.g. 3.4ms)"
                className="sm:col-span-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={handleAddMetric}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 cursor-pointer transition-colors shadow-xs"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="project-submit-btn"
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-xs shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : projectToEdit ? 'Save Changes' : 'Publish to Portfolio Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
