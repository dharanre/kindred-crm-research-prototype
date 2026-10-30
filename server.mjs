import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeDataset, dataFile } from './research.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const storeDir = path.join(root, 'data');
const storePath = path.join(storeDir, 'crm-store.json');
const port = Number(process.env.PORT || 4173);
const formats = ['Human-created', 'AI, disclosed', 'AI, undisclosed'];
const appeals = ['Emotional', 'Rational'];
const scoreFields = ['authenticity', 'trust', 'engagement', 'purchaseIntent'];
let saveQueue = Promise.resolve();
const seed = {
  baselineResponses: 0,
  responseCount: 0,
  study: { target: 150, status: 'draft', responses: [] },
  campaigns: [
    { id: 'cmp-summer', name: 'Summer, made together', emoji: '☀', format: 'Human-created', appeal: 'Emotional', responses: 248, trust: 4.2, auth: 4.4, status: 'Live' },
    { id: 'cmp-care', name: 'Everyday care, simply', emoji: '✿', format: 'AI, undisclosed', appeal: 'Rational', responses: 186, trust: 3.1, auth: 3.0, status: 'Live' },
    { id: 'cmp-morning', name: 'A better morning ritual', emoji: '☕', format: 'AI, disclosed', appeal: 'Rational', responses: 214, trust: 3.9, auth: 3.8, status: 'Live' },
    { id: 'cmp-garden', name: 'Stories from the garden', emoji: '🌱', format: 'Human-created', appeal: 'Emotional', responses: 153, trust: 4.4, auth: 4.5, status: 'Complete' },
    { id: 'cmp-ingredients', name: 'What goes into it', emoji: '✳', format: 'AI, disclosed', appeal: 'Emotional', responses: 129, trust: 3.7, auth: 3.6, status: 'In review' },
    { id: 'cmp-day', name: 'Made for your day', emoji: '◉', format: 'AI, undisclosed', appeal: 'Emotional', responses: 98, trust: 3.2, auth: 3.1, status: 'Complete' }
  ]
};

async function loadStore() {
  await mkdir(storeDir, { recursive: true });
  try { return JSON.parse(await readFile(storePath, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await saveStore(seed);
    return structuredClone(seed);
  }
}
let store = await loadStore();
const researchSummary = await analyzeDataset();
function saveStore(value = store) {
  saveQueue = saveQueue.then(() => writeFile(storePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8'));
  return saveQueue;
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 128_000) { reject(Object.assign(new Error('Request body is too large.'), { status: 413 })); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(Object.assign(new Error('Send valid JSON.'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}
function studySummary() {
  return { count: store.baselineResponses + store.study.responses.length, target: store.study.target, status: store.study.status, scores: researchSummary.measures };
}
function csvCell(value) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
function exportCsv() {
  const header = ['Campaign', 'Format', 'Appeal', 'Responses', 'Trust', 'Authenticity', 'Status'];
  const lines = [header, ...store.campaigns.map(c => [c.name, c.format, c.appeal, c.responses, c.trust || '', c.auth || '', c.status])];
  return '\ufeff' + lines.map(row => row.map(csvCell).join(',')).join('\r\n');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
    if (url.pathname === '/api/health' && req.method === 'GET') return send(res, 200, { ok: true, app: 'Kindred CRM prototype' });
    if (url.pathname === '/api/research' && req.method === 'GET') return send(res, 200, researchSummary);
    if (url.pathname === '/api/research/data.csv' && req.method === 'GET') {
      res.setHeader('Content-Disposition', 'attachment; filename="ai_influencer_disclosure_data.csv"');
      return send(res, 200, await readFile(dataFile), 'text/csv; charset=utf-8');
    }
    if (url.pathname === '/api/research/codebook.csv' && req.method === 'GET') {
      res.setHeader('Content-Disposition', 'attachment; filename="ai_influencer_disclosure_codebook.csv"');
      return send(res, 200, await readFile(path.join(root, 'data', 'ai_influencer_disclosure_codebook.csv')), 'text/csv; charset=utf-8');
    }
    if (url.pathname === '/api/research/results.csv' && req.method === 'GET') {
      const header = ['Outcome','No explicit disclosure mean','No explicit disclosure SD','Explicit disclosure mean','Explicit disclosure SD','Difference (disclosed minus undisclosed)','Welch t','Degrees of freedom','p value','Cohen d','Cronbach alpha'];
      const lines = [header, ...researchSummary.measures.map(m => [m.label,m.groups[0].mean.toFixed(4),m.groups[0].sd.toFixed(4),m.groups[1].mean.toFixed(4),m.groups[1].sd.toFixed(4),m.comparison.difference.toFixed(4),m.comparison.t.toFixed(4),m.comparison.df.toFixed(2),m.comparison.p.toFixed(5),m.comparison.cohenD.toFixed(4),m.alpha.toFixed(4)])];
      res.setHeader('Content-Disposition', 'attachment; filename="ai_disclosure_analysis_results.csv"');
      return send(res, 200, '\ufeff' + lines.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv; charset=utf-8');
    }
    if (url.pathname === '/api/campaigns' && req.method === 'GET') {
      const query = (url.searchParams.get('search') || '').toLowerCase();
      const status = url.searchParams.get('status') || 'all';
      const campaigns = store.campaigns.filter(c => c.name.toLowerCase().includes(query) && (status === 'all' || c.status === status));
      return send(res, 200, campaigns);
    }
    if (url.pathname === '/api/campaigns' && req.method === 'POST') {
      const body = await readBody(req);
      const name = String(body.name || '').trim();
      if (name.length < 2 || name.length > 80) return send(res, 400, { error: 'Campaign name must be between 2 and 80 characters.' });
      if (!formats.includes(body.format) || !appeals.includes(body.appeal)) return send(res, 400, { error: 'Choose a supported format and appeal.' });
      const campaign = { id: randomUUID(), name, emoji: body.format.startsWith('AI') ? '✳' : '✦', format: body.format, appeal: body.appeal, responses: 0, trust: null, auth: null, status: 'In review' };
      store.campaigns.unshift(campaign);
      await saveStore();
      return send(res, 201, campaign);
    }
    if (url.pathname === '/api/dashboard' && req.method === 'GET') {
      const average = key => {
        const measure = researchSummary.measures.find(m => m.key === key);
        return measure.groups.reduce((sum, group) => sum + group.mean * group.n, 0) / measure.groups.reduce((sum, group) => sum + group.n, 0);
      };
      return send(res, 200, { responseCount: researchSummary.design.n, trust: average('trust'), authenticity: average('authenticity'), study: studySummary() });
    }
    if (url.pathname === '/api/study' && req.method === 'GET') return send(res, 200, studySummary());
    if (url.pathname === '/api/study/launch' && req.method === 'POST') {
      store.study.status = 'live';
      await saveStore();
      return send(res, 200, studySummary());
    }
    if (url.pathname === '/api/responses' && req.method === 'POST') {
      const body = await readBody(req);
      if (!formats.includes(body.format) || !appeals.includes(body.appeal)) return send(res, 400, { error: 'Choose a supported ad format and appeal.' });
      const ratings = body.ratings;
      if (!ratings || scoreFields.some(key => !Number.isInteger(ratings[key]) || ratings[key] < 1 || ratings[key] > 5)) return send(res, 400, { error: 'Rate each statement from 1 to 5.' });
      const response = { id: randomUUID(), format: body.format, appeal: body.appeal, ratings, createdAt: new Date().toISOString() };
      store.study.responses.push(response);
      await saveStore();
      return send(res, 201, { saved: true, study: studySummary(), responseCount: store.responseCount + store.study.responses.length });
    }
    if (url.pathname === '/api/export.csv' && req.method === 'GET') {
      res.setHeader('Content-Disposition', 'attachment; filename="kindred-campaign-report.csv"');
      return send(res, 200, exportCsv(), 'text/csv; charset=utf-8');
    }
    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'API route not found.' });
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const fullPath = path.resolve(root, `.${pathname}`);
    if (!fullPath.startsWith(`${root}${path.sep}`)) return send(res, 403, { error: 'Forbidden.' });
    const body = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (!res.headersSent) send(res, error.status || (error.code === 'ENOENT' ? 404 : 500), { error: error.message || 'Unexpected server error.' });
    else res.destroy();
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Kindred CRM is running at http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
