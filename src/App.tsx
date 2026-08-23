import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DiagnosticSection } from './components/DiagnosticSection';
import { GallerySection } from './components/GallerySection';
import { SprintRoadmapSection } from './components/SprintRoadmapSection';
import { PresentationDeckSection } from './components/PresentationDeckSection';
import { UniversityDashboard } from './components/UniversityDashboard';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { EditProjectModal } from './components/EditProjectModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { GalleryItem, SprintTask } from './types';
import { ShieldCheck, Sparkles, Layers, Github, Heart } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'gallery' | 'sprint' | 'presentation' | 'university' | 'recruiter'>('diagnostic');
  
  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<GalleryItem | null>(null);
  const [detailProject, setDetailProject] = useState<GalleryItem | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenUploadNew = () => {
    setProjectToEdit(null);
    setEditProjectModalOpen(true);
  };

  const handleEditProject = (project: GalleryItem) => {
    setProjectToEdit(project);
    setEditProjectModalOpen(true);
  };

  const handleInspectProject = (project: GalleryItem) => {
    setDetailProject(project);
  };

  const handleOpenUploadWithSprintTask = (task: SprintTask, milestoneTitle: string) => {
    setProjectToEdit({
      id: '',
      userId: user?.id || '',
      authorName: user?.name || 'Candidate',
      authorAvatar: user?.avatar || '',
      authorRole: user?.role || 'student',
      title: task.title,
      summary: task.description,
      description: `Implemented practical milestone project: ${task.title}. Deliverable target: ${task.deliverable}. Built and tested with automated verification fixtures.`,
      category: 'Cloud & DevOps',
      tags: ['TypeScript', 'Docker', 'Redis', 'CI/CD'],
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
      ],
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      repoUrl: user?.githubUrl || 'https://github.com/myusername/project',
      astScore: 92,
      astBreakdown: {
        complexityScore: 92,
        testCoverageEst: 90,
        containerized: true,
        cachingImplemented: true,
        asyncConcurrency: true,
        ciCdPipelines: true
      },
      verificationStatus: 'verified',
      keyFeatures: [task.deliverable, 'Containerized microservice architecture', 'Automated regression test coverage'],
      techStack: ['TypeScript', 'Docker', 'Redis', 'PyTest'],
      metrics: [{ name: 'Test Coverage', value: '92%' }, { name: 'Status', value: 'Production Ready' }],
      sprintMilestoneLinked: milestoneTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0
    });
    setEditProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenUploadProject={handleOpenUploadNew}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'diagnostic' && (
          <DiagnosticSection
            onNavigateToSprint={() => setActiveTab('sprint')}
            onNavigateToGallery={() => setActiveTab('gallery')}
          />
        )}

        {activeTab === 'gallery' && (
          <GallerySection
            onOpenUploadModal={handleOpenUploadNew}
            onEditProject={handleEditProject}
            onViewProjectDetail={handleInspectProject}
          />
        )}

        {activeTab === 'sprint' && (
          <SprintRoadmapSection
            onOpenUploadWithSprintTask={handleOpenUploadWithSprintTask}
            onNavigateToDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {activeTab === 'presentation' && (
          <PresentationDeckSection
            onTriggerDiagnosticDemo={() => setActiveTab('diagnostic')}
            onTriggerGalleryDemo={() => setActiveTab('gallery')}
          />
        )}

        {activeTab === 'university' && (
          <UniversityDashboard
            onNavigateToDiagnostic={() => setActiveTab('diagnostic')}
          />
        )}

        {activeTab === 'recruiter' && (
          <RecruiterDashboard
            onInspectProject={handleInspectProject}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white text-xs text-slate-500 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">SkillBridge AI</span>
            <span className="text-slate-300">—</span>
            <span className="text-slate-500">Problem ID: Omni_EdTech_5 Architecture Platform</span>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <button
              onClick={() => setActiveTab('presentation')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              5-Slide Research Deck
            </button>
            <button
              onClick={() => setActiveTab('diagnostic')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              AST Diagnostic Engine
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Database Portfolio Gallery
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              University T&P Cell Radar
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Powered by AST Syntax Parsing & Google Gemini 3.7 Flash API
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <EditProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <EditProjectModal
        isOpen={editProjectModalOpen}
        onClose={() => {
          setEditProjectModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
        onSaved={(savedItem) => {
          setDetailProject(savedItem);
          setActiveTab('gallery');
        }}
      />

      <ProjectDetailModal
        isOpen={!!detailProject}
        onClose={() => setDetailProject(null)}
        project={detailProject}
        onEditRequest={(proj) => {
          setDetailProject(null);
          handleEditProject(proj);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
