import { SlidePresentationItem } from '../types';

export const presentationSlides: SlidePresentationItem[] = [
  {
    id: 1,
    slideNumber: "01",
    title: "IDEA TITLE: SkillBridge AI",
    subtitle: "Adaptive Learning & Competency Bridge Platform",
    problemId: "Omni_EdTech_5",
    cards: [
      {
        title: "Proposed Solution",
        icon: "Lightbulb",
        points: [
          {
            bold: "Semantic Portfolio Evaluation",
            text: "An intelligent diagnostic and adaptive learning platform that semantically evaluates student portfolios (resumes, transcripts, GitHub code repos) against live industry job descriptions (JDs)."
          },
          {
            bold: "Real-time Fit Score (%)",
            text: "Generates a dynamic match percentage and pinpoints exact missing practical competencies before applying."
          }
        ]
      },
      {
        title: "Addressing Problem ID: Omni_EdTech_5",
        icon: "Cpu",
        badge: "Omni_EdTech_5",
        points: [
          {
            bold: "Replaces Keyword Matching",
            text: "Analyzes practical execution depth rather than superficial resume buzzwords."
          },
          {
            bold: "Exposes Unseen Deficits",
            text: "Identifies non-linear gaps in Docker, PyTest, CI/CD, caching, and API design."
          },
          {
            bold: "Actionable Roadmaps",
            text: "Replaces broad theory with targeted 30-day milestone projects."
          }
        ]
      },
      {
        title: "Innovation & Uniqueness",
        icon: "Rocket",
        points: [
          {
            bold: "AST & Vector Parsing",
            text: "Extracts developer capability directly from code syntax ASTs & dependencies."
          },
          {
            bold: "Cosine Delta Engine",
            text: "High-dimensional embeddings mapping candidates to market clusters."
          },
          {
            bold: "Project Generator",
            text: "Suggests exact PRs & repos to build for maximum portfolio uplift."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slideNumber: "02",
    title: "SYSTEM ARCHITECTURE & METHODOLOGY",
    subtitle: "End-to-End AST & Vector Processing Pipeline",
    architectureSteps: [
      {
        step: "1",
        title: "Profile Ingestion",
        description: "Resumes, GitHub Repos & Transcripts",
        subtext: "Multi-modal input parser"
      },
      {
        step: "2",
        title: "Entity & AST Extraction",
        description: "Gemini LLM / PyPDF Parser",
        subtext: "Tree-sitter & Syntax Extractor"
      },
      {
        step: "3",
        title: "Vector Delta Engine",
        description: "ChromaDB Cosine Similarity",
        subtext: "High-dimensional Embedding Matching"
      },
      {
        step: "4",
        title: "Sprint Roadmap",
        description: "Interactive Radar & Sprint Tasks",
        subtext: "30-Day Practical Milestones"
      }
    ],
    cards: [
      {
        title: "Technologies Used",
        icon: "Code2",
        points: [
          { bold: "Frontend Visualizer", text: "React 18, Tailwind CSS, Recharts (Radar Visualizer)" },
          { bold: "Backend Infrastructure", text: "FastAPI / Express REST endpoints, Async processing" },
          { bold: "AI & Vector Layer", text: "Gemini API, ChromaDB Vector Store, LangChain" },
          { bold: "Data & Code Ingestion", text: "PostgreSQL / JSON Store, GitHub REST API v3" }
        ]
      },
      {
        title: "Implementation Methodology",
        icon: "Workflow",
        points: [
          {
            bold: "Market Scraper",
            text: "Index active tech job postings into high-dimensional vector clusters."
          },
          {
            bold: "Semantic Gap Calculation",
            text: "Measure standard distance between student skill vectors and live market baseline."
          },
          {
            bold: "Automated Sprint Plan",
            text: "LLM crafts 30-day practical tasks (e.g., 'Add Redis caching to backend repo')."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    slideNumber: "03",
    title: "FEASIBILITY AND VIABILITY",
    subtitle: "Technical, Operational, and Financial Soundness",
    cards: [
      {
        title: "Feasibility Analysis",
        icon: "CheckCircle2",
        points: [
          { bold: "Technical", text: "Built on robust open-source stacks (FastAPI, React) and accessible LLM APIs (Gemini)." },
          { bold: "Operational", text: "Seamless web portal requiring zero installation for students or universities." },
          { bold: "Financial", text: "Low infrastructure overhead utilizing serverless vector stores and lightweight API endpoints." }
        ]
      },
      {
        title: "Potential Challenges & Risks",
        icon: "AlertTriangle",
        points: [
          { bold: "Unstructured Resumes", text: "High variance in resume formatting and non-standard project descriptions." },
          { bold: "GitHub API Limits", text: "Rate limits when parsing large public student repositories." },
          { bold: "Dynamic Tech Drift", text: "Rapid shifting of popular stack trends and tool versions." }
        ]
      },
      {
        title: "Mitigation Strategies",
        icon: "ShieldCheck",
        points: [
          { bold: "LLM Normalization", text: "Use Gemini structured schema output to standardize resume data into JSON." },
          { bold: "Caching & Webhooks", text: "Cache GitHub repo ASTs and vector embeddings to minimize API calls." },
          { bold: "Continuous Ingestion", text: "Automated weekly scrapers updating job description vector clusters." }
        ]
      }
    ]
  },
  {
    id: 4,
    slideNumber: "04",
    title: "IMPACT AND BENEFITS",
    subtitle: "Transforming the Placement & Hiring Paradigm",
    cards: [
      {
        title: "Target Audience Impact",
        icon: "Users",
        points: [
          { bold: "Engineering Graduates & Job Seekers", text: "Eliminates guess-work by highlighting exact technical deficiencies before applying to roles." },
          { bold: "Universities & Academic Training Cells", text: "Provides macro analytics on batch-wide skill gaps to update elective syllabi in real-time." },
          { bold: "Recruiters & Tech Employers", text: "Connects with candidates who have verified, project-tested skills matching immediate job requirements." }
        ]
      },
      {
        title: "Measurable Benefits & Outcomes",
        icon: "TrendingUp",
        points: [
          { bold: "Up to 85% Reduction", text: "In technical interview rejection caused by practical skill gaps." },
          { bold: "30-Day Targeted Sprints", text: "Accelerated practical milestone projects instead of 6-month generic theory courses." },
          { bold: "Faster Onboarding", text: "Decreases corporate onboarding and retraining periods for fresh college hires." }
        ]
      }
    ],
    tableData: {
      columns: ["Stakeholder Category", "Traditional Academic Ecosystem", "SkillBridge AI Transformation"],
      rows: [
        {
          category: "CS Student",
          traditional: "Learns static syllabus, blind to modern production tools",
          skillBridge: "Receives personalized 30-day project sprints matching live JDs"
        },
        {
          category: "University T&P Cell",
          traditional: "Relies on historic placement metrics and generic workshops",
          skillBridge: "Accesses real-time data radar on batch skill readiness"
        }
      ]
    }
  },
  {
    id: 5,
    slideNumber: "05",
    title: "RESEARCH AND REFERENCES",
    subtitle: "Empirical Studies and Technical Foundations",
    referencesList: [
      {
        category: "Key Industry Benchmarks & Data",
        icon: "BookOpen",
        items: [
          {
            bold: "National Employability Reports (NASSCOM / Aspiring Minds)",
            text: "Highlights that over 75% of computer science engineering graduates lack industry-ready practical coding & DevOps competencies."
          },
          {
            bold: "WEF Future of Jobs Report",
            text: "Emphasizes technological displacement and the critical urgency of modular, project-based micro-upskilling."
          },
          {
            bold: "GitHub Developer Ecosystem Survey",
            text: "Demonstrates that candidate involvement in open-source & containerized repos increases interview conversion by 3x."
          }
        ]
      },
      {
        category: "Technical Frameworks & References",
        icon: "Link2",
        items: [
          {
            bold: "Vector Similarity & Embedding Taxonomies",
            text: "Utilizing ChromaDB vector indices and Cosine Distance algorithms for semantic skill mapping."
          },
          {
            bold: "Abstract Syntax Tree (AST) Parsing",
            text: "Python `ast` module & Tree-sitter for extracting code complexity from student repos."
          },
          {
            bold: "Google Gemini API Documentation",
            text: "Named Entity Recognition (NER) for resume parsing & structured task JSON generation."
          },
          {
            bold: "Open-Source References",
            text: "LangChain framework for multi-modal resume parsing pipelines."
          }
        ]
      }
    ]
  }
];
