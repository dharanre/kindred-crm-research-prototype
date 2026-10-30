import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(root, 'data', 'ai_influencer_disclosure_data.csv');
const constructs = {
  authenticity: { label: 'Perceived authenticity', composite: 'PIA_Mean', items: ['PIA1', 'PIA2', 'PIA3'] },
  parasocial: { label: 'Parasocial interaction', composite: 'PSI_Mean', items: ['PSI1', 'PSI2', 'PSI3', 'PSI4', 'PSI5'] },
  trust: { label: 'Brand trust', composite: 'BT_Mean', items: ['BT1', 'BT2', 'BT3', 'BT4'] },
  purchase: { label: 'Purchase intention', composite: 'PI_Mean', items: ['PI1', 'PI2', 'PI3', 'PI4'] }
};

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const header = rows.shift() || [];
  return rows.filter(r => r.length === header.length).map(values => Object.fromEntries(header.map((key, i) => [key, values[i]])));
}
function mean(values) { return values.reduce((a, b) => a + b, 0) / values.length; }
function variance(values) { const m = mean(values); return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1); }
function sd(values) { return Math.sqrt(variance(values)); }
function covariance(a, b) { const ma = mean(a), mb = mean(b); return a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / (a.length - 1); }
function correlation(a, b) { return covariance(a, b) / (sd(a) * sd(b)); }
function alpha(rows, items) {
  const cols = items.map(k => rows.map(r => Number(r[k])));
  const totals = rows.map(r => items.reduce((s, k) => s + Number(r[k]), 0));
  return items.length / (items.length - 1) * (1 - cols.reduce((s, c) => s + variance(c), 0) / variance(totals));
}

// Lanczos log-gamma and continued fraction for a two-sided Welch t-test p-value.
const lanczos = [676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
function logGamma(z) {
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1; let x = 0.99999999999980993;
  for (let i = 0; i < lanczos.length; i++) x += lanczos[i] / (z + i + 1);
  const t = z + lanczos.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
function betaFraction(a, b, x) {
  const max = 200, eps = 3e-14, fpmin = 1e-300;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < fpmin) d = fpmin;
  d = 1 / d; let h = d;
  for (let m = 1; m <= max; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < fpmin) d = fpmin;
    c = 1 + aa / c; if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d; const delta = d * c; h *= delta;
    if (Math.abs(delta - 1) < eps) break;
  }
  return h;
}
function regularizedBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
  return x < (a + 1) / (a + b + 2) ? front * betaFraction(a, b, x) / a : 1 - front * betaFraction(b, a, 1 - x) / b;
}
function welch(a, b) {
  const va = variance(a), vb = variance(b), na = a.length, nb = b.length;
  const se2 = va / na + vb / nb, t = (mean(a) - mean(b)) / Math.sqrt(se2);
  const df = se2 ** 2 / ((va / na) ** 2 / (na - 1) + (vb / nb) ** 2 / (nb - 1));
  const p = regularizedBeta(df / (df + t * t), df / 2, 0.5);
  const pooled = Math.sqrt(((na - 1) * va + (nb - 1) * vb) / (na + nb - 2));
  return { difference: mean(b) - mean(a), t, df, p, cohenD: (mean(b) - mean(a)) / pooled };
}

export async function analyzeDataset() {
  const raw = await readFile(dataFile, 'utf8');
  const rows = parseCsv(raw);
  if (rows.length !== 600 || !rows[0]?.AI_Disclosure || !rows[0]?.PIA_Mean) throw new Error('The research CSV is missing or does not match the documented dataset.');
  const conditions = [0, 1].map(code => {
    const subset = rows.filter(r => Number(r.AI_Disclosure) === code);
    return { code, label: code ? 'Explicit AI disclosure' : 'No explicit AI disclosure', n: subset.length, rows: subset };
  });
  const metricResults = Object.entries(constructs).map(([key, meta]) => {
    const groups = conditions.map(group => {
      const values = group.rows.map(r => Number(r[meta.composite]));
      return { code: group.code, label: group.label, n: values.length, mean: mean(values), sd: sd(values) };
    });
    return { key, label: meta.label, composite: meta.composite, groups, comparison: welch(conditions[0].rows.map(r => Number(r[meta.composite])), conditions[1].rows.map(r => Number(r[meta.composite]))), alpha: alpha(rows, meta.items) };
  });
  const manipulation = ['MC1', 'MC2', 'MC3'].map(item => ({ item, groups: conditions.map(g => ({ label: g.label, mean: mean(g.rows.map(r => Number(r[item]))) })) }));
  const manipulationScores = conditions.map(g => g.rows.map(r => (Number(r.MC1) + Number(r.MC2) + Number(r.MC3)) / 3));
  const correlations = [['authenticity','parasocial'],['parasocial','trust'],['trust','purchase'],['authenticity','trust'],['trust','parasocial']].map(([a,b]) => ({ from:a, to:b, r:correlation(rows.map(r=>Number(r[constructs[a].composite])),rows.map(r=>Number(r[constructs[b].composite]))) }));
  return {
    source: { title:'AI Influencer Identity Disclosure, Perceived Authenticity, Parasocial Interaction, Brand Trust and Purchase Intention – A Survey Experiment in Saudi Arabia', doi:'10.17632/ks69yfk5by.1', url:'https://data.mendeley.com/datasets/ks69yfk5by/1', citation:'Elshanhaby, W., Noueldin, A., Atallah, H. K. E., Rakha, S. A., & Elshemi, A. A. (2026). Data for: AI Influencer Identity Disclosure, Perceived Authenticity, Parasocial Interaction, Brand Trust and Purchase Intention – A Survey Experiment in Saudi Arabia (Version 1). Mendeley Data. https://doi.org/10.17632/ks69yfk5by.1', license:'CC BY 4.0' },
    design: { n:rows.length, fields:Object.keys(rows[0]).length, country:'Saudi Arabia', assignment:'Randomized between-subjects, 1:1', conditions:conditions.map(({rows,...g})=>g), scale:'7-point Likert', scenario:'AI-generated virtual influencer endorsing a fictitious sneaker brand; disclosure prominence varied.' },
    measures: metricResults,
    manipulation,
    manipulationCheck: { groups: conditions.map((g, i) => ({ code:g.code, label:g.label, n:g.n, mean:mean(manipulationScores[i]), sd:sd(manipulationScores[i]) })), comparison:welch(manipulationScores[0], manipulationScores[1]) },
    correlations,
    limitations:['The experiment tests AI identity disclosure for a virtual influencer endorsement, not every type of AI-generated ad.','The sample is Saudi adults who use social media weekly and meet the online shopping and influencer-ad exposure screeners.','The two conditions differ in disclosure; this dataset does not compare human-created ads or emotional versus rational appeals.','Reported condition differences are descriptive experimental contrasts. The observed trust, authenticity, and purchase measures are self-reported intentions, not actual purchases.']
  };
}

export { parseCsv, dataFile };
