import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, GalleryItem, DiagnosticResult } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

export interface DBStore {
  users: (User & { passwordHash: string })[];
  galleryItems: GalleryItem[];
  diagnostics: DiagnosticResult[];
  sessions: { token: string; userId: string; createdAt: string }[];
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_skillbridge_salt_2026').digest('hex');
}

// Initial seed data
const initialUsers: (User & { passwordHash: string })[] = [
  {
    id: 'user_student_1',
    email: 'alex.rivera@techuniv.edu',
    name: 'Alex Rivera',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    headline: 'Aspiring Cloud & Backend Engineer | CS Senior @ Tech University',
    bio: 'Passionate about building scalable distributed systems, microservices, and asynchronous event pipelines. Actively leveling up in Kubernetes, Redis caching, and CI/CD pipelines.',
    universityOrCompany: 'Tech University (Dept. of Computer Science)',
    targetRole: 'Junior Backend & Cloud Engineer',
    githubUrl: 'https://github.com/alexrivera-dev',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
    portfolioUrl: 'https://alexrivera.dev',
    skills: ['TypeScript', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'REST APIs', 'Git'],
    passwordHash: hashPassword('password123'),
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z'
  },
  {
    id: 'user_univ_1',
    email: 'sarah.chen@techuniv.edu',
    name: 'Dr. Sarah Chen',
    role: 'university',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    headline: 'Head of Training & Placement Cell | Professor of Software Engineering',
    bio: 'Overseeing placement readiness for 450+ CS & IT graduates. Utilizing SkillBridge AI vector delta analytics to modernize curriculum electives.',
    universityOrCompany: 'Tech University Placement Directorate',
    targetRole: 'Academic Director / T&P Cell Head',
    githubUrl: 'https://github.com/techuniv-tnp',
    linkedinUrl: 'https://linkedin.com/in/dr-sarah-chen',
    skills: ['Curriculum Engineering', 'Batch Skill Assessment', 'Industry Relations', 'Accreditation'],
    passwordHash: hashPassword('password123'),
    createdAt: '2026-07-15T09:00:00.000Z',
    updatedAt: '2026-08-18T11:00:00.000Z'
  },
  {
    id: 'user_recruiter_1',
    email: 'david.zhang@cloudscale.io',
    name: 'David Zhang',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    headline: 'Lead Technical Talent Partner @ CloudScale Systems',
    bio: 'Scouting top software engineering talent with verified hands-on AST capabilities and real GitHub code repositories.',
    universityOrCompany: 'CloudScale Systems (Infrastructure & AI)',
    targetRole: 'Senior Tech Recruiter',
    githubUrl: 'https://github.com/cloudscale-recruiting',
    linkedinUrl: 'https://linkedin.com/in/david-zhang-tech',
    skills: ['Talent Sourcing', 'AST Code Evaluation', 'Technical Screening', 'Campus Hiring'],
    passwordHash: hashPassword('password123'),
    createdAt: '2026-08-05T08:00:00.000Z',
    updatedAt: '2026-08-22T16:00:00.000Z'
  }
];

const initialGallery: GalleryItem[] = [
  {
    id: 'proj_1',
    userId: 'user_student_1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    authorRole: 'student',
    title: 'Distributed Asynchronous Task Queue with Redis Streams',
    summary: 'High-throughput fault-tolerant task queue with worker pools, dead-letter queues, and real-time execution telemetry.',
    description: 'Built a production-grade distributed worker system inspired by Celery and BullMQ. Features Redis Stream consumer groups, exponential backoff retries, and Prometheus metrics export. Resolved high latency bottlenecks with atomic pipeline operations.',
    category: 'Cloud & DevOps',
    tags: ['Redis', 'Docker', 'Node.js', 'Distributed Systems', 'CI/CD', 'Prometheus'],
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/alexrivera-dev/distributed-task-queue',
    liveUrl: 'https://queue-telemetry.alexrivera.dev',
    astScore: 94,
    astBreakdown: {
      complexityScore: 92,
      testCoverageEst: 88,
      containerized: true,
      cachingImplemented: true,
      asyncConcurrency: true,
      ciCdPipelines: true
    },
    verificationStatus: 'verified',
    keyFeatures: [
      'Multi-worker concurrency with atomic claim semantics',
      'Exponential backoff with automated Dead Letter Queue recovery',
      'Full Docker Compose multi-service deployment with healthchecks',
      'PyTest & Jest integration suites running on GitHub Actions CI'
    ],
    techStack: ['Node.js', 'TypeScript', 'Redis Streams', 'Docker Compose', 'GitHub Actions', 'Prometheus'],
    metrics: [
      { name: 'Throughput', value: '14,200 req/sec' },
      { name: 'P99 Latency', value: '3.4ms' },
      { name: 'Test Coverage', value: '91.4%' }
    ],
    sprintMilestoneLinked: 'Sprint 1 - Redis Caching & Queue Architecture',
    createdAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-08-19T17:00:00.000Z',
    likesCount: 24,
    likedBy: ['user_recruiter_1', 'user_univ_1']
  },
  {
    id: 'proj_2',
    userId: 'user_student_1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    authorRole: 'student',
    title: 'FastAPI Microservice with PyTest Integration & OpenAPI Specs',
    summary: 'Containerized RESTful microservice with JWT authentication, PostgreSQL ORM, and comprehensive test suite.',
    description: 'Designed a microservice implementing clean architecture and repository patterns. Includes automated PyTest suites with Mock fixtures, OpenAPI auto-generated contracts, and a multi-stage Alpine Docker build minimizing image size to 68MB.',
    category: 'Full-Stack',
    tags: ['FastAPI', 'Python', 'PyTest', 'PostgreSQL', 'Docker', 'SQLAlchemy'],
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/alexrivera-dev/fastapi-secure-service',
    liveUrl: 'https://api-service.alexrivera.dev/docs',
    astScore: 89,
    astBreakdown: {
      complexityScore: 86,
      testCoverageEst: 93,
      containerized: true,
      cachingImplemented: false,
      asyncConcurrency: true,
      ciCdPipelines: true
    },
    verificationStatus: 'verified',
    keyFeatures: [
      'Asynchronous database queries with SQLAlchemy 2.0 and asyncpg',
      'End-to-end PyTest fixtures mocking external OAuth providers',
      'Multi-stage Dockerfile cutting container payload by 72%',
      'Strict input validation using Pydantic v2 schemas'
    ],
    techStack: ['Python 3.12', 'FastAPI', 'SQLAlchemy', 'Alembic', 'PyTest', 'Docker'],
    metrics: [
      { name: 'Coverage', value: '94.2%' },
      { name: 'Build Size', value: '68 MB' },
      { name: 'API Endpoints', value: '18 Routes' }
    ],
    sprintMilestoneLinked: 'Sprint 2 - Test Suites & Containerization',
    createdAt: '2026-08-14T09:30:00.000Z',
    updatedAt: '2026-08-21T15:00:00.000Z',
    likesCount: 19,
    likedBy: ['user_recruiter_1']
  },
  {
    id: 'proj_3',
    userId: 'user_student_1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    authorRole: 'student',
    title: 'Semantic Vector Search Engine with ChromaDB & LangChain',
    summary: 'High-dimensional embeddings search engine indexing tech documentation with cosine distance filtering.',
    description: 'Implements semantic question-answering over unstructured technical documentation. Evaluates similarity matrices via vector embeddings and provides sub-second query response times with token usage streaming.',
    category: 'AI & ML',
    tags: ['Vector DB', 'ChromaDB', 'Python', 'LangChain', 'Gemini API', 'Embeddings'],
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    repoUrl: 'https://github.com/alexrivera-dev/vector-semantic-search',
    liveUrl: 'https://vector-demo.alexrivera.dev',
    astScore: 91,
    astBreakdown: {
      complexityScore: 94,
      testCoverageEst: 84,
      containerized: true,
      cachingImplemented: true,
      asyncConcurrency: true,
      ciCdPipelines: true
    },
    verificationStatus: 'verified',
    keyFeatures: [
      'ChromaDB collection management with cosine metric indexing',
      'Chunking algorithms with semantic boundary preservation',
      'Server-Sent Events (SSE) streaming model responses'
    ],
    techStack: ['Python', 'ChromaDB', 'Google GenAI SDK', 'FastAPI', 'Docker'],
    metrics: [
      { name: 'Query Latency', value: '42ms' },
      { name: 'Indexed Chunks', value: '25,000+' },
      { name: 'Embedding Dim', value: '768 Vectors' }
    ],
    sprintMilestoneLinked: 'Sprint 3 - Vector Delta & AI Integration',
    createdAt: '2026-08-18T14:00:00.000Z',
    updatedAt: '2026-08-22T18:00:00.000Z',
    likesCount: 31,
    likedBy: ['user_recruiter_1', 'user_univ_1']
  }
];

const initialDiagnostics: DiagnosticResult[] = [
  {
    id: 'diag_student_1',
    userId: 'user_student_1',
    targetJobTitle: 'Junior Cloud Native & Backend Engineer',
    jobDescriptionSummary: 'Requires production experience with FastAPI/Node.js microservices, Docker containerization, Redis multi-tier caching, PyTest integration testing, and GitHub Actions CI/CD workflows.',
    overallFitScore: 84,
    radarData: [
      { skill: 'API Architecture', studentScore: 88, marketBaseline: 85, fullMark: 100 },
      { skill: 'Cloud & Docker', studentScore: 85, marketBaseline: 90, fullMark: 100 },
      { skill: 'PyTest & Testing', studentScore: 82, marketBaseline: 85, fullMark: 100 },
      { skill: 'CI/CD Automation', studentScore: 78, marketBaseline: 80, fullMark: 100 },
      { skill: 'Caching (Redis)', studentScore: 90, marketBaseline: 75, fullMark: 100 },
      { skill: 'System Design', studentScore: 80, marketBaseline: 85, fullMark: 100 }
    ],
    extractedAST: {
      languages: ['TypeScript', 'Python', 'SQL'],
      functionsCount: 142,
      asyncCallsDetected: 78,
      testSuitesFound: 8,
      dockerfilePresent: true,
      cicdDetected: true,
      redisCachingPresent: true,
      ormUsed: true,
      architectureType: 'Modular Layered Microservice',
      identifiedPatterns: ['Repository Pattern', 'Producer-Consumer', 'Middleware Interceptors', 'Exponential Backoff']
    },
    deficits: [
      {
        category: 'CI/CD Automation',
        missingSkill: 'Multi-environment deployment pipeline with automated rollback triggers',
        impact: 'Medium',
        description: 'Current GitHub Actions workflow only runs lint & unit tests, lacking container registry push and staging deployment stages.',
        recommendedAction: 'Add a GitHub Actions workflow to build and push Docker images to GitHub Packages (GHCR) and run smoke tests.'
      },
      {
        category: 'System Design & Security',
        missingSkill: 'Rate limiting and JWT revocation with Redis blacklist',
        impact: 'High',
        description: 'Authentication token expiration relies strictly on client timestamp without server-side revocation mechanism.',
        recommendedAction: 'Implement Redis token blocklisting and token bucket rate limiting on public API endpoints.'
      }
    ],
    roadmap30Days: [
      {
        week: 1,
        weekTitle: 'Sprint 1: Redis Caching & Distributed Worker Architecture',
        goal: 'Implement production-grade asynchronous queue and Redis multi-level caching.',
        tasks: [
          {
            id: 'task_w1_1',
            title: 'Build Redis Streams Consumer Group Worker',
            description: 'Write an asynchronous worker pool with ack/nack retry loops and dead letter queue.',
            deliverable: 'Task worker repo with 10k/sec benchmark script',
            starterSnippet: `// Redis Stream consumer group worker\nasync function consumeTasks() {\n  const results = await redis.xreadgroup('GROUP', 'workers', 'worker-1', 'COUNT', '10', 'BLOCK', '2000', 'STREAMS', 'tasks', '>');\n  for (const [stream, entries] of results || []) {\n    for (const [id, fields] of entries) {\n      await processTask(id, fields);\n      await redis.xack('tasks', 'workers', id);\n    }\n  }\n}`,
            completed: true,
            completedAt: '2026-08-11T16:00:00.000Z',
            verifiedGalleryItemId: 'proj_1'
          },
          {
            id: 'task_w1_2',
            title: 'Add Prometheus Latency & Error Histogram',
            description: 'Instrument task queue with prometheus-client and export /metrics endpoint.',
            deliverable: 'Grafana-ready dashboard config and prometheus metrics',
            completed: true,
            completedAt: '2026-08-13T18:00:00.000Z',
            verifiedGalleryItemId: 'proj_1'
          }
        ]
      },
      {
        week: 2,
        weekTitle: 'Sprint 2: PyTest Fixture Suites & Multi-Stage Dockerization',
        goal: 'Elevate automated test coverage past 90% and create minimal production Docker images.',
        tasks: [
          {
            id: 'task_w2_1',
            title: 'Write PyTest Async Fixtures with Testcontainers/Mocking',
            description: 'Create end-to-end integration tests for database operations and API controllers.',
            deliverable: 'PyTest suite with HTML coverage report > 90%',
            starterSnippet: `import pytest\nfrom httpx import AsyncClient\nfrom app.main import app\n\n@pytest.mark.asyncio\nasync def test_create_item_with_auth(client: AsyncClient, auth_headers):\n    res = await client.post('/api/items', json={'title': 'Test'}, headers=auth_headers)\n    assert res.status_code == 201\n    assert res.json()['title'] == 'Test'`,
            completed: true,
            completedAt: '2026-08-16T15:00:00.000Z',
            verifiedGalleryItemId: 'proj_2'
          },
          {
            id: 'task_w2_2',
            title: 'Write Multi-Stage Dockerfile with Non-Root Security',
            description: 'Implement multi-stage Alpine build with security scanner passing zero CVEs.',
            deliverable: 'Dockerfile with size < 80MB',
            starterSnippet: `FROM python:3.12-alpine AS builder\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir --prefix=/install -r requirements.txt\n\nFROM python:3.12-alpine\nWORKDIR /app\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nCOPY --from=builder /install /usr/local\nCOPY . .\nUSER appuser\nCMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
            completed: true,
            completedAt: '2026-08-17T11:00:00.000Z',
            verifiedGalleryItemId: 'proj_2'
          }
        ]
      },
      {
        week: 3,
        weekTitle: 'Sprint 3: High-Dimensional Vector Search & RAG System',
        goal: 'Build ChromaDB cosine similarity engine for semantic developer matching.',
        tasks: [
          {
            id: 'task_w3_1',
            title: 'Implement ChromaDB Collection Indexing',
            description: 'Extract AST tokens and generate 768-dim embeddings for project source code.',
            deliverable: 'Vector pipeline service with cosine distance search',
            starterSnippet: `import chromadb\nclient = chromadb.PersistentClient(path="./chroma_db")\ncollection = client.get_or_create_collection("tech_jds", metadata={"hnsw:space": "cosine"})\ncollection.add(ids=["jd_101"], documents=["Senior Cloud Backend Developer..."])`,
            completed: true,
            completedAt: '2026-08-20T17:30:00.000Z',
            verifiedGalleryItemId: 'proj_3'
          },
          {
            id: 'task_w3_2',
            title: 'Integrate Gemini Structured Output Schema',
            description: 'Extract structured developer AST attributes using Gemini 3.7 Flash.',
            deliverable: 'JSON schema validator passing 100% test fixtures',
            completed: false
          }
        ]
      },
      {
        week: 4,
        weekTitle: 'Sprint 4: GitHub Actions Multi-Environment CI/CD & Production Hardening',
        goal: 'Deploy automated staging verification pipeline and rate limiter.',
        tasks: [
          {
            id: 'task_w4_1',
            title: 'Construct GitHub Actions Release Workflow',
            description: 'Trigger lint, test, docker build, vulnerability scan, and auto-release tagging on main branch.',
            deliverable: '.github/workflows/deploy.yml with passing badge',
            starterSnippet: `name: CI/CD Pipeline\non:\n  push:\n    branches: [main]\njobs:\n  test-and-build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm test\n      - run: docker build -t skillbridge-app .`,
            completed: false
          },
          {
            id: 'task_w4_2',
            title: 'Token Bucket Rate Limiting with Redis',
            description: 'Protect all API routes from burst attacks with configurable quotas per IP/API key.',
            deliverable: 'Middleware module with 429 response handling',
            completed: false
          }
        ]
      }
    ],
    analyzedAt: '2026-08-22T08:00:00.000Z'
  }
];

class DatabaseService {
  private store: DBStore = {
    users: initialUsers,
    galleryItems: initialGallery,
    diagnostics: initialDiagnostics,
    sessions: [
      { token: 'token_alex_rivera', userId: 'user_student_1', createdAt: new Date().toISOString() },
      { token: 'token_sarah_chen', userId: 'user_univ_1', createdAt: new Date().toISOString() },
      { token: 'token_david_zhang', userId: 'user_recruiter_1', createdAt: new Date().toISOString() }
    ]
  };

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.galleryItems) {
          this.store = parsed;
        }
      } else {
        this.saveToDisk();
      }
    } catch (e) {
      console.warn('Could not read from persistent store, using in-memory store:', e);
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save to persistent store:', e);
    }
  }

  // Auth & Users
  getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    const user = this.store.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  createUser(data: {
    email: string;
    name: string;
    password: string;
    role: User['role'];
    universityOrCompany?: string;
    targetRole?: string;
  }): { user: User; token: string } {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const defaultAvatars = {
      student: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      university: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      recruiter: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    };

    const newUser: User & { passwordHash: string } = {
      id,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: defaultAvatars[data.role] || defaultAvatars.student,
      headline: data.role === 'student' ? 'Aspiring Software Developer' : data.role === 'university' ? 'Academic Program Director' : 'Technical Recruiter',
      bio: `Member of the SkillBridge AI developer community.`,
      universityOrCompany: data.universityOrCompany || (data.role === 'student' ? 'Engineering Institute' : 'Tech Company'),
      targetRole: data.targetRole || (data.role === 'student' ? 'Full Stack Developer' : 'Talent Partner'),
      skills: data.role === 'student' ? ['JavaScript', 'TypeScript', 'React', 'Git', 'REST APIs'] : ['Talent Acquisition', 'AST Screening'],
      passwordHash: hashPassword(data.password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.store.users.push(newUser);
    const token = `token_${id}_${crypto.randomBytes(16).toString('hex')}`;
    this.store.sessions.push({ token, userId: id, createdAt: new Date().toISOString() });
    this.saveToDisk();

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  createSession(userId: string): string {
    const token = `token_${userId}_${crypto.randomBytes(16).toString('hex')}`;
    this.store.sessions.push({ token, userId, createdAt: new Date().toISOString() });
    this.saveToDisk();
    return token;
  }

  getUserByToken(token: string): User | undefined {
    const session = this.store.sessions.find(s => s.token === token);
    if (!session) return undefined;
    return this.getUserById(session.userId);
  }

  updateUserProfile(userId: string, updates: Partial<User>): User | undefined {
    const index = this.store.users.findIndex(u => u.id === userId);
    if (index === -1) return undefined;
    const current = this.store.users[index];
    this.store.users[index] = {
      ...current,
      ...updates,
      id: current.id,
      email: current.email,
      passwordHash: current.passwordHash,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    const { passwordHash: _, ...rest } = this.store.users[index];
    return rest;
  }

  // Gallery CRUD
  getGalleryItems(options?: { userId?: string; category?: string; search?: string }): GalleryItem[] {
    let items = [...this.store.galleryItems];
    if (options?.userId) {
      items = items.filter(i => i.userId === options.userId);
    }
    if (options?.category && options.category !== 'All') {
      items = items.filter(i => i.category === options.category);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.authorName.toLowerCase().includes(q)
      );
    }
    // Sort newest first
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getGalleryItemById(id: string): GalleryItem | undefined {
    return this.store.galleryItems.find(i => i.id === id);
  }

  createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'>): GalleryItem {
    const newItem: GalleryItem = {
      ...data,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      likesCount: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.store.galleryItems.unshift(newItem);
    this.saveToDisk();
    return newItem;
  }

  updateGalleryItem(id: string, userId: string, updates: Partial<GalleryItem>): GalleryItem | undefined {
    const index = this.store.galleryItems.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    const item = this.store.galleryItems[index];
    // Check permission
    if (item.userId !== userId) {
      throw new Error('Unauthorized to edit this gallery item');
    }
    this.store.galleryItems[index] = {
      ...item,
      ...updates,
      id: item.id,
      userId: item.userId,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    return this.store.galleryItems[index];
  }

  deleteGalleryItem(id: string, userId: string): boolean {
    const index = this.store.galleryItems.findIndex(i => i.id === id);
    if (index === -1) return false;
    if (this.store.galleryItems[index].userId !== userId) {
      throw new Error('Unauthorized to delete this gallery item');
    }
    this.store.galleryItems.splice(index, 1);
    this.saveToDisk();
    return true;
  }

  toggleLikeGalleryItem(id: string, userId: string): GalleryItem | undefined {
    const item = this.store.galleryItems.find(i => i.id === id);
    if (!item) return undefined;
    if (!item.likedBy) item.likedBy = [];
    const idx = item.likedBy.indexOf(userId);
    if (idx >= 0) {
      item.likedBy.splice(idx, 1);
      item.likesCount = Math.max(0, item.likesCount - 1);
    } else {
      item.likedBy.push(userId);
      item.likesCount += 1;
    }
    this.saveToDisk();
    return item;
  }

  // Diagnostics & Roadmaps
  getLatestDiagnostic(userId: string): DiagnosticResult | undefined {
    const userDiags = this.store.diagnostics.filter(d => d.userId === userId);
    if (userDiags.length === 0) {
      // return default seed if available
      return this.store.diagnostics.find(d => d.userId === 'user_student_1');
    }
    return userDiags.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())[0];
  }

  saveDiagnostic(diag: DiagnosticResult): DiagnosticResult {
    this.store.diagnostics = this.store.diagnostics.filter(d => d.id !== diag.id);
    this.store.diagnostics.unshift(diag);
    this.saveToDisk();
    return diag;
  }

  updateSprintTask(userId: string, taskId: string, completed: boolean, verifiedGalleryItemId?: string): DiagnosticResult | undefined {
    const diag = this.getLatestDiagnostic(userId);
    if (!diag) return undefined;

    let updated = false;
    for (const milestone of diag.roadmap30Days) {
      for (const task of milestone.tasks) {
        if (task.id === taskId) {
          task.completed = completed;
          task.completedAt = completed ? new Date().toISOString() : undefined;
          if (verifiedGalleryItemId) {
            task.verifiedGalleryItemId = verifiedGalleryItemId;
          }
          updated = true;
        }
      }
    }

    if (updated) {
      // Recalculate fit score slightly upwards as tasks are completed
      const totalTasks = diag.roadmap30Days.reduce((acc, m) => acc + m.tasks.length, 0);
      const completedTasks = diag.roadmap30Days.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
      const progressBonus = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 15) : 0;
      diag.overallFitScore = Math.min(99, 75 + progressBonus);
      this.saveDiagnostic(diag);
    }

    return diag;
  }

  // University & Recruiter Aggregates
  getUniversityBatchStats() {
    const students = this.store.users.filter(u => u.role === 'student');
    const totalStudents = students.length || 1;
    const verifiedProjects = this.store.galleryItems.filter(p => p.verificationStatus === 'verified').length;
    const averageFitScore = 82.5;

    return {
      batchSize: 450,
      activeEnrolled: 382,
      averageFitScore,
      verifiedProjectsCount: verifiedProjects + 1240,
      interviewClearanceRate: '85.4%',
      traditionalInterviewClearanceRate: '22.0%', // Reflecting 85% rejection reduction from slide 4
      cohortRadar: [
        { skill: 'API Architecture', studentScore: 84, marketBaseline: 85, fullMark: 100 },
        { skill: 'Cloud & Docker', studentScore: 68, marketBaseline: 90, fullMark: 100 }, // Identified deficit
        { skill: 'PyTest & Testing', studentScore: 62, marketBaseline: 85, fullMark: 100 }, // Identified deficit
        { skill: 'CI/CD Automation', studentScore: 59, marketBaseline: 80, fullMark: 100 }, // Identified deficit
        { skill: 'Caching (Redis)', studentScore: 71, marketBaseline: 75, fullMark: 100 },
        { skill: 'System Design', studentScore: 78, marketBaseline: 85, fullMark: 100 }
      ],
      curriculumRecommendations: [
        {
          module: 'CS402: Advanced Distributed Systems',
          identifiedDeficit: 'Lack of containerized CI/CD pipelines (Docker + GitHub Actions)',
          action: 'Introduce 2-week mandatory lab on multi-stage Docker builds and automated GH Actions workflows',
          urgency: 'Immediate (Fall 2026)'
        },
        {
          module: 'CS315: Software Testing & Quality Assurance',
          identifiedDeficit: '75% of submissions use manual testing rather than PyTest/Jest fixtures',
          action: 'Replace theoretical testing term papers with test-driven development (TDD) repo sprints',
          urgency: 'High'
        }
      ]
    };
  }

  getRecruiterTalentPool() {
    const students = this.store.users.filter(u => u.role === 'student');
    return students.map(student => {
      const projects = this.store.galleryItems.filter(g => g.userId === student.id);
      const diag = this.getLatestDiagnostic(student.id);
      return {
        ...student,
        verifiedProjectsCount: projects.length,
        topProjects: projects.slice(0, 3),
        overallFitScore: diag ? diag.overallFitScore : 84,
        astScoreAvg: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.astScore, 0) / projects.length) : 89,
        radarData: diag?.radarData || [
          { skill: 'API Architecture', studentScore: 88, marketBaseline: 85, fullMark: 100 },
          { skill: 'Cloud & Docker', studentScore: 85, marketBaseline: 90, fullMark: 100 },
          { skill: 'PyTest & Testing', studentScore: 82, marketBaseline: 85, fullMark: 100 },
          { skill: 'CI/CD Automation', studentScore: 78, marketBaseline: 80, fullMark: 100 },
          { skill: 'Caching (Redis)', studentScore: 90, marketBaseline: 75, fullMark: 100 },
          { skill: 'System Design', studentScore: 80, marketBaseline: 85, fullMark: 100 }
        ]
      };
    });
  }
}

export const db = new DatabaseService();
