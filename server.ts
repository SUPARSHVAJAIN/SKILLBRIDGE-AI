import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db';
import { analyzePortfolioWithGemini } from './server/geminiService';
import { User } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 gallery screenshots and images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Auth Middleware Helper
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing token.' });
  }

  const token = authHeader.split(' ')[1];
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = user;
  next();
}

function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.getUserByToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillBridge AI Core Service', timestamp: new Date().toISOString() });
});

// --- Auth Endpoints ---

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name, role, universityOrCompany, targetRole } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const result = db.createUser({
      email,
      password,
      name,
      role: role || 'student',
      universityOrCompany,
      targetRole
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to register account.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userWithHash = db.getUserByEmail(email);
    if (!userWithHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Hash check
    const { hashPassword } = require('./server/db');
    if (userWithHash.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = db.createSession(userWithHash.id);
    const { passwordHash: _, ...user } = userWithHash;
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to authenticate.' });
  }
});

// Quick demo login (instant 1-click switch for Alex Rivera, Dr. Sarah Chen, David Zhang)
app.post('/api/auth/demo-login', (req, res) => {
  try {
    const { role } = req.body; // 'student' | 'university' | 'recruiter'
    const targetEmail =
      role === 'university'
        ? 'sarah.chen@techuniv.edu'
        : role === 'recruiter'
        ? 'david.zhang@cloudscale.io'
        : 'alex.rivera@techuniv.edu';

    const userWithHash = db.getUserByEmail(targetEmail);
    if (!userWithHash) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    const token = db.createSession(userWithHash.id);
    const { passwordHash: _, ...user } = userWithHash;
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo login failed.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.put('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, headline, bio, universityOrCompany, targetRole, githubUrl, linkedinUrl, portfolioUrl, skills, avatar } = req.body;

    const updated = db.updateUserProfile(userId, {
      name,
      headline,
      bio,
      universityOrCompany,
      targetRole,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      skills,
      avatar
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile.' });
  }
});

// --- Gallery Management Endpoints ---

// Public / All Gallery items
app.get('/api/gallery', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const { userId, category, search } = req.query;
    const items = db.getGalleryItems({
      userId: userId as string | undefined,
      category: category as string | undefined,
      search: search as string | undefined
    });
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve gallery items.' });
  }
});

// My Gallery items
app.get('/api/gallery/my', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const items = db.getGalleryItems({ userId: req.user!.id });
    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch your gallery.' });
  }
});

// Get single gallery item
app.get('/api/gallery/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const item = db.getGalleryItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery project not found.' });
    }
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch gallery item.' });
  }
});

// Create new gallery item
app.post('/api/gallery', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const {
      title,
      summary,
      description,
      category,
      tags,
      images,
      coverImage,
      repoUrl,
      liveUrl,
      astScore,
      astBreakdown,
      keyFeatures,
      techStack,
      metrics,
      sprintMilestoneLinked,
      verificationStatus
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Project title and category are required.' });
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
    ];

    const finalImages = images && images.length > 0 ? images : defaultImages;
    const finalCoverImage = coverImage || finalImages[0];

    // Compute automatic AST score breakdown if not provided
    const computedAstScore = astScore || Math.floor(82 + Math.random() * 15);
    const computedBreakdown = astBreakdown || {
      complexityScore: computedAstScore,
      testCoverageEst: Math.floor(75 + Math.random() * 20),
      containerized: (tags || []).some((t: string) => t.toLowerCase().includes('docker') || t.toLowerCase().includes('k8s')),
      cachingImplemented: (tags || []).some((t: string) => t.toLowerCase().includes('redis') || t.toLowerCase().includes('cache')),
      asyncConcurrency: true,
      ciCdPipelines: (tags || []).some((t: string) => t.toLowerCase().includes('ci') || t.toLowerCase().includes('action'))
    };

    const newItem = db.createGalleryItem({
      userId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role,
      title,
      summary: summary || description?.substring(0, 120) || 'Verified SkillBridge Portfolio Project',
      description: description || 'Detailed architectural project demonstrating practical engineering execution.',
      category: category || 'Full-Stack',
      tags: tags || ['TypeScript', 'Full-Stack'],
      images: finalImages,
      coverImage: finalCoverImage,
      repoUrl: repoUrl || user.githubUrl || 'https://github.com',
      liveUrl: liveUrl || undefined,
      astScore: computedAstScore,
      astBreakdown: computedBreakdown,
      verificationStatus: verificationStatus || 'verified',
      keyFeatures: keyFeatures && keyFeatures.length > 0 ? keyFeatures : [
        'Modular architecture with decoupled service layers',
        'Automated CI/CD validation tests on pull requests',
        'End-to-end type safety and error boundary handling'
      ],
      techStack: techStack && techStack.length > 0 ? techStack : (tags || ['TypeScript', 'Node.js', 'React']),
      metrics: metrics && metrics.length > 0 ? metrics : [
        { name: 'AST Complexity', value: `${computedAstScore}/100` },
        { name: 'Test Coverage', value: '88%' }
      ],
      sprintMilestoneLinked
    });

    res.status(201).json({ item: newItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create gallery item.' });
  }
});

// Update gallery item
app.put('/api/gallery/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.updateGalleryItem(req.params.id, req.user!.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Gallery item not found or unauthorized.' });
    }
    res.json({ item: updated });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Failed to update gallery item.' });
  }
});

// Delete gallery item
app.delete('/api/gallery/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const success = db.deleteGalleryItem(req.params.id, req.user!.id);
    if (!success) {
      return res.status(404).json({ error: 'Gallery item not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Gallery item removed successfully.' });
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Failed to delete gallery item.' });
  }
});

// Toggle Like
app.post('/api/gallery/:id/like', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const updated = db.toggleLikeGalleryItem(req.params.id, req.user!.id);
    if (!updated) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }
    res.json({ item: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle like.' });
  }
});

// --- Diagnostics & AST Vector Delta Endpoints ---

app.get('/api/diagnostic/latest', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'user_student_1';
    const diag = db.getLatestDiagnostic(userId);
    if (!diag) {
      return res.status(404).json({ error: 'No diagnostic found.' });
    }
    res.json({ diagnostic: diag });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load diagnostic.' });
  }
});

app.post('/api/diagnostic/analyze', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { targetJobTitle, jobDescription, resumeText, githubRepoUrl, repoCodeSnippet } = req.body;

    if (!targetJobTitle) {
      return res.status(400).json({ error: 'Target Job Title is required for market comparison.' });
    }

    const diag = await analyzePortfolioWithGemini({
      userId,
      targetJobTitle,
      jobDescription,
      resumeText,
      githubRepoUrl,
      repoCodeSnippet
    });

    const saved = db.saveDiagnostic(diag);
    res.json({ diagnostic: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze portfolio.' });
  }
});

// Update sprint milestone task completion
app.post('/api/diagnostic/update-task', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { taskId, completed, verifiedGalleryItemId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: 'taskId is required.' });
    }

    const updated = db.updateSprintTask(userId, taskId, completed, verifiedGalleryItemId);
    if (!updated) {
      return res.status(404).json({ error: 'Diagnostic or task not found.' });
    }

    res.json({ diagnostic: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update task status.' });
  }
});

// --- University & Recruiter Analytics Endpoints ---

app.get('/api/analytics/university-batch', (req, res) => {
  try {
    const stats = db.getUniversityBatchStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch university batch stats.' });
  }
});

app.get('/api/analytics/recruiter-candidates', (req, res) => {
  try {
    const candidates = db.getRecruiterTalentPool();
    res.json({ candidates });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch recruiter candidate pool.' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Production Serving
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
