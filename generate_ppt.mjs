import pptxgen from 'pptxgenjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_16x9'
pptx.author = 'Aditya Sehgal'
pptx.company = 'ResumeAI'
pptx.subject = 'ResumeAI Project Presentation'
pptx.title = 'ResumeAI - Next-Gen AI Career & Resume Intelligence Platform'

// Colors
const BG_DARK = '060F1B'
const CARD_BG = '0A1E33'
const CARD_BORDER = '1E3D5C'
const TEXT_LIGHT = 'F0F8FF'
const TEXT_MUTED = '9CB0C7'
const ACCENT_CYAN = '4FE4F7'
const ACCENT_GREEN = '6EE7B7'
const ACCENT_PURPLE = 'A78BFA'
const ACCENT_ORANGE = 'FBBF24'

function addHeader(slide, category, title) {
  slide.background = { color: BG_DARK }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: ACCENT_CYAN }, line: { color: ACCENT_CYAN }
  })

  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 10, h: 0.3,
    fontSize: 10, fontFace: 'Arial', bold: true, color: ACCENT_CYAN, letterSpacing: 2
  })

  slide.addText(title, {
    x: 0.8, y: 0.75, w: 11, h: 0.5,
    fontSize: 22, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
  })

  slide.addText('ResumeAI · Next-Gen AI Career Intelligence Platform', {
    x: 0.8, y: 7.1, w: 9, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: '486581'
  })
}

// ----------------------------------------------------
// SLIDE 1: Title Slide
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  slide.background = { color: BG_DARK }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.12,
    fill: { color: ACCENT_CYAN }, line: { color: ACCENT_CYAN }
  })

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 3.2, h: 0.45, r: 0.2,
    fill: { color: '102A45' }, line: { color: '205080', width: 1 }
  })
  slide.addText('✨ AI-POWERED CAREER PLATFORM', {
    x: 0.8, y: 1.6, w: 3.2, h: 0.45,
    fontSize: 10, fontFace: 'Arial', bold: true, color: ACCENT_CYAN, align: 'center', valign: 'middle'
  })

  slide.addText('ResumeAI', {
    x: 0.8, y: 2.3, w: 11, h: 1.1,
    fontSize: 48, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
  })

  slide.addText('Next-Gen AI-Powered Career Intelligence, ATS Optimization, and Interview Mastery Platform', {
    x: 0.8, y: 3.4, w: 10.5, h: 0.8,
    fontSize: 18, fontFace: 'Arial', color: ACCENT_CYAN, lineSpacing: 24
  })

  slide.addText('Empowering tech candidates with real-time multi-dimensional ATS evaluation, domain-aware career roadmapping, executive bullet rewriting, and interactive STAR interview simulations.', {
    x: 0.8, y: 4.3, w: 10.5, h: 0.8,
    fontSize: 13, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 20
  })

  const stats = [
    { label: 'Core Capabilities', val: '6 End-to-End Tools', color: ACCENT_CYAN },
    { label: 'Architecture', val: 'React 19 + Node.js + SQLite', color: ACCENT_GREEN },
    { label: 'Resilience', val: '100% Heuristic Fallback', color: ACCENT_PURPLE },
    { label: 'Security', val: 'Audit Logging & Zero-Trust', color: ACCENT_ORANGE }
  ]

  stats.forEach((s, idx) => {
    const x = 0.8 + idx * 2.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 5.5, w: 2.8, h: 1.3, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })
    slide.addText(s.label.toUpperCase(), {
      x, y: 5.65, w: 2.8, h: 0.25,
      fontSize: 9, fontFace: 'Arial', bold: true, color: TEXT_MUTED, align: 'center'
    })
    slide.addText(s.val, {
      x: x + 0.1, y: 5.95, w: 2.6, h: 0.65,
      fontSize: 13, fontFace: 'Arial', bold: true, color: s.color, align: 'center', valign: 'middle'
    })
  })
}

// ----------------------------------------------------
// SLIDE 2: Executive Summary & Project Vision
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Executive Overview', 'Mission: Revolutionizing Tech Career Trajectories')

  const pillars = [
    {
      title: '🎯 Overcoming the ATS Black Box',
      desc: 'Over 75% of resumes are discarded by automated Applicant Tracking Systems before a human recruiter reviews them. ResumeAI decodes keyword matching, structure, formatting, and action verbs in real-time.',
      tag: 'ATS Optimization',
      color: ACCENT_CYAN
    },
    {
      title: '🚀 Dynamic Growth Roadmaps',
      desc: 'Bridge skill gaps with market-aligned compensation analytics, 3-tier milestone progression ladders, and custom portfolio project blueprints tailored to specific engineering disciplines.',
      tag: 'Career Intelligence',
      color: ACCENT_GREEN
    },
    {
      title: '💼 Executive Impact Framing',
      desc: 'Transforms passive job duty descriptions into high-conversion executive achievements using Google X-Y-Z and STAR methodologies with instant visual score comparisons.',
      tag: 'AI Bullet Rewriting',
      color: ACCENT_PURPLE
    }
  ]

  pillars.forEach((p, idx) => {
    const x = 0.8 + idx * 3.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 3.8, h: 5.0, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.3, y: 1.9, w: 2.2, h: 0.35, r: 0.1,
      fill: { color: '102A45' }, line: { color: p.color, width: 1 }
    })
    slide.addText(p.tag, {
      x: x + 0.3, y: 1.9, w: 2.2, h: 0.35,
      fontSize: 9, fontFace: 'Arial', bold: true, color: p.color, align: 'center', valign: 'middle'
    })
    slide.addText(p.title, {
      x: x + 0.3, y: 2.4, w: 3.2, h: 0.8,
      fontSize: 15, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })
    slide.addText(p.desc, {
      x: x + 0.3, y: 3.3, w: 3.2, h: 3.0,
      fontSize: 12, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 18
    })
  })
}

// ----------------------------------------------------
// SLIDE 3: The Problem Space
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Problem Statement', 'The Modern Hiring Bottleneck for Tech Professionals')

  const problems = [
    {
      stat: '75%+',
      title: 'Automated ATS Discard Rate',
      desc: 'Resumes are filtered out instantly due to formatting parsing errors, missing hard technical keywords, and unstandardized section headers.'
    },
    {
      stat: '6 Sec',
      title: 'Average Recruiter Scan Time',
      desc: 'Recruiters spend an average of 6 seconds per resume. Passive descriptions ("Responsible for APIs") fail to demonstrate quantifiable business ROI.'
    },
    {
      stat: '< 5%',
      title: 'Cold Outreach Response Rate',
      desc: 'Generic cover letters and uninspiring LinkedIn messages result in poor recruiter conversion and missed high-impact opportunities.'
    },
    {
      stat: 'Static',
      title: 'Lack of Role-Specific Direction',
      desc: 'Candidates lack visibility into salary benchmarks, key industry skill gaps, and the exact production projects required for senior elevation.'
    }
  ]

  problems.forEach((item, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const x = 0.8 + col * 5.9
    const y = 1.6 + row * 2.6

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.7, h: 2.35, r: 0.15,
      fill: { color: CARD_BG }, line: { color: '301B2E', width: 1 }
    })

    slide.addText(item.stat, {
      x: x + 0.3, y: y + 0.25, w: 1.8, h: 0.6,
      fontSize: 26, fontFace: 'Arial', bold: true, color: 'F87171'
    })

    slide.addText(item.title, {
      x: x + 2.0, y: y + 0.25, w: 3.4, h: 0.6,
      fontSize: 14, fontFace: 'Arial', bold: true, color: TEXT_LIGHT, valign: 'middle'
    })

    slide.addText(item.desc, {
      x: x + 0.3, y: y + 0.95, w: 5.1, h: 1.2,
      fontSize: 11.5, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 16
    })
  })
}

// ----------------------------------------------------
// SLIDE 4: Comprehensive Feature Suite
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Solution Architecture', 'ResumeAI Core Feature Ecosystem')

  const features = [
    { title: '📊 ATS Resume Analyzer', desc: '4-dimension scoring (Overall, ATS, Keywords, Impact), keyword gap visualizer, and section-by-section health checks.', color: ACCENT_CYAN },
    { title: '🗺️ Dynamic Career Roadmap', desc: 'Domain-aware progression ladders (AI/ML, DevOps, Frontend, Cybersecurity) with salary ranges & project blueprints.', color: ACCENT_GREEN },
    { title: '✍️ AI Bullet Rewriter', desc: '4 executive formulas (Google X-Y-Z, STAR, Leadership, Technical) with instant visual impact score gains.', color: ACCENT_PURPLE },
    { title: '✉️ Cover Letter & LinkedIn Modal', desc: 'Tabbed in-modal editor, tone selector (Professional, Technical, Executive), live word count, and 1-click export.', color: ACCENT_ORANGE },
    { title: '🏆 STAR Interview Simulator', desc: 'Role-targeted Technical, Behavioral, and HR questions with interactive STAR evaluation breakdown.', color: ACCENT_CYAN },
    { title: '🛡️ Enterprise Security & Logs', desc: 'Persistent SQLite sign-in auditing, IP/User-Agent tracking, brute-force mitigation, and CSV log export.', color: ACCENT_GREEN }
  ]

  features.forEach((f, idx) => {
    const col = idx % 3
    const row = Math.floor(idx / 3)
    const x = 0.8 + col * 3.95
    const y = 1.6 + row * 2.6

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 3.8, h: 2.35, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(f.title, {
      x: x + 0.3, y: y + 0.25, w: 3.2, h: 0.5,
      fontSize: 13.5, fontFace: 'Arial', bold: true, color: f.color
    })

    slide.addText(f.desc, {
      x: x + 0.3, y: y + 0.8, w: 3.2, h: 1.35,
      fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 16
    })
  })
}

// ----------------------------------------------------
// SLIDE 5: Technical Architecture
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Technology & Stack', 'Modern, Robust, and Resilient Architecture')

  const layers = [
    {
      layer: 'FRONTEND CLIENT',
      tech: 'React 19 + TypeScript + Vite',
      details: [
        'Modular component architecture with type-safe state management',
        'Custom Cyber-Glass UI with responsive CSS Grid & Flexbox layouts',
        'Recharts interactive analytics visualization (Pie & Bar charts)',
        'Framer Motion smooth micro-interactions & Lucide vector iconography'
      ],
      color: ACCENT_CYAN
    },
    {
      layer: 'BACKEND API & SECURITY',
      tech: 'Node.js + Native SQLite Engine',
      details: [
        'High-performance REST API with zero unnecessary runtime bloat',
        'Persistent SQLite with WAL mode, indices, and prepared statements',
        'bcrypt password hashing, HTTP-only secure cookie sessions',
        'Brute-force protection and comprehensive sign-in audit logger'
      ],
      color: ACCENT_GREEN
    },
    {
      layer: 'INTELLIGENCE & AI ENGINE',
      tech: 'OpenAI GPT-4o + Heuristic Fallback',
      details: [
        'Multi-stage prompts generating structured JSON outputs',
        'Domain-aware heuristic engine guaranteeing 100% offline resilience',
        'Executive bullet formula transformations with quantifiable metrics',
        'Domain dictionary for AI/ML, DevOps, Web, Security, and Cloud'
      ],
      color: ACCENT_PURPLE
    }
  ]

  layers.forEach((l, idx) => {
    const x = 0.8 + idx * 3.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 3.8, h: 5.0, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(l.layer, {
      x: x + 0.3, y: 1.85, w: 3.2, h: 0.25,
      fontSize: 9, fontFace: 'Arial', bold: true, color: l.color, letterSpacing: 1
    })

    slide.addText(l.tech, {
      x: x + 0.3, y: 2.15, w: 3.2, h: 0.6,
      fontSize: 14, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })

    l.details.forEach((d, dIdx) => {
      slide.addText(`•  ${d}`, {
        x: x + 0.3, y: 2.9 + dIdx * 0.9, w: 3.2, h: 0.85,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 15
      })
    })
  })
}

// ----------------------------------------------------
// SLIDE 6: Feature Deep Dive — ATS Analyzer & Gap Engine
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Feature Deep Dive', 'ATS Resume Analyzer & Keyword Gap Engine')

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 5.7, h: 5.0, r: 0.15,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  })

  slide.addText('Multi-Dimensional ATS Scoring Matrix', {
    x: 1.1, y: 1.9, w: 5.1, h: 0.4,
    fontSize: 15, fontFace: 'Arial', bold: true, color: ACCENT_CYAN
  })

  const scores = [
    { name: 'Overall Market Readiness', score: '88/100', desc: 'Composite index of overall candidate competitiveness' },
    { name: 'ATS Parse Compatibility', score: '92%', desc: 'Heading recognizability, standard layout, font readability' },
    { name: 'Target Keyword Coverage', score: '85%', desc: 'Match density against required job technologies' },
    { name: 'Impact & Quantification', score: '90/100', desc: 'Ratio of quantifiable metrics and active ownership verbs' }
  ]

  scores.forEach((s, idx) => {
    const y = 2.45 + idx * 1.0
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y, w: 5.1, h: 0.85, r: 0.1,
      fill: { color: '051221' }, line: { color: '1C3854', width: 1 }
    })
    slide.addText(s.name, {
      x: 1.25, y: y + 0.1, w: 3.5, h: 0.3,
      fontSize: 11.5, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })
    slide.addText(s.score, {
      x: 4.8, y: y + 0.1, w: 1.2, h: 0.3,
      fontSize: 13, fontFace: 'Arial', bold: true, color: ACCENT_GREEN, align: 'right'
    })
    slide.addText(s.desc, {
      x: 1.25, y: y + 0.4, w: 4.7, h: 0.35,
      fontSize: 9.5, fontFace: 'Arial', color: TEXT_MUTED
    })
  })

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.6, w: 5.7, h: 5.0, r: 0.15,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  })

  slide.addText('Real-Time Gap & Recommendation Engine', {
    x: 7.1, y: 1.9, w: 5.1, h: 0.4,
    fontSize: 15, fontFace: 'Arial', bold: true, color: ACCENT_GREEN
  })

  const rightBullets = [
    { title: 'Interactive Matched vs Missing Skills Visualizer', desc: 'Calculates skill overlap dynamically against job requirements with interactive donut charts.' },
    { title: 'Section-by-Section Health Status', desc: 'Inspects Experience, Education, Projects, and Summary with clear status tags (Strong / Review / Missing).' },
    { title: 'Actionable Resume Fixes List', desc: 'Prioritized, step-by-step guidance on structural improvements, bullet phrasing, and missing credentials.' },
    { title: 'Persistent Report History & Comparison', desc: 'Saves reports to SQLite database for instant tracking of resume iterations and ATS score improvements.' }
  ]

  rightBullets.forEach((b, idx) => {
    const y = 2.45 + idx * 1.0
    slide.addText(`✔  ${b.title}`, {
      x: 7.1, y, w: 5.1, h: 0.3,
      fontSize: 12, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })
    slide.addText(b.desc, {
      x: 7.35, y: y + 0.3, w: 4.8, h: 0.55,
      fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 15
    })
  })
}

// ----------------------------------------------------
// SLIDE 7: Feature Deep Dive — Dynamic Career Roadmap
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Feature Deep Dive', 'Domain-Aware Dynamic Career Intelligence Engine')

  const domains = [
    {
      title: '🤖 AI & Machine Learning',
      salary: '$105k – $320k+',
      milestone: 'PyTorch, RAG, LoRA Fine-Tuning, vLLM Serving',
      project: 'Autonomous Multi-Agent Research Assistant',
      color: ACCENT_CYAN
    },
    {
      title: '🎨 Frontend Engineering',
      salary: '$80k – $225k+',
      milestone: 'React 19, Next.js, CRDTs (Yjs), Core Web Vitals',
      project: 'Real-Time Multiplayer Collaborative Canvas',
      color: ACCENT_GREEN
    },
    {
      title: '⚙️ Backend Systems',
      salary: '$90k – $250k+',
      milestone: 'Go, Kafka, Redis Caching, Saga Distributed TX',
      project: 'High-Throughput Ledger & Security Proxy',
      color: ACCENT_PURPLE
    },
    {
      title: '☁️ Cloud & DevOps',
      salary: '$95k – $260k+',
      milestone: 'Kubernetes, ArgoCD GitOps, Istio Mesh, Terraform',
      project: 'Self-Healing Kubernetes Multi-Tenant Platform',
      color: ACCENT_ORANGE
    }
  ]

  domains.forEach((d, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const x = 0.8 + col * 5.9
    const y = 1.6 + row * 2.6

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.7, h: 2.35, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(d.title, {
      x: x + 0.3, y: y + 0.2, w: 3.5, h: 0.35,
      fontSize: 14, fontFace: 'Arial', bold: true, color: d.color
    })

    slide.addText(d.salary, {
      x: x + 3.8, y: y + 0.2, w: 1.6, h: 0.35,
      fontSize: 12, fontFace: 'Arial', bold: true, color: ACCENT_GREEN, align: 'right'
    })

    slide.addText(`• Core Skills Focus: ${d.milestone}`, {
      x: x + 0.3, y: y + 0.65, w: 5.1, h: 0.55,
      fontSize: 11, fontFace: 'Arial', color: TEXT_LIGHT, lineSpacing: 15
    })

    slide.addText(`• Portfolio Blueprint: ${d.project}`, {
      x: x + 0.3, y: y + 1.25, w: 5.1, h: 0.55,
      fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 15
    })

    slide.addText('Includes: 3 Progression Milestones · Per-Role Skill Tracker · Market Demand Index', {
      x: x + 0.3, y: y + 1.85, w: 5.1, h: 0.3,
      fontSize: 9.5, fontFace: 'Arial', color: '486581'
    })
  })
}

// ----------------------------------------------------
// SLIDE 8: Feature Deep Dive — AI Bullet Rewriter
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Feature Deep Dive', 'Executive Bullet Rewriter with 4 Impact Formulas')

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 11.7, h: 1.5, r: 0.15,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  })

  slide.addText('BEFORE (Score: 48/100 · Weak / Passive):', {
    x: 1.1, y: 1.75, w: 11.1, h: 0.25,
    fontSize: 10, fontFace: 'Arial', bold: true, color: 'F87171'
  })
  slide.addText('"Responsible for maintaining backend APIs, fixing bugs, and improving database speed."', {
    x: 1.1, y: 2.0, w: 11.1, h: 0.35,
    fontSize: 12, fontFace: 'Arial', color: 'FCA5A5', italic: true
  })

  slide.addText('AFTER (Score: 94/100 · Executive / High-Impact):', {
    x: 1.1, y: 2.35, w: 11.1, h: 0.25,
    fontSize: 10, fontFace: 'Arial', bold: true, color: ACCENT_GREEN
  })
  slide.addText('"Architected distributed caching layer across 14 microservices using Redis and Go, slashing p99 latency from 180ms to 42ms and scaling throughput by 3.2x for 2.5M daily active users."', {
    x: 1.1, y: 2.6, w: 11.1, h: 0.45,
    fontSize: 11.5, fontFace: 'Arial', color: '6EE7B7', bold: true
  })

  const formulas = [
    { title: 'Google X-Y-Z Formula', desc: 'Accomplished [X], as measured by [Y], by doing [Z]', metric: '+46 pts delta', color: ACCENT_CYAN },
    { title: 'STAR Metric Method', desc: 'Situation, Task, Action, and Quantifiable Result', metric: '+42 pts delta', color: ACCENT_GREEN },
    { title: 'High-Velocity Leadership', desc: 'Cross-functional alignment & organizational velocity', metric: '+40 pts delta', color: ACCENT_PURPLE },
    { title: 'Technical Depth & Scale', desc: 'Architecture, high-concurrency, and reliability focus', metric: '+44 pts delta', color: ACCENT_ORANGE }
  ]

  formulas.forEach((f, idx) => {
    const x = 0.8 + idx * 2.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 3.3, w: 2.8, h: 3.3, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })
    slide.addText(f.title, {
      x: x + 0.2, y: 3.5, w: 2.4, h: 0.55,
      fontSize: 13, fontFace: 'Arial', bold: true, color: f.color
    })
    slide.addText(f.desc, {
      x: x + 0.2, y: 4.15, w: 2.4, h: 1.3,
      fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 16
    })
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: 5.8, w: 2.4, h: 0.5, r: 0.1,
      fill: { color: '051221' }, line: { color: '1C3854', width: 1 }
    })
    slide.addText(`Impact Gain: ${f.metric}`, {
      x: x + 0.2, y: 5.8, w: 2.4, h: 0.5,
      fontSize: 10, fontFace: 'Arial', bold: true, color: ACCENT_GREEN, align: 'center', valign: 'middle'
    })
  })
}

// ----------------------------------------------------
// SLIDE 9: Feature Deep Dive — Cover Letter & Outreach
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Feature Deep Dive', 'AI Outreach Generator: Cover Letters & LinkedIn Pitch')

  const outreachCards = [
    {
      title: '📄 Tailored Cover Letter Engine',
      points: [
        'Synthesizes resume strengths and job description gaps into a compelling 3-4 paragraph narrative',
        'Includes role-specific achievements and strategic company alignment hooks',
        'Live in-modal text editor with real-time word and character counters'
      ],
      color: ACCENT_CYAN
    },
    {
      title: '💬 High-Conversion LinkedIn Pitch',
      points: [
        'Short, highly targeted cold outreach messages optimized for recruiter response rates',
        'Live character length indicator (<300 char connection note limit guidance)',
        'Polite, professional call-to-action designed for 10-minute introductory chats'
      ],
      color: ACCENT_PURPLE
    },
    {
      title: '🎭 Multi-Tone Adaptation',
      points: [
        'Professional & Impactful: Balanced standard business polish for corporate roles',
        'Direct & Technical: Architecture & metric-heavy focus for engineering leads',
        'Executive & Leadership: Strategic business ROI and team velocity perspective'
      ],
      color: ACCENT_GREEN
    }
  ]

  outreachCards.forEach((c, idx) => {
    const x = 0.8 + idx * 3.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 3.8, h: 5.0, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(c.title, {
      x: x + 0.3, y: 1.9, w: 3.2, h: 0.6,
      fontSize: 14, fontFace: 'Arial', bold: true, color: c.color
    })

    c.points.forEach((pt, ptIdx) => {
      slide.addText(`•  ${pt}`, {
        x: x + 0.3, y: 2.7 + ptIdx * 1.3, w: 3.2, h: 1.2,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 16
      })
    })
  })
}

// ----------------------------------------------------
// SLIDE 10: Feature Deep Dive — STAR Interview Simulator & Security
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Feature Deep Dive', 'STAR Interview Simulator & Enterprise Security Audit')

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.6, w: 5.7, h: 5.0, r: 0.15,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  })

  slide.addText('🏆 STAR Interview Simulator', {
    x: 1.1, y: 1.9, w: 5.1, h: 0.4,
    fontSize: 16, fontFace: 'Arial', bold: true, color: ACCENT_CYAN
  })

  const starItems = [
    { letter: 'S', title: 'Situation', desc: 'Sets background context and business environment' },
    { letter: 'T', title: 'Task', desc: 'Defines the core technical objective or challenge' },
    { letter: 'A', title: 'Action', desc: 'Demonstrates personal ownership and technical execution' },
    { letter: 'R', title: 'Result', desc: 'Delivers measurable metrics, % gains, and outcomes' }
  ]

  starItems.forEach((st, idx) => {
    const y = 2.45 + idx * 0.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1, y, w: 5.1, h: 0.8, r: 0.1,
      fill: { color: '051221' }, line: { color: '1C3854', width: 1 }
    })
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.25, y: y + 0.15, w: 0.5, h: 0.5,
      fill: { color: ACCENT_CYAN }
    })
    slide.addText(st.letter, {
      x: 1.25, y: y + 0.15, w: 0.5, h: 0.5,
      fontSize: 12, fontFace: 'Arial', bold: true, color: '000000', align: 'center', valign: 'middle'
    })
    slide.addText(st.title, {
      x: 1.9, y: y + 0.1, w: 4.1, h: 0.3,
      fontSize: 12, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })
    slide.addText(st.desc, {
      x: 1.9, y: y + 0.38, w: 4.1, h: 0.35,
      fontSize: 9.5, fontFace: 'Arial', color: TEXT_MUTED
    })
  })

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.6, w: 5.7, h: 5.0, r: 0.15,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  })

  slide.addText('🛡️ Enterprise Security & Access Logs', {
    x: 7.1, y: 1.9, w: 5.1, h: 0.4,
    fontSize: 16, fontFace: 'Arial', bold: true, color: ACCENT_GREEN
  })

  const secItems = [
    { title: 'Full Access History in SQLite', desc: 'Logs signups, successful logins, and failed attempts with IP address, user agent, and timestamp.' },
    { title: 'Brute-Force Attack Mitigation', desc: 'Tracks failed authentication attempts with reason codes and rate limiting defense.' },
    { title: 'In-App Security Audit Viewer', desc: 'Account security modal displaying live authentication activity with instant CSV export.' },
    { title: 'Privacy-First Architecture', desc: 'All resume data stays inside user-controlled SQLite database with zero third-party data selling.' }
  ]

  secItems.forEach((sc, idx) => {
    const y = 2.45 + idx * 0.95
    slide.addText(`🔒  ${sc.title}`, {
      x: 7.1, y, w: 5.1, h: 0.3,
      fontSize: 12, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })
    slide.addText(sc.desc, {
      x: 7.35, y: y + 0.3, w: 4.8, h: 0.5,
      fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 15
    })
  })
}

// ----------------------------------------------------
// SLIDE 11: Competitive Advantage
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Market Advantage', 'Why ResumeAI Outperforms Generic Tools')

  const advantages = [
    {
      metric: '100% Offline',
      label: 'Zero-Downtime Resilience',
      desc: 'Engineered with comprehensive heuristic fallbacks. Never crashes even if OpenAI API is unavailable or rate-limited.',
      color: ACCENT_CYAN
    },
    {
      metric: '6-in-1',
      label: 'Unified Career Suite',
      desc: 'Combines ATS parser, career roadmap, rewriter, outreach generator, interview practice, and audit logging in one seamless UI.',
      color: ACCENT_GREEN
    },
    {
      metric: 'Zero Lock-in',
      label: 'Self-Hosted & Private',
      desc: 'Runs locally or in private cloud with zero mandatory subscription fees or proprietary cloud vendor lock-ins.',
      color: ACCENT_PURPLE
    },
    {
      metric: '< 500ms',
      label: 'Sub-Second Performance',
      desc: 'Optimized Vite/React client and zero-dependency native Node.js SQLite server delivering instantaneous response times.',
      color: ACCENT_ORANGE
    }
  ]

  advantages.forEach((a, idx) => {
    const col = idx % 2
    const row = Math.floor(idx / 2)
    const x = 0.8 + col * 5.9
    const y = 1.6 + row * 2.6

    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.7, h: 2.35, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(a.metric, {
      x: x + 0.3, y: y + 0.25, w: 2.2, h: 0.5,
      fontSize: 22, fontFace: 'Arial', bold: true, color: a.color
    })

    slide.addText(a.label, {
      x: x + 2.5, y: y + 0.25, w: 2.9, h: 0.5,
      fontSize: 13.5, fontFace: 'Arial', bold: true, color: TEXT_LIGHT, valign: 'middle'
    })

    slide.addText(a.desc, {
      x: x + 0.3, y: y + 0.85, w: 5.1, h: 1.3,
      fontSize: 11.5, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 17
    })
  })
}

// ----------------------------------------------------
// SLIDE 12: Future Roadmap & Growth Horizons
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  addHeader(slide, 'Future Horizon', 'Strategic Product Roadmap & Innovations')

  const phases = [
    {
      phase: 'PHASE 1 (Current)',
      title: 'Core Platform & AI Foundation',
      items: [
        'ATS scoring & keyword gap analysis',
        'Dynamic career roadmaps & compensation',
        'Executive bullet rewriter & STAR generator',
        'Audit access logs & SQLite persistence'
      ],
      color: ACCENT_CYAN
    },
    {
      phase: 'PHASE 2 (Upcoming)',
      title: 'Multi-Agent Intelligence & Automation',
      items: [
        'Multi-Agent debate panel (Recruiter vs Hiring Manager vs ATS parser)',
        'Automated 1-click Chrome extension for LinkedIn job matching',
        'PDF generation with ATS-safe vector typography'
      ],
      color: ACCENT_GREEN
    },
    {
      phase: 'PHASE 3 (Vision)',
      title: 'Full Autonomous Career Companion',
      items: [
        'Real-time voice & video mock interview simulation with speech feedback',
        'Automated job application tracking & CRM',
        'Personalized continuous career mentor'
      ],
      color: ACCENT_PURPLE
    }
  ]

  phases.forEach((p, idx) => {
    const x = 0.8 + idx * 3.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.6, w: 3.8, h: 5.0, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })

    slide.addText(p.phase, {
      x: x + 0.3, y: 1.85, w: 3.2, h: 0.25,
      fontSize: 9, fontFace: 'Arial', bold: true, color: p.color, letterSpacing: 1
    })

    slide.addText(p.title, {
      x: x + 0.3, y: 2.15, w: 3.2, h: 0.6,
      fontSize: 13.5, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
    })

    p.items.forEach((it, itIdx) => {
      slide.addText(`•  ${it}`, {
        x: x + 0.3, y: 2.9 + itIdx * 0.9, w: 3.2, h: 0.85,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 15
      })
    })
  })
}

// ----------------------------------------------------
// SLIDE 13: Summary & Conclusion
// ----------------------------------------------------
{
  const slide = pptx.addSlide()
  slide.background = { color: BG_DARK }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.12,
    fill: { color: ACCENT_CYAN }, line: { color: ACCENT_CYAN }
  })

  slide.addText('CONCLUSION & IMPACT', {
    x: 0.8, y: 1.4, w: 10, h: 0.3,
    fontSize: 11, fontFace: 'Arial', bold: true, color: ACCENT_CYAN, letterSpacing: 2
  })

  slide.addText('Empowering the Next Generation of Tech Talent', {
    x: 0.8, y: 1.8, w: 11.5, h: 0.8,
    fontSize: 32, fontFace: 'Arial', bold: true, color: TEXT_LIGHT
  })

  slide.addText('ResumeAI closes the divide between talented engineers and high-impact careers by providing an end-to-end intelligence platform that transforms resumes, accelerates skill growth, and sharpens interview mastery.', {
    x: 0.8, y: 2.7, w: 11, h: 1.0,
    fontSize: 14, fontFace: 'Arial', color: TEXT_MUTED, lineSpacing: 22
  })

  const badges = [
    { title: 'GitHub Repository', val: 'Aditya-cmd-16/Resume_Main', color: ACCENT_CYAN },
    { title: 'Project Status', val: 'Production-Ready & Tested', color: ACCENT_GREEN },
    { title: 'Architecture', val: 'React 19 + Node + SQLite', color: ACCENT_PURPLE }
  ]

  badges.forEach((b, idx) => {
    const x = 0.8 + idx * 3.95
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y: 4.0, w: 3.8, h: 1.5, r: 0.15,
      fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
    })
    slide.addText(b.title.toUpperCase(), {
      x: x + 0.3, y: 4.25, w: 3.2, h: 0.25,
      fontSize: 9, fontFace: 'Arial', bold: true, color: TEXT_MUTED
    })
    slide.addText(b.val, {
      x: x + 0.3, y: 4.55, w: 3.2, h: 0.7,
      fontSize: 13, fontFace: 'Arial', bold: true, color: b.color
    })
  })

  slide.addText('Thank You! Open for Questions & Live Demonstration.', {
    x: 0.8, y: 6.1, w: 11, h: 0.6,
    fontSize: 18, fontFace: 'Arial', bold: true, color: ACCENT_CYAN, align: 'center'
  })
}

// Write to PPTX file
const outputPath = path.join(__dirname, 'ResumeAI_Project_Presentation.pptx')
await pptx.writeFile({ fileName: outputPath })
console.log(`✅ PowerPoint presentation successfully generated at: ${outputPath}`)
