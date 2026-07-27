import { useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, BriefcaseBusiness, CheckCircle2, ChevronRight, FileText, LayoutDashboard, ListChecks, LogOut, ScanSearch, Sparkles, Upload, UserRound } from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './styles.css'

type Resume = { name: string; targetRole: string; score: number; uploadedAt: string }
const skills = [
  { name: 'Technical skills', score: 88 }, { name: 'Experience impact', score: 76 },
  { name: 'ATS keywords', score: 68 }, { name: 'Formatting', score: 92 },
]
const keywordData = [{ name: 'Matched', value: 19 }, { name: 'Missing', value: 8 }]

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="app-shell"><aside className="sidebar"><Link className="logo" to="/"><span>✦</span> ResumeAI</Link><p className="workspace">WORKSPACE</p><nav>
    <NavLink to="/" end><LayoutDashboard /> Dashboard</NavLink><NavLink to="/analyze"><ScanSearch /> Analyze resume</NavLink><NavLink to="/reports"><FileText /> Reports</NavLink><NavLink to="/career"><BriefcaseBusiness /> Career roadmap</NavLink>
  </nav><div className="sidebar-bottom"><button><UserRound /> Account</button><button><LogOut /> Sign out</button></div></aside><main className="content"><header><div><p className="eyebrow">CAREER INTELLIGENCE</p><h1>Good morning, Alex.</h1></div><Link className="primary-button" to="/analyze"><Sparkles /> Analyze a resume</Link></header>{children}</main></div>
}

function Dashboard() {
  const [resume] = useState<Resume>({ name: 'Alex_Sterling_Resume.pdf', targetRole: 'Product Designer', score: 82, uploadedAt: 'Today' })
  return <><section className="hero-card"><div><span className="pill"><Sparkles /> AI-Powered review</span><h2>Turn your experience into your next opportunity.</h2><p>Upload a resume and get a clear, role-aware view of your ATS readiness, skills, and highest-impact improvements.</p><Link className="light-button" to="/analyze">Start analysis <ChevronRight /></Link></div><div className="hero-score"><span>PROFILE STRENGTH</span><strong>{resume.score}</strong><small>/ 100</small><em>Strong foundation</em></div></section>
    <section className="metric-grid"><Metric icon={<ScanSearch />} label="ATS compatibility" value="82%" detail="Above average" /><Metric icon={<ListChecks />} label="Keyword coverage" value="70%" detail="8 keywords to add" /><Metric icon={<BarChart3 />} label="Impact signals" value="76%" detail="Add measurable outcomes" /></section>
    <section className="two-column"><div className="panel"><div className="panel-title"><div><p className="eyebrow">LATEST ANALYSIS</p><h3>{resume.targetRole}</h3></div><Link to="/reports">View report <ChevronRight /></Link></div><div className="resume-row"><div className="file-icon"><FileText /></div><div><b>{resume.name}</b><p>Uploaded {resume.uploadedAt} · Target: {resume.targetRole}</p></div><span className="score-badge">{resume.score}</span></div><div className="chart-area"><ResponsiveContainer width="100%" height={220}><BarChart data={skills} layout="vertical" margin={{ left: 12 }}><XAxis type="number" domain={[0, 100]} hide /><YAxis type="category" width={120} dataKey="name" tick={{ fill: '#92a4bd', fontSize: 12 }} axisLine={false} tickLine={false}/><Tooltip cursor={{ fill: '#13233b' }} /><Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#62d9ff" /></BarChart></ResponsiveContainer></div></div>
    <div className="panel"><p className="eyebrow">NEXT BEST ACTIONS</p><h3>Make your resume more competitive</h3><ul className="actions"><li><CheckCircle2 /> Add outcomes to your two most recent roles.</li><li><CheckCircle2 /> Include 8 relevant role-specific keywords.</li><li><CheckCircle2 /> Replace responsibility-led bullets with achievement-led bullets.</li></ul><Link className="text-link" to="/analyze">Get tailored suggestions <ChevronRight /></Link></div></section></>
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <article className="metric"><span>{icon}</span><p>{label}</p><b>{value}</b><small>{detail}</small></article> }

function Analyze() {
  const input = useRef<HTMLInputElement>(null); const [file, setFile] = useState<File | null>(null); const [role, setRole] = useState(''); const [description, setDescription] = useState(''); const [submitted, setSubmitted] = useState(false)
  const valid = Boolean(file && role.trim())
  function submit(e: React.FormEvent) { e.preventDefault(); if (valid) setSubmitted(true) }
  return <section className="analysis-page"><div className="page-intro"><p className="eyebrow">NEW ANALYSIS</p><h2>Get a recruiter-ready review.</h2><p>We parse your resume, compare it with the target role, and identify concrete ways to improve relevance and clarity.</p></div>{submitted ? <AnalysisPreview file={file!} role={role} hasDescription={Boolean(description)} /> : <form className="analyze-form" onSubmit={submit}><label className={`dropzone ${file ? 'has-file' : ''}`} onClick={() => input.current?.click()}><input ref={input} hidden type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} /><Upload /><b>{file ? file.name : 'Upload your resume'}</b><span>{file ? 'Ready to analyze' : 'PDF or DOCX, up to 10 MB'}</span></label><div className="field"><label htmlFor="role">Target role <i>*</i></label><input id="role" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Data Analyst" required /></div><div className="field"><label htmlFor="jd">Job description <em>Optional but recommended</em></label><textarea id="jd" value={description} onChange={e => setDescription(e.target.value)} placeholder="Paste the job description for a keyword and skill match analysis." rows={7}/></div><button className="primary-button submit" disabled={!valid}><Sparkles /> Analyze my resume</button><p className="form-note">Your file is used only for this analysis. AI recommendations should be reviewed for accuracy before use.</p></form>}</section>
}

function AnalysisPreview({ file, role, hasDescription }: { file: File; role: string; hasDescription: boolean }) { const insight = useMemo(() => hasDescription ? 'A job description was included, so this report will compare skills and keywords against the target role.' : 'Add a job description next time to unlock role-specific keyword matching.', [hasDescription]); return <div className="report-preview"><div className="report-header"><div><span className="pill"><CheckCircle2 /> File parsed</span><h2>{role} analysis</h2><p>{file.name}</p></div><div className="score-circle"><strong>—</strong><span>Awaiting API analysis</span></div></div><div className="notice"><Sparkles /> <div><b>Demo workflow ready</b><p>{insight} Connect the FastAPI service and configure an AI provider key to generate a factual analysis.</p></div></div><div className="preview-grid"><div className="panel"><p className="eyebrow">WHAT THE REPORT WILL INCLUDE</p><ul className="actions"><li><CheckCircle2 /> ATS and section-level scoring</li><li><CheckCircle2 /> Matching and missing keywords</li><li><CheckCircle2 /> Project, skills, and experience review</li><li><CheckCircle2 /> Truthful ATS-ready rewrite suggestions</li></ul></div><div className="panel chart-panel"><p className="eyebrow">KEYWORD COVERAGE</p><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={keywordData} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={4}>{keywordData.map((_, i) => <Cell key={i} fill={i ? '#344967' : '#66e3b4'} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div></div> }

function Reports() { return <section className="empty-page"><FileText /><h2>No saved reports yet.</h2><p>Complete an analysis to save and compare reports here.</p><Link className="primary-button" to="/analyze">Analyze a resume</Link></section> }
function Career() { return <section className="empty-page"><BriefcaseBusiness /><h2>Your career roadmap starts with your resume.</h2><p>Analyze a resume to receive role-fit, priority-skill, and learning recommendations.</p><Link className="primary-button" to="/analyze">Start analysis</Link></section> }
function App() { return <BrowserRouter><Shell><Routes><Route path="/" element={<Dashboard />} /><Route path="/analyze" element={<Analyze />} /><Route path="/reports" element={<Reports />} /><Route path="/career" element={<Career />} /></Routes></Shell></BrowserRouter> }

export default App
