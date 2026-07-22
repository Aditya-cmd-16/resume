import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const Check = () => <span className="check">✓</span>

function ScoreRing({ small = false, score = 96 }) {
  return <div className={`score-ring ${small ? 'small' : ''}`}>
    <div className="score-inner"><b>{small ? score - 2 : score}</b><span>/ 100</span><em>{small ? 'ATS SCORE' : 'MATCH SCORE'}</em></div>
  </div>
}

function Tilt({ children, className = '' }) {
  const ref = useRef(null)
  const move = event => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--tilt-x', `${((event.clientY - top) / height - .5) * -8}deg`)
    ref.current.style.setProperty('--tilt-y', `${((event.clientX - left) / width - .5) * 9}deg`)
  }
  return <div ref={ref} className={`tilt ${className}`} onMouseMove={move} onMouseLeave={() => { ref.current.style.setProperty('--tilt-x', '0deg'); ref.current.style.setProperty('--tilt-y', '0deg') }}>{children}</div>
}

function AnalyzeModal({ open, onClose, onComplete }) {
  const [fileName, setFileName] = useState('')
  const [role, setRole] = useState('Product Designer')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const input = useRef(null)
  if (!open) return null
  const select = file => file && setFileName(file.name)
  const analyze = () => {
    if (!fileName) return input.current?.click()
    setBusy(true)
    setTimeout(() => { setBusy(false); onComplete({ fileName, role }); onClose() }, 1300)
  }
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Analyze your resume">
    <Tilt className="analyze-modal"><button className="modal-close" onClick={onClose} aria-label="Close">×</button><div className="eyebrow"><span className="live-dot" /> RESUMEAI INTELLIGENCE</div><h2>Find your edge.</h2><p>Upload your resume and get an instant, role-aware analysis.</p>
      <input ref={input} type="file" accept=".pdf,.doc,.docx" onChange={e => select(e.target.files?.[0])} hidden />
      <button className={`dropzone ${dragging ? 'dragging' : ''} ${fileName ? 'uploaded' : ''}`} onClick={() => input.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); select(e.dataTransfer.files?.[0]) }}><span>{fileName ? '✓' : '↑'}</span><b>{fileName || 'Drop your resume here'}</b><small>{fileName ? 'Ready for analysis' : 'PDF or DOCX · up to 10MB'}</small></button>
      <label className="role-field">Target role<input value={role} onChange={e => setRole(e.target.value)} /></label>
      <button className="primary analyze-button" onClick={analyze}>{busy ? <><i className="loader" /> Reading your experience…</> : <>Analyze my resume <b>→</b></>}</button><small className="privacy-note">✦ Encrypted and never shared without your permission.</small>
    </Tilt>
  </div>
}

function ResumeCard() {
  return <div className="resume-stage">
    <svg className="neural-mesh" viewBox="0 0 520 430" aria-hidden="true">
      <defs><linearGradient id="meshStroke" x1="0" x2="1"><stop stopColor="#5af3ff" stopOpacity=".05"/><stop offset=".52" stopColor="#74ecff"/><stop offset="1" stopColor="#ca91ff" stopOpacity=".1"/></linearGradient></defs>
      <g stroke="url(#meshStroke)" fill="none"><path d="M30 190 L120 120 L236 176 L332 86 L466 148"/><path d="M50 286 L145 220 L236 176 L340 292 L474 230"/><path d="M120 120 L145 220 L261 310 L332 86"/><path d="M236 176 L400 181 L466 148"/></g>
      <g fill="#83f4ff"><circle cx="120" cy="120" r="4"/><circle cx="236" cy="176" r="3"/><circle cx="332" cy="86" r="4"/><circle cx="145" cy="220" r="3"/><circle cx="400" cy="181" r="3"/></g>
      <g fill="#cf9cff"><circle cx="466" cy="148" r="3"/><circle cx="340" cy="292" r="4"/><circle cx="261" cy="310" r="3"/></g>
    </svg>
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="document-card">
      <div className="doc-top"><span className="mini-logo">✦</span><span>resume.ai/profile</span><i>•••</i></div>
      <div className="candidate"><div className="avatar">AS</div><div><strong>Alex Sterling</strong><small>Product Designer</small></div><span className="online">●</span></div>
      <div className="doc-section"><label>EXPERIENCE</label><b>Senior Product Designer</b><p>Arc Labs · 2021 — Present</p><div className="doc-lines"><i /><i /><i /></div></div>
      <div className="doc-section"><label>CORE SKILLS</label><div className="pills"><span>Strategy</span><span>Figma</span><span>AI UX</span></div></div>
      <div className="doc-footer"><span>Optimized by ResumeAI</span><b>↗</b></div>
    </div>
    <div className="score-float"><span>AI READINESS</span><ScoreRing small /><p>Recruiter ready <Check /></p></div>
    <div className="keyword-float"><span className="spark">✦</span><div><b>12 high-impact keywords</b><small>Added to your profile</small></div></div>
  </div>
}

const features = [
  ['✦', 'Precision ATS scoring', 'See exactly how your resume performs against modern applicant tracking systems.'],
  ['⌘', 'Keyword intelligence', 'Uncover the language recruiters and job descriptions actually prioritize.'],
  ['↗', 'Tailored improvements', 'Get specific, practical rewrites that make every achievement land.'],
  ['◎', 'Role match analysis', 'Compare your experience with a dream role — before you apply.'],
  ['⌁', 'Career signal mapping', 'Understand your strengths, gaps, and the next skill worth building.'],
  ['◈', 'Private by design', 'Your work stays yours. Enterprise-grade security from upload to insight.'],
]

function App() {
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState(0)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [yearly, setYearly] = useState(true)
  useEffect(() => {
    const move = e => document.documentElement.style.setProperty('--mouse-x', `${e.clientX / window.innerWidth}`)
    window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in-view')), { threshold: .14 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const escape = event => event.key === 'Escape' && setUploadOpen(false)
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape)
  }, [])
  return <main>
    <div className="grain" />
    <nav className="nav"><a className="brand" href="#top"><span>✦</span>Resume<span>AI</span></a><div className={`nav-links ${menu ? 'open' : ''}`}><a onClick={() => setMenu(false)} href="#features">Platform</a><a onClick={() => setMenu(false)} href="#how">How it works</a><a onClick={() => setMenu(false)} href="#pricing">Pricing</a></div><div className="nav-actions"><button className="login" onClick={() => setUploadOpen(true)}>Sign in</button><button className="nav-cta" onClick={() => setUploadOpen(true)}>Get started <b>↗</b></button><button onClick={() => setMenu(!menu)} className="menu">☰</button></div></nav>

    <section id="top" className="hero">
      <div className="hero-grid" /><div className="hero-noise" /><div className="scan-field" /><div className="beam beam-a" /><div className="beam beam-b" />
      <div className="particle p1" /><div className="particle p2" /><div className="particle p3" />
      <div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> THE INTELLIGENT CAREER LAYER</div><h1>Build a resume<br />recruiters <i>love.</i></h1><p>Go from overlooked to in-demand. ResumeAI turns your experience into a clear, recruiter-ready story — with intelligence behind every word.</p><div className="hero-actions"><button onClick={() => setUploadOpen(true)} className="primary">Analyze my resume <b>→</b></button><a href="#how" className="secondary"><span>▶</span> Watch how it works</a></div><div className="trusted"><div className="people"><i>JD</i><i>MS</i><i>AP</i><i>+</i></div><p><b>10,000+ professionals</b><br />are sharpening their edge</p></div></div>
      <ResumeCard />
      <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
    </section>

    <section className="logo-strip"><p>BUILT FOR AMBITION. TRUSTED BY PEOPLE FROM</p><div><b>vercel</b><b>linear</b><b>Webflow</b><b>Notion</b><b>stripe</b></div></section>

    <section id="features" className="features section reveal"><div className="section-top"><div><div className="eyebrow">01 — WHAT YOU UNLOCK</div><h2>Your career is complex.<br /><i>Your next move shouldn’t be.</i></h2></div><p>Less guesswork. More signal. Get the clarity to make every application count.</p></div><div className="feature-grid">{features.map(([icon, title, text], i) => <article className={`feature-card c${i}`} key={title} onMouseEnter={() => setActive(i)}><div className="card-icon">{icon}</div><span className="card-num">0{i + 1}</span><h3>{title}</h3><p>{text}</p><a href="#start">Explore <b>↗</b></a>{active === i && <div className="active-glow" />}</article>)}</div></section>

    <section id="how" className="workflow section reveal"><div className="workflow-orb"><div className="orb-core">✦</div><span className="orbit-line" /><span className="orbit-line orbit-line-two" /></div><div className="workflow-copy"><div className="eyebrow">02 — THE RESUMEAI METHOD</div><h2>A clearer path<br />to <i>yes.</i></h2><p>We decode the hidden patterns in your experience, then show you exactly how to make them impossible to miss.</p><div className="steps">{[['01', 'Drop in your resume', 'PDF or DOCX. Your data is encrypted, always.'], ['02', 'Add a target role', 'Let our intelligence tune every insight to where you’re headed.'], ['03', 'Move with confidence', 'Get the improvements that turn potential into momentum.']].map(([n,t,d])=><div className="step" key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div><span>↗</span></div>)}</div></div></section>

    <section className="insights section reveal"><Tilt className="insight-window"><div className="window-top"><span><i /><i /><i /></span><b>ResumeAI Intelligence</b><small>{analysis ? 'Analysis complete' : 'Live analysis'}</small></div><div className="dashboard"><aside><span className="side-logo">✦</span><i>▦</i><i>◴</i><i>⌘</i><i>◌</i></aside><div className="dash-content"><div className="dash-header"><div><small>{analysis ? `ANALYSIS FOR ${analysis.fileName.toUpperCase()}` : 'WELCOME BACK, ALEX'}</small><h3>{analysis ? `${analysis.role}, in focus.` : 'Your career, in focus.'}</h3></div><button onClick={() => setUploadOpen(true)}>+ New analysis</button></div><div className="dash-grid"><div className="dash-score"><ScoreRing score={analysis ? 98 : 96} /><div><small>PROFILE STRENGTH</small><h4>{analysis ? 'Outstanding' : 'Exceptional'}</h4><p>{analysis ? 'Top 3% of candidates' : 'Top 8% of candidates'}</p></div></div><div className="skill-box"><small>SKILL ALIGNMENT</small>{['Product Strategy','User Research','Systems Thinking'].map((x,i)=><div className="skill" key={x}><span>{x}</span><i><b style={{width:`${(analysis ? 96 : 92)-i*8}%`}} /></i><em>{(analysis ? 96 : 92)-i*8}%</em></div>)}</div><div className="suggestions"><small>AI OBSERVATION</small><p><span>✦</span> {analysis ? `Strong fit for ${analysis.role}. Add two measured outcomes to make your leadership impact unmistakable.` : 'Your leadership impact is strong. Add metrics to your last two roles to lift your score.'}</p><a>View all insights →</a></div></div></div></div></Tilt><div className="insight-copy"><div className="eyebrow">03 — SEE THE SIGNAL</div><h2>Everything you need<br />to <i>stand out.</i></h2><p>From the first scan to the final send, see a complete picture of your resume’s potential.</p><button onClick={() => setUploadOpen(true)} className="text-link">Explore the platform <b>→</b></button></div></section>

    <section id="pricing" className="pricing section reveal"><div className="pricing-head"><div className="eyebrow">04 — SIMPLE PRICING</div><h2>The next opportunity<br />is <i>worth it.</i></h2></div><div className="price-toggle"><button className={!yearly ? 'selected' : ''} onClick={() => setYearly(false)}>Monthly</button><button className={yearly ? 'selected' : ''} onClick={() => setYearly(true)}>Yearly <em>Save 30%</em></button></div><div className="price-grid"><article><p>FOR EXPLORERS</p><h3>Free</h3><span>For the next big thing.</span><ul><li><Check /> 1 resume analysis</li><li><Check /> Core ATS scoring</li><li><Check /> Essential feedback</li></ul><button onClick={() => setUploadOpen(true)}>Get started free</button></article><article className="pro"><div className="popular">MOST POPULAR</div><p>FOR GO-GETTERS</p><h3>${yearly ? '13' : '19'} <small>/ month</small></h3><span>{yearly ? 'Billed annually · Your unfair advantage.' : 'Your unfair advantage.'}</span><ul><li><Check /> Unlimited analyses</li><li><Check /> Role-specific optimization</li><li><Check /> AI cover letter assistant</li><li><Check /> Priority support</li></ul><button onClick={() => setUploadOpen(true)}>Start 7-day free trial <b>→</b></button></article><article><p>FOR TEAMS</p><h3>Let’s talk</h3><span>Career growth at scale.</span><ul><li><Check /> Everything in Pro</li><li><Check /> Team analytics</li><li><Check /> Dedicated success partner</li></ul><button onClick={() => setUploadOpen(true)}>Contact us</button></article></div></section>

    <section id="start" className="final-cta"><div className="cta-grid" /><div className="cta-orb" /><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Make your experience<br /><i>impossible to ignore.</i></h2><p>Your future self will thank you.</p><button className="primary" onClick={() => setUploadOpen(true)}>Analyze my resume <b>→</b></button></section>
    <footer><a className="brand" href="#top"><span>✦</span>Resume<span>AI</span></a><p>© 2026 ResumeAI. Built for ambitious people.</p><div><a>Privacy</a><a>Terms</a><a>LinkedIn</a></div></footer>
    <AnalyzeModal open={uploadOpen} onClose={() => setUploadOpen(false)} onComplete={setAnalysis} />
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
