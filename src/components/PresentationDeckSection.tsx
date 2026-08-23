import React, { useState } from 'react';
import { presentationSlides } from '../data/presentationData';
import { SlidePresentationItem } from '../types';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Rocket,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Code2,
  Workflow,
  AlertTriangle,
  Users,
  Link2,
  Play,
  Share2,
  Check
} from 'lucide-react';

interface PresentationDeckSectionProps {
  onTriggerDiagnosticDemo: () => void;
  onTriggerGalleryDemo: () => void;
}

export const PresentationDeckSection: React.FC<PresentationDeckSectionProps> = ({
  onTriggerDiagnosticDemo,
  onTriggerGalleryDemo
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentSlide: SlidePresentationItem = presentationSlides[currentSlideIdx];

  const handleNext = () => {
    setCurrentSlideIdx((prev) => (prev === presentationSlides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlideIdx((prev) => (prev === 0 ? presentationSlides.length - 1 : prev - 1));
  };

  const handleCopySlideLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Rocket': return <Rocket className="w-5 h-5 text-purple-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-emerald-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'Link2': return <Link2 className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-50 p-6 overflow-y-auto' : ''}`}>
      {/* Presentation Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              SkillBridge AI Presentation Deck Explorer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              Slide {currentSlide.slideNumber} of 05
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Recreation and interactive walkthrough of the official SkillBridge AI architectural blueprints and research deck.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySlideLink}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs shadow-xs transition-colors cursor-pointer"
            title="Share deck"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs shadow-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit full screen' : 'Full screen mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs shadow-xs transition-colors cursor-pointer"
            title="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Carousel Thumbnails */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {presentationSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlideIdx(idx)}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              currentSlideIdx === idx
                ? 'bg-indigo-50/90 border-indigo-300 text-slate-900 shadow-xs scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className={currentSlideIdx === idx ? 'text-indigo-700' : 'text-slate-500'}>SLIDE {slide.slideNumber}</span>
              {slide.problemId && (
                <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-medium">
                  {slide.problemId}
                </span>
              )}
            </div>
            <div className="text-xs font-semibold truncate text-slate-800">
              {slide.title.replace('IDEA TITLE: ', '').replace('SYSTEM ARCHITECTURE & ', '')}
            </div>
          </button>
        ))}
      </div>

      {/* Main Active Slide Display Stage */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 md:p-10 shadow-xs space-y-8">
        {/* Slide Title Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold">
                SLIDE {currentSlide.slideNumber}
              </span>
              {currentSlide.problemId && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-semibold">
                  Problem ID: {currentSlide.problemId}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-sm text-slate-600">{currentSlide.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentSlide.id === 1 && (
              <button
                type="button"
                onClick={onTriggerDiagnosticDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Live AST Engine</span>
              </button>
            )}
            {currentSlide.id === 2 && (
              <button
                type="button"
                onClick={onTriggerGalleryDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Explore Database Gallery</span>
              </button>
            )}
          </div>
        </div>

        {/* Slide 2: Pipeline Diagram Interactive Step View */}
        {currentSlide.architectureSteps && (
          <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              End-to-End Processing Architecture Pipeline (Click any step to inspect)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentSlide.architectureSteps.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                    activePipelineStep === idx
                      ? 'bg-indigo-50/90 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                      {step.step}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Stage {idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-600 mb-2">{step.description}</p>
                  <span className="text-[10px] text-indigo-600 font-mono font-medium block">{step.subtext}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Slide Cards Content Grid */}
        {currentSlide.cards && currentSlide.cards.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              currentSlide.cards.length === 3
                ? 'md:grid-cols-3'
                : currentSlide.cards.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-1'
            } gap-6`}
          >
            {currentSlide.cards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                      {getIcon(card.icon)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                  </div>
                  {card.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono font-semibold">
                      {card.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {card.points.map((pt, pIdx) => (
                    <div key={pIdx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <div>
                        {pt.bold && (
                          <span className="font-bold text-slate-900 block mb-0.5">{pt.bold}: </span>
                        )}
                        <span>{pt.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slide 4: Stakeholder Transformation Matrix Table */}
        {currentSlide.tableData && (
          <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stakeholder Transformation Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    {currentSlide.tableData.columns.map((col, idx) => (
                      <th key={idx} className="py-3 px-4 font-semibold uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {currentSlide.tableData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block p-1.5 rounded bg-white border border-slate-200 text-slate-700 shadow-xs">
                          {row.traditional}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-indigo-800 font-medium">
                        <span className="inline-flex items-center gap-1.5 p-1.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          {row.skillBridge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Slide 5: References & Empirical Studies */}
        {currentSlide.referencesList && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSlide.referencesList.map((refGroup, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                    {getIcon(refGroup.icon)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{refGroup.category}</h3>
                </div>

                <div className="space-y-3.5">
                  {refGroup.items.map((item, iIdx) => (
                    <div key={iIdx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-xs">
                      <span className="font-bold text-indigo-700 block">{item.bold}</span>
                      <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
