import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual, createHash, createHmac } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const port = Number(process.env.PORT || 8787)
const secret = process.env.SESSION_SECRET
if (!secret || secret.length < 32) throw new Error('Set SESSION_SECRET to a random value of at least 32 characters.')
mkdirSync(join(process.cwd(), 'data'), { recursive: true })
const db = new DatabaseSync(join(process.cwd(), 'data', 'resumeai.db'))
db.exec(`PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL);`)

const json = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)) }
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(part => { const [key,...value] = part.trim().split('='); return [key, decodeURIComponent(value.join('='))] }))
const hash = value => createHash('sha256').update(value).digest('hex')
const sign = value => createHmac('sha256', secret).update(value).digest('base64url')
const validSessionCookie = value => { const [token, signature] = String(value || '').split('.'); if (!token || !signature) return null; const expected = sign(token); return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) ? token : null }
const passwordHash = password => { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}` }
const passwordMatches = (password, stored) => { const [salt, saved] = stored.split(':'); const actual = scryptSync(password, salt, 64).toString('hex'); return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(saved, 'hex')) }
const setSession = (res, userId) => { const token = randomBytes(32).toString('base64url'); const id = crypto.randomUUID(); const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(id, userId, hash(token), expires); res.setHeader('Set-Cookie', `resumeai_session=${encodeURIComponent(`${token}.${sign(token)}`)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`) }
const currentUser = req => { const token = validSessionCookie(cookies(req).resumeai_session); if (!token) return null; const row = db.prepare('SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?').get(hash(token), Date.now()); return row || null }
const readBody = req => new Promise((resolve, reject) => { let data=''; req.on('data', chunk => { data += chunk; if (data.length > 1_000_000) reject(new Error('Request too large')) }); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch { reject(new Error('Invalid JSON')) } }); req.on('error', reject) })

createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return json(res, 204, {})
    const path = new URL(req.url, `http://${req.headers.host}`).pathname
    if (req.method === 'GET' && path === '/api/auth/me') { const user=currentUser(req); return user ? json(res, 200, { user }) : json(res, 401, { error: 'Not signed in' }) }
    if (req.method === 'POST' && (path === '/api/auth/signup' || path === '/api/auth/login')) {
      const { email, password } = await readBody(req); const cleanEmail=String(email||'').trim().toLowerCase()
      if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || String(password||'').length < 8) return json(res, 400, { error: 'Use a valid email and a password of at least 8 characters.' })
      let user
      if (path.endsWith('signup')) { if (db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail)) return json(res,409,{error:'An account already exists for this email.'}); user={id:crypto.randomUUID(),email:cleanEmail}; db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)').run(user.id,user.email,passwordHash(password),new Date().toISOString()) }
      else { const row=db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail); if (!row || !passwordMatches(password,row.password_hash)) return json(res,401,{error:'Incorrect email or password.'}); user={id:row.id,email:row.email} }
      setSession(res,user.id); return json(res,200,{user})
    }
    if (req.method === 'POST' && path === '/api/auth/logout') { const token=validSessionCookie(cookies(req).resumeai_session); if(token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hash(token)); res.setHeader('Set-Cookie','resumeai_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'); return json(res,200,{ok:true}) }
    const user=currentUser(req); if (!user) return json(res,401,{error:'Authentication required.'})
    if (req.method === 'GET' && path === '/api/reports') { const reports=db.prepare('SELECT payload FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(user.id).map(row=>JSON.parse(row.payload)); return json(res,200,{reports}) }
    if (req.method === 'POST' && path === '/api/reports') { const { report }=await readBody(req); if(!report?.id || !report?.role) return json(res,400,{error:'Invalid report.'}); db.prepare('INSERT OR REPLACE INTO reports VALUES (?, ?, ?, ?, ?)').run(report.id,user.id,report.role,JSON.stringify(report),new Date().toISOString()); return json(res,201,{report}) }
    return json(res,404,{error:'Not found'})
  } catch (error) { return json(res,400,{error:error.message || 'Request failed'}) }
}).listen(port, () => console.log(`ResumeAI API listening on http://127.0.0.1:${port}`))
