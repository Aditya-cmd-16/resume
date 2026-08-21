import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Layers,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  Send,
  Sparkles,
  TrendingUp,
  Trophy,
  Upload,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './styles.css'
import './overrides.css'
import './futuristic.css'

type Report = {
  id: string
  role: string
  filename?: string
  createdAt: string
  overall: number
  ats: number
  keyword: number
  impact: number
  formatting: number
  strengths: string[]
  concerns: string[]
  actions: string[]
  matched: string[]
  missing: string[]
  sections: { name: string; status: 'strong' | 'review' | 'missing'; note: string }[]
}

type CareerMilestone = {
  level: string
  duration: string
  objective: string
  keyActions: string[]
  targetDeliverables: string
}

type SkillItem = {
  name: string
  status: 'learned' | 'gap' | 'recommended'
  recommendedCourse: string
}

type SkillCategory = {
  category: string
  description: string
  skills: SkillItem[]
}

type ProjectBlueprint = {
  id: string
  title: string
  summary: string
  techStack: string[]
  keyChallenges: string[]
  recruiterImpactMetric: string
}

type CareerRoadmapData = {
  role: string
  demandIndex: string
  salaryRanges: { entry: string; mid: string; senior: string }
  milestones: CareerMilestone[]
  skillMatrix: SkillCategory[]
  projectBlueprints: ProjectBlueprint[]
}

type BulletRewriteItem = {
  style: string
  label: string
  text: string
  formula: string
  rationale: string
}

type BulletRewriteResponse = {
  original: string
  impactScore: { before: number; after: number }
  rewrites: BulletRewriteItem[]
}

type StarEvaluation = {
  overallScore: number
  starBreakdown: { situation: string; task: string; action: string; result: string }
  strengths: string[]
  improvements: string[]
  modelAnswer: string
}

const stopWords = new Set(
  'a an the and or of in to for with on at by from as is are was were be been being this that these those it its your our we you i my have has had will would should could can role job work years year experience skills required preferred ability strong excellent using use team business company'.split(
    ' '
  )
)
const actionVerbs = [
  'achieved',
  'built',
  'created',
  'delivered',
  'designed',
  'developed',
  'implemented',
  'improved',
  'increased',
  'launched',
  'led',
  'managed',
  'optimized',
  'reduced',
  'resolved',
  'scaled',
  'streamlined',
]

function terms(text: string) {
  return [
    ...new Set(
      (text.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) || []).filter(
        word => !stopWords.has(word) && !/^\d/.test(word)
      )
    ),
  ].slice(0, 120)
}

function analyze(resume: string, role: string, jobDescription: string, filename?: string): Report {
  const normalized = resume.toLowerCase()
  const has = (words: string[]) => words.some(word => normalized.includes(word))
  const sections = [
    { name: 'Contact details', keys: ['email', 'linkedin', 'github', 'phone'] },
    { name: 'Professional summary', keys: ['summary', 'profile', 'objective'] },
    { name: 'Experience', keys: ['experience', 'employment', 'work history'] },
    { name: 'Education', keys: ['education', 'university', 'college', 'bachelor', 'master'] },
    { name: 'Skills', keys: ['skills', 'technologies', 'technical skills'] },
  ].map(section => ({ name: section.name, present: has(section.keys) }))

  const figures = (resume.match(/(?:\$|₹|\d)[\d,.]*(?:\s?%|\s?(?:k|m|million|users|clients|hours|days|people))?/gi) || []).length
  const verbs = actionVerbs.filter(verb => normalized.includes(verb)).length
  const jdTerms = jobDescription ? terms(jobDescription) : []
  const matched = jdTerms.filter(term => normalized.includes(term)).slice(0, 18)
  const missing = jdTerms.filter(term => !normalized.includes(term)).slice(0, 12)
  const repetition = terms(resume)
    .filter(term => (normalized.match(new RegExp(`\\b${term.replace(/[.+#-]/g, '\\$&')}\\b`, 'g')) || []).length > 8)
    .slice(0, 3)

  const sectionScore = Math.round((sections.filter(s => s.present).length / sections.length) * 100)
  const impact = Math.min(100, 42 + figures * 7 + verbs * 5)
  const keyword = jobDescription
    ? Math.round((matched.length / Math.max(1, Math.min(jdTerms.length, 25))) * 100)
    : 55
  const formatting = Math.min(100, 55 + sectionScore / 2 + (resume.length > 600 ? 10 : 0))
  const ats = Math.round(sectionScore * 0.35 + keyword * 0.35 + formatting * 0.3)
  const overall = Math.round(ats * 0.55 + impact * 0.45)

  const strengths = [
    ...(sections.filter(s => s.present).length >= 4 ? ['Your resume includes most core ATS sections.'] : []),
    ...(figures >= 3 ? [`You use ${figures} measurable signals, which helps recruiters assess impact.`] : []),
    ...(matched.length >= 5 ? [`${matched.length} job-description terms appear in the resume.`] : []),
  ]

  const concerns = [
    ...sections.filter(s => !s.present).map(s => `${s.name} is not clearly labeled, which can reduce ATS readability.`),
    ...(figures < 3
      ? ['Few quantified outcomes were detected. Add honest scale, time, quality, or business-result measures where available.']
      : []),
    ...(jobDescription && missing.length
      ? [`${missing.length} relevant job-description terms are missing. Add only those you can substantiate.`]
      : []),
    ...(repetition.length
      ? [`Possible keyword repetition detected: ${repetition.join(', ')}. Avoid repeating terms without context.`]
      : []),
  ].slice(0, 5)

  const actions = [
    ...(figures < 3 ? ['Rewrite the two most recent experience bullets with a specific outcome and metric.'] : []),
    ...(jobDescription && missing.length
      ? [`Review these missing terms and incorporate truthful evidence where applicable: ${missing.slice(0, 5).join(', ')}.`]
      : []),
    ...(!has(['summary', 'profile']) ? [`Add a 2–3 line summary tailored to the ${role} role.`] : []),
    ...(!has(['skills', 'technical skills']) ? ['Add a focused skills section with tools and technologies you have used.'] : []),
  ].slice(0, 4)

  return {
    id: crypto.randomUUID(),
    role,
    filename,
    createdAt: new Date().toLocaleDateString(),
    overall,
    ats,
    keyword,
    impact,
    formatting,
    strengths: strengths.length ? strengths : ['The resume has usable content to build on.'],
    concerns: concerns.length ? concerns : ['No critical automated issues were detected; review role-specific language before applying.'],
    actions: actions.length ? actions : ['Tailor the summary and most relevant bullets to each job description.'],
    matched,
    missing,
    sections: sections.map(s => ({
      name: s.name,
      status: s.present ? 'strong' : 'missing',
      note: s.present ? 'Clearly represented in the submitted text.' : 'Add or use a conventional section heading.',
    })),
  }
}

function loadReports(): Report[] {
  try {
    return JSON.parse(localStorage.getItem('resumeai-reports') || '[]')
  } catch {
    return []
  }
}

function Shell({ children, user, onSignOut }: { children: React.ReactNode; user: string; onSignOut: () => void }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="logo" to="/">
          <span>✦</span> ResumeAI
        </Link>
        <p className="workspace">WORKSPACE</p>
        <nav>
          <NavLink to="/" end>
            <LayoutDashboard />
            Dashboard
          </NavLink>
          <NavLink to="/analyze">
            <ScanSearch />
            Analyze resume
          </NavLink>
          <NavLink to="/rewrite">
            <Sparkles />
            AI Bullet Rewriter
          </NavLink>
          <NavLink to="/career">
            <BriefcaseBusiness />
            Career roadmap
          </NavLink>
          <NavLink to="/reports">
            <FileText />
            Reports
          </NavLink>
        </nav>
        <p className="sidebar-note">Factual, ATS-first feedback. Your text stays in this browser.</p>
        <div className="account-row">
          <UserRound />
          <span>{user}</span>
          <button onClick={onSignOut} title="Sign out">
            <LogOut />
          </button>
        </div>
      </aside>
      <main className="content">
        <header>
          <div>
            <p className="eyebrow">CAREER INTELLIGENCE</p>
            <h1>Make every application count.</h1>
          </div>
          <Link className="primary-button" to="/analyze">
            <Sparkles />
            New analysis
          </Link>
        </header>
        {children}
      </main>
    </div>
  )
}

function Dashboard() {
  const reports = loadReports()
  const latest = reports[0]
  return (
    <>
      {!latest && (
        <section className="hero-card">
          <div>
            <span className="pill">
              <Sparkles /> ATS-ready feedback
            </span>
            <h2>Turn your experience into your next opportunity.</h2>
            <p>
              Paste your resume, add a job description, and get a factual recruiter-style review of relevance, impact,
              keywords, and readability.
            </p>
            <Link className="light-button" to="/analyze">
              Start an analysis <ChevronRight />
            </Link>
          </div>
          <div className="hero-score">
            <span>WHAT YOU GET</span>
            <strong>ATS</strong>
            <small>keyword and impact review</small>
          </div>
        </section>
      )}
      <section className="metric-grid">
        <Metric icon={<ScanSearch />} label="ATS compatibility" value={latest ? `${latest.ats}%` : '—'} detail="Structure + relevance" />
        <Metric icon={<ListChecks />} label="Keyword coverage" value={latest ? `${latest.keyword}%` : '—'} detail="Against job description" />
        <Metric icon={<BarChart3 />} label="Impact signals" value={latest ? `${latest.impact}%` : '—'} detail="Results and action verbs" />
      </section>
      {latest && (
        <section className="two-column">
          <div className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">LATEST ANALYSIS</p>
                <h3>{latest.role}</h3>
              </div>
              <Link to="/reports">
                Full report <ChevronRight />
              </Link>
            </div>
            <ScoreChart report={latest} />
          </div>
          <div className="panel">
            <p className="eyebrow">NEXT BEST ACTIONS</p>
            <h3>Improve application readiness</h3>
            <ActionList items={latest.actions} />
            <div style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
              <Link className="text-link" to="/rewrite">
                AI Bullet Rewriter <ChevronRight />
              </Link>
              <Link className="text-link" to="/career">
                Career Roadmap <ChevronRight />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <span>{icon}</span>
      <p>{label}</p>
      <b>{value}</b>
      <small>{detail}</small>
    </article>
  )
}

function ScoreChart({ report }: { report: Report }) {
  const data = [
    { name: 'ATS', score: report.ats },
    { name: 'Keywords', score: report.keyword },
    { name: 'Impact', score: report.impact },
    { name: 'Format', score: report.formatting },
  ]
  return (
    <div className="chart-area">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" width={80} dataKey="name" tick={{ fill: '#9bb0c7', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: '#13233b' }} />
          <Bar dataKey="score" radius={[0, 7, 7, 0]} fill="#62d9ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function ActionList({ items }: { items: string[] }) {
  return (
    <ul className="actions">
      {items.map(item => (
        <li key={item}>
          <CheckCircle2 />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Analyze() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [role, setRole] = useState('')
  const [jd, setJd] = useState('')
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function fileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
      setError('Image attached. Paste the resume text below so the analysis stays factual; OCR can be added through a secure server.')
    } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      file.text().then(setText)
      setPreview('')
      setError('')
    } else {
      setPreview('')
      setError('For reliable, factual analysis, paste the text from PDF/DOCX below. File parsing can be connected to a secure server later.')
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || !role.trim()) return
    setSaving(true)
    setError('')
    try {
      let report: Report
      try {
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ resume: text, role, jobDescription: jd, filename: fileName }),
        })
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json()
          report = analysisData.report as Report
        } else {
          report = analyze(text, role, jd, fileName)
        }
      } catch {
        report = analyze(text, role, jd, fileName)
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ report }),
      })
      if (!response.ok) {
        let msg = 'Could not save report'
        try {
          const data = await response.json()
          msg = data.error || msg
        } catch {}
        throw new Error(msg)
      }
      const reports = loadReports()
      localStorage.setItem('resumeai-reports', JSON.stringify([report, ...reports.filter(r => r.id !== report.id)].slice(0, 10)))
      navigate(`/reports/${report.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not analyze the resume')
      setSaving(false)
    }
  }

  return (
    <section className="analysis-page">
      <div className="page-intro">
        <p className="eyebrow">RESUME REVIEW</p>
        <h2>Get a recruiter-ready review.</h2>
        <p>We only evaluate information you provide. A job description enables a precise keyword comparison.</p>
      </div>
      <form className="analyze-form" onSubmit={submit}>
        <label className={`dropzone ${fileName ? 'has-file' : ''}`}>
          {preview ? <img className="file-preview" src={preview} alt="Attached resume preview" /> : <Upload />}
          <b>{fileName || 'Attach a resume file (optional)'}</b>
          <span>TXT, PDF, DOCX, JPG, or JPEG. Paste the resume text below for analysis.</span>
          <input type="file" accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,image/jpeg" onChange={fileChange} />
        </label>
        {error && (
          <p className="warning">
            <AlertCircle />
            {error}
          </p>
        )}
        <div className="field">
          <label htmlFor="role">
            Target role <i>*</i>
          </label>
          <input id="role" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Data Analyst" required />
        </div>
        <div className="field">
          <label htmlFor="resume">
            Resume text <i>*</i>
          </label>
          <textarea id="resume" value={text} onChange={e => setText(e.target.value)} placeholder="Paste the complete text of your resume here…" rows={13} required />
        </div>
        <div className="field">
          <label htmlFor="jd">
            Job description <em>Optional but recommended</em>
          </label>
          <textarea id="jd" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the target job description to identify matched and missing keywords." rows={7} />
        </div>
        <button className="primary-button submit" disabled={!text.trim() || !role.trim() || saving}>
          <Sparkles />
          {saving ? 'Analyzing resume…' : 'Analyze my resume'}
        </button>
        <p className="form-note">Reports are saved securely to your authenticated account.</p>
      </form>
    </section>
  )
}

function questions(report: Report, count: number, type: string) {
  const subjects = report.matched.length ? report.matched : ['your most relevant skill']
  return Array.from({ length: count }, (_, i) => ({
    q: `${type}: How would you apply ${subjects[i % subjects.length]} in a ${report.role} situation?`,
    a: 'Give a truthful STAR-structured answer: situation, your specific action, result, and what you learned. Do not claim tools or outcomes that are not on your resume.',
    level: i < 2 ? 'Foundational' : i < 4 ? 'Intermediate' : 'Advanced',
  }))
}

function CoverLetterModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const [company, setCompany] = useState('')
  const [tone, setTone] = useState<'professional' | 'technical' | 'executive'>('professional')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ coverLetter: string; linkedInOutreach: string; keyHighlights: string[] } | null>(null)
  const [copiedLetter, setCopiedLetter] = useState(false)
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: report.role,
          company,
          strengths: report.strengths,
          jobDescription: report.missing.join(', '),
        }),
      })
      if (response.ok) {
        setResult(await response.json())
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    generate()
  }, [])

  const copy = (text: string, isLinkedIn: boolean) => {
    navigator.clipboard.writeText(text)
    if (isLinkedIn) {
      setCopiedLinkedIn(true)
      setTimeout(() => setCopiedLinkedIn(false), 2000)
    } else {
      setCopiedLetter(true)
      setTimeout(() => setCopiedLetter(false), 2000)
    }
  }

  const downloadText = () => {
    if (!result) return
    const content = `COVER LETTER FOR ${report.role} AT ${company || 'TARGET COMPANY'}\n\n${result.coverLetter}\n\n-------------------------\nLINKEDIN OUTREACH MESSAGE\n\n${result.linkedInOutreach}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cover-letter-${report.role.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill">
              <Sparkles /> AI Outreach Generator
            </span>
            <h3>Cover Letter & LinkedIn Pitch</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '16px' }}>
          <label style={{ display: 'grid', gap: '5px', fontSize: '11px', color: '#9bb0c7', fontWeight: 'bold' }}>
            Target Company
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g., Stripe, Google, Acme Corp"
              style={{ background: '#05111e', border: '1px solid #203c58', borderRadius: '8px', padding: '8px 12px', color: '#e8f4fc', fontSize: '12px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: '5px', fontSize: '11px', color: '#9bb0c7', fontWeight: 'bold' }}>
            Tone
            <select
              value={tone}
              onChange={e => setTone(e.target.value as any)}
              style={{ background: '#05111e', border: '1px solid #203c58', borderRadius: '8px', padding: '8px 12px', color: '#e8f4fc', fontSize: '12px' }}
            >
              <option value="professional">Professional & Impactful</option>
              <option value="technical">Direct & Technical</option>
              <option value="executive">Executive & Leadership</option>
            </select>
          </label>
          <button className="primary-button" onClick={generate} disabled={loading} style={{ height: '36px', padding: '0 16px' }}>
            <RefreshCw className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>

        {loading && <p className="muted" style={{ textAlign: 'center', padding: '30px' }}>Generating tailored outreach materials with AI…</p>}

        {result && !loading && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <b style={{ color: '#68e6f7', fontSize: '13px' }}>Tailored Cover Letter</b>
              <button className={`copy-btn ${copiedLetter ? 'copied' : ''}`} onClick={() => copy(result.coverLetter, false)}>
                {copiedLetter ? <Check /> : <Copy />} {copiedLetter ? 'Copied!' : 'Copy Letter'}
              </button>
            </div>
            <div className="letter-box">{result.coverLetter}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
              <b style={{ color: '#a58aff', fontSize: '13px' }}>LinkedIn Recruiter Cold Outreach Message</b>
              <button className={`copy-btn ${copiedLinkedIn ? 'copied' : ''}`} onClick={() => copy(result.linkedInOutreach, true)}>
                {copiedLinkedIn ? <Check /> : <Copy />} {copiedLinkedIn ? 'Copied!' : 'Copy Pitch'}
              </button>
            </div>
            <div className="letter-box" style={{ maxHeight: '160px' }}>{result.linkedInOutreach}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {result.keyHighlights?.map((h, i) => (
                  <li key={i} style={{ fontSize: '10px', color: '#76e6ba', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 style={{ width: '12px' }} /> {h}
                  </li>
                ))}
              </ul>
              <button className="download-button" onClick={downloadText}>
                <Download /> Download All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StarPracticeModal({ question, role, onClose }: { question: string; role: string; onClose: () => void }) {
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [feedback, setFeedback] = useState<StarEvaluation | null>(null)

  const submitEval = async () => {
    if (!answer.trim()) return
    setEvaluating(true)
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question, answer, role }),
      })
      if (res.ok) {
        setFeedback(await res.json())
      }
    } catch {}
    setEvaluating(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill">
              <Trophy /> STAR Interview Simulator
            </span>
            <h3>Interactive Question Practice</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div style={{ background: '#091e30', border: '1px solid #204566', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px' }}>
          <b style={{ color: '#77eaff', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Interview Question:</b>
          <p style={{ margin: 0, color: '#f0f8ff', fontSize: '13.5px', lineHeight: 1.5 }}>{question}</p>
        </div>

        <div className="field">
          <label style={{ display: 'flex', justifyContent: 'space-between', color: '#c0cede', fontSize: '12px', fontWeight: 'bold' }}>
            <span>Your Response (STAR Method: Situation, Task, Action, Result)</span>
            <span style={{ color: '#7289a1', fontWeight: 'normal', fontSize: '11px' }}>{answer.split(/\s+/).filter(Boolean).length} words</span>
          </label>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Structure your answer: 1) What was the Situation? 2) What was your Task? 3) What specific Actions did you take? 4) What was the measurable Result?"
            rows={6}
            style={{ background: '#040d1a', border: '1px solid #284c6e', borderRadius: '8px', padding: '12px', color: '#e8f4fc', fontSize: '12.5px', lineHeight: 1.55 }}
          />
        </div>

        <button className="primary-button" onClick={submitEval} disabled={!answer.trim() || evaluating} style={{ marginTop: '12px' }}>
          <Sparkles />
          {evaluating ? 'Analyzing STAR components…' : 'Evaluate with AI'}
        </button>

        {feedback && (
          <div style={{ marginTop: '22px', borderTop: '1px solid #203f5d', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <b style={{ fontSize: '14px', color: '#e8f4fd' }}>AI Hiring Manager Evaluation</b>
              <span className="score-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
                STAR Readiness: {feedback.overallScore}/100
              </span>
            </div>

            <div className="star-eval-grid">
              <div className="star-eval-card">
                <b>Situation</b>
                <p>{feedback.starBreakdown?.situation}</p>
              </div>
              <div className="star-eval-card">
                <b>Task</b>
                <p>{feedback.starBreakdown?.task}</p>
              </div>
              <div className="star-eval-card">
                <b>Action</b>
                <p>{feedback.starBreakdown?.action}</p>
              </div>
              <div className="star-eval-card">
                <b>Result</b>
                <p>{feedback.starBreakdown?.result}</p>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <b style={{ color: '#77e7b6', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Key Strengths:</b>
              <ul className="actions" style={{ padding: 0 }}>
                {feedback.strengths?.map((s, i) => (
                  <li key={i}>
                    <CheckCircle2 /> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '14px' }}>
              <b style={{ color: '#fba5a5', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Areas for Recruiter Improvement:</b>
              <ul className="actions concerns" style={{ padding: 0 }}>
                {feedback.improvements?.map((imp, i) => (
                  <li key={i}>
                    <AlertCircle /> {imp}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '16px', background: '#071626', border: '1px dashed #2e628a', borderRadius: '10px', padding: '14px 16px' }}>
              <b style={{ color: '#72e7ff', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Exemplary Model Answer:</b>
              <p style={{ margin: 0, color: '#d0e5f7', fontSize: '12px', lineHeight: 1.55 }}>{feedback.modelAnswer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportView({ report }: { report: Report }) {
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false)
  const [practiceQuestion, setPracticeQuestion] = useState<string | null>(null)

  const pie = [
    { name: 'Matched', value: report.matched.length },
    { name: 'Missing', value: report.missing.length || 1 },
  ]
  const ranking = report.overall >= 80 ? 'Strong' : report.overall >= 60 ? 'Competitive' : 'Needs revision'

  const download = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            overall_score: report.overall,
            ats_score: report.ats,
            formatting_score: report.formatting,
            keyword_score: report.keyword,
            strengths: report.strengths,
            weaknesses: report.concerns,
            missing_keywords: report.missing,
            recommendations: report.actions,
            final_verdict: ranking,
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumeai-report-${report.role.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="report-view">
      {showCoverLetterModal && <CoverLetterModal report={report} onClose={() => setShowCoverLetterModal(false)} />}
      {practiceQuestion && <StarPracticeModal question={practiceQuestion} role={report.role} onClose={() => setPracticeQuestion(null)} />}

      <div className="report-header">
        <div>
          <span className="pill">
            <CheckCircle2 /> Analysis complete
          </span>
          <h2>{report.role} analysis</h2>
          <p>{report.filename || 'Pasted resume'} · {report.createdAt}</p>
        </div>
        <div className="report-actions">
          <button className="primary-button" onClick={() => setShowCoverLetterModal(true)} style={{ height: '36px', fontSize: '11px', padding: '0 14px' }}>
            <Sparkles /> AI Cover Letter
          </button>
          <button className="download-button" onClick={download}>
            <Download /> JSON
          </button>
          <div className="score-circle">
            <strong>{report.overall}</strong>
            <span>overall readiness</span>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="panel">
          <p className="eyebrow">STRENGTHS</p>
          <ActionList items={report.strengths} />
        </div>
        <div className="panel">
          <p className="eyebrow">RECRUITER WATCHOUTS</p>
          <ul className="actions concerns">
            {report.concerns.map(x => (
              <li key={x}>
                <AlertCircle />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel wide">
          <div className="panel-title">
            <div>
              <p className="eyebrow">ATS MATCHING</p>
              <h3>{ranking} match · {report.ats}%</h3>
            </div>
            <span className="score-badge">{report.keyword}% keywords</span>
          </div>
          <p className="muted">
            Score rationale: recognizable headings, job-description term coverage, and achievement-focused language. This is a decision aid, not a guarantee of shortlisting.
          </p>
          <div className="section-list">
            {report.sections.map(s => (
              <div key={s.name}>
                <span className={s.status}>
                  <CheckCircle2 />
                </span>
                <b>{s.name}</b>
                <p>{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">KEYWORD + SKILLS GAP</p>
          {report.matched.length || report.missing.length ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pie} dataKey="value" innerRadius={44} outerRadius={65} paddingAngle={4}>
                    {pie.map((_, i) => (
                      <Cell key={i} fill={i ? '#344967' : '#66e3b4'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="keyword-line">
                <b>Matching skills:</b> {report.matched.join(', ') || 'No job description provided'}
              </p>
              <p className="keyword-line">
                <b>Must-have gaps to validate:</b> {report.missing.join(', ') || 'None detected'}
              </p>
            </>
          ) : (
            <p className="muted">Add a job description in the next analysis to compare skills and technologies.</p>
          )}
        </div>

        <div className="panel">
          <p className="eyebrow">RESUME IMPROVEMENT</p>
          <ActionList items={report.actions} />
          <div style={{ marginTop: '16px' }}>
            <Link className="primary-button" to="/rewrite" style={{ fontSize: '11px', padding: '8px 14px' }}>
              <Sparkles /> Rewrite Weak Bullets with AI <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="panel wide">
          <div className="panel-title">
            <div>
              <p className="eyebrow">CAREER ROADMAP SUMMARY</p>
              <h3>Target Growth Path for {report.role}</h3>
            </div>
            <Link to="/career" className="text-link">
              Open Full Interactive Roadmap <ChevronRight />
            </Link>
          </div>
          <div className="mini-grid">
            <article>
              <b>Project evaluation</b>
              <p>Difficulty: evidence-based. Industry relevance depends on target role. Include problem, stack, contribution, and verified metrics.</p>
              <span>Project score: 3 Blueprints ready</span>
            </article>
            <article>
              <b>Career recommendation</b>
              <p>Current fit: {ranking.toLowerCase()} for {report.role}. Transition timeframe: 6–18 months for senior elevation.</p>
              <span>Shortlisting probability: {Math.min(90, Math.max(15, report.overall - 5))}%</span>
            </article>
            <article>
              <b>Learning roadmap</b>
              <p>Must-have: validate the listed {report.missing.length || 0} gaps. Build role-relevant portfolio projects.</p>
              <span>Interactive Skill Tracker available</span>
            </article>
          </div>
        </div>

        <div className="panel wide advanced-output">
          <div className="panel-title" style={{ marginBottom: '12px' }}>
            <div>
              <p className="eyebrow">AI INTERVIEW SIMULATOR</p>
              <h3>Targeted STAR Interview Questions</h3>
            </div>
            <span className="pill">Click any question to practice</span>
          </div>
          {[
            ['Technical', 10],
            ['HR', 5],
            ['Behavioral', 5],
            ['Project', 5],
            ['Coding', 5],
          ].map(([kind, count]) => (
            <details key={String(kind)}>
              <summary>
                {kind} questions ({count})
              </summary>
              {questions(report, Number(count), String(kind)).map((item, idx) => (
                <article key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                  <div>
                    <b>{item.q}</b>
                    <p>
                      <span>{item.level}</span> {item.a}
                    </p>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => setPracticeQuestion(item.q)}
                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    <MessageSquare /> Practice STAR
                  </button>
                </article>
              ))}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reports() {
  const reports = loadReports()
  const nav = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const report = useMemo(() => (id ? reports.find(x => x.id === id) : null) || reports[0], [reports, id])

  if (!report) {
    return (
      <section className="empty-page">
        <FileText />
        <h2>No saved reports yet.</h2>
        <p>Complete an analysis to save and compare reports here.</p>
        <Link className="primary-button" to="/analyze">
          Analyze a resume
        </Link>
      </section>
    )
  }

  return (
    <>
      <div className="report-picker">
        {reports.map(x => (
          <button key={x.id} className={x.id === report.id ? 'selected' : ''} onClick={() => nav(`/reports/${x.id}`)}>
            {x.role}
            <span>{x.overall}</span>
          </button>
        ))}
      </div>
      <ReportView report={report} />
    </>
  )
}

function CareerRoadmap() {
  const reports = loadReports()
  const initialRole = reports[0]?.role || 'Software Engineer'
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [customRoleInput, setCustomRoleInput] = useState('')
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [learnedSkills, setLearnedSkills] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('resumeai-learned-skills') || '{}')
    } catch {
      return {}
    }
  })

  const currentReport = useMemo(() => reports.find(r => r.role.toLowerCase() === selectedRole.toLowerCase()) || reports[0], [reports, selectedRole])

  const fetchRoadmap = async (targetRole: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: targetRole,
          currentSkills: currentReport ? currentReport.matched : ['TypeScript', 'React', 'REST APIs', 'SQL'],
          missingSkills: currentReport ? currentReport.missing : ['Microservices', 'Kubernetes', 'Redis Caching', 'System Design'],
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setRoadmap(data.roadmap)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchRoadmap(selectedRole)
  }, [selectedRole])

  const toggleSkill = (skillName: string) => {
    const updated = { ...learnedSkills, [skillName]: !learnedSkills[skillName] }
    setLearnedSkills(updated)
    localStorage.setItem('resumeai-learned-skills', JSON.stringify(updated))
  }

  const allSkills = useMemo(() => {
    if (!roadmap) return []
    return roadmap.skillMatrix.flatMap(c => c.skills)
  }, [roadmap])

  const masteredCount = useMemo(() => {
    return allSkills.filter(s => learnedSkills[s.name] || s.status === 'learned').length
  }, [allSkills, learnedSkills])

  const progressPercent = allSkills.length ? Math.round((masteredCount / allSkills.length) * 100) : 0

  const handleCustomRoleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customRoleInput.trim()) return
    setSelectedRole(customRoleInput.trim())
    setCustomRoleInput('')
  }

  return (
    <div className="career-container">
      <div className="career-header-bar">
        <div>
          <span className="pill">
            <TrendingUp /> AI Career Intelligence
          </span>
          <h2 style={{ margin: '8px 0 4px', fontSize: '24px' }}>Career Roadmap: {selectedRole}</h2>
          <p style={{ margin: 0, color: '#9cb0c7', fontSize: '13px' }}>
            Actionable milestones, market-aligned compensation benchmarks, and portfolio blueprints.
          </p>
        </div>

        <div className="career-role-select">
          {reports.length > 0 && (
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              {reports.map(r => (
                <option key={r.id} value={r.role}>
                  {r.role} (from Report)
                </option>
              ))}
            </select>
          )}
          <form onSubmit={handleCustomRoleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={customRoleInput}
              onChange={e => setCustomRoleInput(e.target.value)}
              placeholder="Explore another role…"
            />
            <button className="primary-button" type="submit" style={{ padding: '8px 14px' }}>
              Explore
            </button>
          </form>
        </div>
      </div>

      {loading && <p className="muted" style={{ textAlign: 'center', padding: '40px' }}>Generating customized AI Career Roadmap for {selectedRole}…</p>}

      {roadmap && !loading && (
        <>
          <section className="career-stats-grid">
            <div className="stat-card">
              <span>Market Demand</span>
              <strong style={{ color: '#68e7f8' }}>{roadmap.demandIndex}</strong>
              <small>Recruiter hiring velocity</small>
            </div>
            <div className="stat-card">
              <span>Entry Level Base</span>
              <strong>{roadmap.salaryRanges?.entry || '$85k - $115k'}</strong>
              <small>0 – 2 years experience</small>
            </div>
            <div className="stat-card">
              <span>Mid-Level Base</span>
              <strong style={{ color: '#7bf2c3' }}>{roadmap.salaryRanges?.mid || '$120k - $165k'}</strong>
              <small>3 – 5 years experience</small>
            </div>
            <div className="stat-card">
              <span>Senior / Lead Total</span>
              <strong style={{ color: '#d094ff' }}>{roadmap.salaryRanges?.senior || '$170k - $240k+'}</strong>
              <small>5+ years + leadership</small>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">CAREER PROGRESSION LADDER</p>
                <h3>Multi-Stage Advancement Path</h3>
              </div>
              <span className="pill">3-Year Growth Horizon</span>
            </div>

            <div className="timeline-track">
              {roadmap.milestones?.map((m, idx) => (
                <div key={idx} className="milestone-item">
                  <div className="milestone-badge">
                    <b>{m.level.split(':')[0]}</b>
                    <span>{m.duration}</span>
                  </div>
                  <div className="milestone-body">
                    <h4>{m.level.split(':')[1] || m.level}</h4>
                    <p>{m.objective}</p>
                    <ul className="milestone-actions">
                      {m.keyActions?.map((act, i) => (
                        <li key={i}>
                          <CheckCircle2 /> {act}
                        </li>
                      ))}
                    </ul>
                    <div className="deliverable-tag">
                      <Trophy style={{ width: '13px' }} /> Target Milestone: {m.targetDeliverables}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">INTERACTIVE SKILL MATRIX</p>
                <h3>Competency & Gap Mastery Tracker</h3>
              </div>
              <div className="progress-text">
                {masteredCount} / {allSkills.length} Skills Mastered ({progressPercent}%)
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="skill-matrix-grid">
              {roadmap.skillMatrix?.map((cat, idx) => (
                <div key={idx} className="skill-category-card">
                  <h3>{cat.category}</h3>
                  <p>{cat.description}</p>
                  <ul className="skill-check-list">
                    {cat.skills?.map((s, i) => {
                      const isChecked = learnedSkills[s.name] || s.status === 'learned'
                      return (
                        <li key={i} className={`skill-check-item ${isChecked ? 'completed' : ''}`}>
                          <label className="skill-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSkill(s.name)}
                            />
                            <span>{s.name}</span>
                          </label>
                          {s.status === 'gap' && !isChecked ? (
                            <span className="skill-badge-gap">Gap</span>
                          ) : (
                            <span className="skill-badge-mastered">Mastered</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">PORTFOLIO BLUEPRINTS</p>
                <h3>Recruiter-Impressing Project Specifications</h3>
              </div>
              <span className="pill">Proof of Senior Execution</span>
            </div>

            <div className="project-blueprint-grid">
              {roadmap.projectBlueprints?.map((proj, idx) => (
                <div key={idx} className="project-card">
                  <h4>{proj.title}</h4>
                  <p>{proj.summary}</p>
                  <div className="tech-stack-pills">
                    {proj.techStack?.map((t, i) => (
                      <span key={i} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ margin: '0 0 12px' }}>
                    <b style={{ color: '#d0e5f7', fontSize: '11px', display: 'block', marginBottom: '6px' }}>Architectural Challenges:</b>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
                      {proj.keyChallenges?.map((ch, i) => (
                        <li key={i} style={{ color: '#9bb0c7', fontSize: '11px', display: 'flex', gap: '6px' }}>
                          <CheckCircle2 style={{ width: '13px', color: '#6be7b6', flexShrink: 0, marginTop: '2px' }} />
                          {ch}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="metric-highlight">
                    <b>Resume Metric To Highlight:</b>
                    <br />"{proj.recruiterImpactMetric}"
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function BulletRewriter() {
  const reports = loadReports()
  const defaultRole = reports[0]?.role || 'Software Engineer'
  const [role, setRole] = useState(defaultRole)
  const [bullet, setBullet] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulletRewriteResponse | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const sampleBullets = [
    'Worked on the frontend with React and fixed UI bugs.',
    'Optimized database queries and improved performance.',
    'Managed cloud infrastructure and deployed services to AWS.',
    'Led a team of 4 engineers and built REST API endpoints for user payments.',
  ]

  const handleRewrite = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!bullet.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/bullet/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bullet, role }),
      })
      if (response.ok) {
        setResult(await response.json())
      }
    } catch {}
    setLoading(false)
  }

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="rewriter-grid">
      <div className="rewriter-form-panel">
        <span className="pill">
          <Sparkles /> Google XYZ Bullet Formula
        </span>
        <h2 style={{ margin: '12px 0 6px', fontSize: '24px' }}>AI Resume Bullet Optimizer</h2>
        <p style={{ color: '#9bb0c7', fontSize: '13px', lineHeight: 1.55, margin: '0 0 20px' }}>
          Transform vague resume bullets into quantified, high-impact recruiter magnets using the Google XYZ framework.
        </p>

        <form onSubmit={handleRewrite}>
          <div className="field">
            <label htmlFor="rewriter-role">Target Role</label>
            <input
              id="rewriter-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g., Senior Full Stack Engineer"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="rewriter-bullet">Original Bullet Point</label>
            <textarea
              id="rewriter-bullet"
              value={bullet}
              onChange={e => setBullet(e.target.value)}
              placeholder="e.g., Developed API endpoints and integrated payment gateway."
              rows={4}
              required
            />
          </div>

          <div style={{ margin: '14px 0' }}>
            <small style={{ color: '#7289a1', display: 'block', marginBottom: '8px' }}>Or click a sample bullet:</small>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sampleBullets.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBullet(sample)}
                  style={{
                    background: '#0a1d30',
                    border: '1px solid #204162',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#9ceeff',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  "{sample.slice(0, 38)}…"
                </button>
              ))}
            </div>
          </div>

          <button className="primary-button submit" disabled={!bullet.trim() || loading}>
            <Sparkles />
            {loading ? 'Optimizing with AI…' : 'Generate 4 High-Impact Variations'}
          </button>
        </form>
      </div>

      <div className="rewriter-results">
        {!result && !loading && (
          <div className="empty-page" style={{ minHeight: '380px' }}>
            <Sparkles style={{ width: '40px', height: '40px' }} />
            <h3>Ready to Optimize</h3>
            <p>Enter any draft bullet on the left to generate Google XYZ, Metrics-Driven, Leadership, and ATS variations.</p>
          </div>
        )}

        {loading && (
          <div className="empty-page" style={{ minHeight: '380px' }}>
            <RefreshCw className="animate-spin" style={{ width: '36px', height: '36px', color: '#64e6ff' }} />
            <h3>Crafting Executive Rewrites…</h3>
            <p>Applying quantifiable metric placeholders and active power verbs.</p>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="score-gauge">
              <Zap style={{ color: '#68e7f8', width: '22px' }} />
              <div>
                <b style={{ color: '#f0f8ff', fontSize: '13px' }}>Recruiter Impact Gain</b>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                  <span className="score-pill-before">Draft: {result.impactScore?.before || 45}%</span>
                  <ArrowRight style={{ width: '14px', color: '#6ee7b7' }} />
                  <span className="score-pill-after">Optimized: {result.impactScore?.after || 95}%</span>
                </div>
              </div>
            </div>

            {result.rewrites?.map((item, idx) => (
              <div key={idx} className="rewrite-card">
                <div className="rewrite-card-header">
                  <span>{item.style}</span>
                  <button className={`copy-btn ${copiedIndex === idx ? 'copied' : ''}`} onClick={() => copyText(item.text, idx)}>
                    {copiedIndex === idx ? <Check /> : <Copy />} {copiedIndex === idx ? 'Copied!' : 'Copy Bullet'}
                  </button>
                </div>
                <div className="rewrite-text">"{item.text}"</div>
                <p className="rewrite-formula">
                  <b>Formula:</b> {item.formula}
                </p>
                <p className="rewrite-rationale">
                  <b>Why this works:</b> {item.rationale}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function Auth({ mode, onSuccess }: { mode: 'login' | 'signup'; onSuccess: (email: string) => Promise<void> | void }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const cleanEmail = email.trim()
    if (!cleanEmail || password.length < 8) {
      setError('Please provide a valid email and a password of at least 8 characters.')
      setLoading(false)
      return
    }
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail, password }),
      })
      let data: any = {}
      try {
        data = await response.json()
      } catch {
        throw new Error(`Server returned an invalid response (${response.status}). Please ensure the backend server is running.`)
      }
      if (!response.ok) throw new Error(data.error || 'Authentication failed')
      await onSuccess(data.user.email)
      nav('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="logo" to="/">
          <span>✦</span> ResumeAI
        </Link>
        <p className="eyebrow">CAREER INTELLIGENCE</p>
        <h1>{mode === 'login' ? 'Welcome back.' : 'Create your workspace.'}</h1>
        <p>Save ATS reports with a server-side account and a protected session cookie.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required />
          </label>
          {error && (
            <p className="warning">
              <AlertCircle />
              {error}
            </p>
          )}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight />
          </button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? 'New to ResumeAI?' : 'Already have an account?'} <Link to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Create one' : 'Sign in'}</Link>
        </p>
        <small>Passwords are salted and hashed on the server; the browser receives only an HTTP-only session cookie.</small>
      </section>
    </main>
  )
}

function App() {
  const [user, setUser] = useState('')
  const [checking, setChecking] = useState(true)

  const syncReports = async () => {
    try {
      const response = await fetch('/api/reports', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data.reports)) {
          localStorage.setItem('resumeai-reports', JSON.stringify(data.reports))
          return data.reports
        }
      }
    } catch {}
    return []
  }

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async response => {
        if (response.ok) {
          const data = await response.json()
          return data.user?.email || ''
        }
        return ''
      })
      .catch(() => '')
      .then(async email => {
        setUser(email)
        if (email) {
          await syncReports()
        }
        setChecking(false)
      })
  }, [])

  const handleAuthSuccess = async (email: string) => {
    setUser(email)
    await syncReports()
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {}
    localStorage.removeItem('resumeai-reports')
    setUser('')
  }

  if (checking)
    return (
      <main className="auth-page">
        <p className="muted">Checking secure session…</p>
      </main>
    )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Auth mode="login" onSuccess={handleAuthSuccess} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Auth mode="signup" onSuccess={handleAuthSuccess} />} />
        <Route
          path="/*"
          element={
            user ? (
              <Shell user={user} onSignOut={signOut}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/analyze" element={<Analyze />} />
                  <Route path="/rewrite" element={<BulletRewriter />} />
                  <Route path="/career" element={<CareerRoadmap />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reports/:id" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

createRoot(document.getElementById('root')!).render(<App />)

