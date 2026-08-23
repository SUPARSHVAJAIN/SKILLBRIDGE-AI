export type UserRole = 'student' | 'university' | 'recruiter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  bio: string;
  headline: string;
  universityOrCompany: string;
  targetRole: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryMetric {
  name: string;
  value: string;
}

export interface GalleryItem {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  summary: string;
  description: string;
  category: 'Full-Stack' | 'Cloud & DevOps' | 'AI & ML' | 'System Architecture' | 'Open Source' | 'Mobile';
  tags: string[];
  images: string[];
  coverImage: string;
  repoUrl: string;
  liveUrl?: string;
  astScore: number; // 0 to 100
  astBreakdown: {
    complexityScore: number;
    testCoverageEst: number;
    containerized: boolean;
    cachingImplemented: boolean;
    asyncConcurrency: boolean;
    ciCdPipelines: boolean;
  };
  verificationStatus: 'verified' | 'pending' | 'draft';
  keyFeatures: string[];
  techStack: string[];
  metrics: GalleryMetric[];
  sprintMilestoneLinked?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  likedBy?: string[];
}

export interface RadarDataPoint {
  skill: string;
  studentScore: number;
  marketBaseline: number;
  fullMark: number;
}

export interface ExtractedASTInfo {
  languages: string[];
  functionsCount: number;
  asyncCallsDetected: number;
  testSuitesFound: number;
  dockerfilePresent: boolean;
  cicdDetected: boolean;
  redisCachingPresent: boolean;
  ormUsed: boolean;
  architectureType: string;
  identifiedPatterns: string[];
}

export interface CompetencyDeficit {
  category: string;
  missingSkill: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendedAction: string;
}

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  starterSnippet?: string;
  completed: boolean;
  completedAt?: string;
  verifiedGalleryItemId?: string;
}

export interface SprintMilestone {
  week: number;
  weekTitle: string;
  goal: string;
  tasks: SprintTask[];
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  targetJobTitle: string;
  jobDescriptionSummary: string;
  overallFitScore: number; // e.g. 68%
  radarData: RadarDataPoint[];
  extractedAST: ExtractedASTInfo;
  deficits: CompetencyDeficit[];
  roadmap30Days: SprintMilestone[];
  analyzedAt: string;
}

export interface SlidePresentationItem {
  id: number;
  slideNumber: string;
  title: string;
  subtitle?: string;
  problemId?: string;
  cards?: {
    title: string;
    icon: string;
    badge?: string;
    points: { bold?: string; text: string }[];
  }[];
  architectureSteps?: {
    step: string;
    title: string;
    description: string;
    subtext: string;
  }[];
  tableData?: {
    columns: string[];
    rows: {
      category: string;
      traditional: string;
      skillBridge: string;
    }[];
  };
  referencesList?: {
    category: string;
    icon: string;
    items: { bold: string; text: string }[];
  }[];
}
