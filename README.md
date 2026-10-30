# Kindred CRM research prototype

A runnable, local dashboard for explaining how explicit AI identity disclosure affected consumer responses to a virtual-influencer endorsement. The dashboard and faculty briefing are calculated from the bundled public respondent-level dataset. The campaign-management and survey screens are separate CRM workflow demos; their entries are not mixed into the published research data.

## Start the project

Requires Node.js 20 or newer. No package installation or internet connection is required after the project folder is available.

On Windows, double-click `start.bat`. Or use PowerShell:

```powershell
npm start
```

Or run `node server.mjs` directly. No `npm install` step is required.

Open <http://127.0.0.1:4173>. The server recalculates dataset results from `data/ai_influencer_disclosure_data.csv` at startup. It stores any local demo campaigns and survey submissions in `data/crm-store.json`.

Stop the server with `Ctrl+C` in its terminal.

### Run the analysis from the command line

```powershell
npm run analyze
```

This prints the same descriptive statistics and condition comparisons used by the dashboard. It reads the included CSV and does not send data to an external service.

## What to show faculty

1. **Overview** — 600 eligible respondents and actual differences between randomized disclosure conditions.
2. **Faculty briefing** — study design, methods, scale reliability, results, speaker notes, citation, and limitations.
3. **Insights & actions** — correlation and CRM implications, with unsupported claims called out.
4. **Campaigns / Audience study** — demonstrate the prototype's local workflow. The UI labels these as illustrative and separate from the source experiment.

The brief result is that brand trust was modestly higher under explicit disclosure. Perceived authenticity, parasocial interaction, and purchase intention did not show statistically significant between-condition differences in the computed Welch tests. The disclosure manipulation check was strong. See the briefing page for exact means, p-values, effect sizes, reliability estimates, and scope limits.

## Dataset and attribution

Bundled files in `data/`:

- `ai_influencer_disclosure_data.csv` — 600 anonymous respondent records and 45 fields.
- `ai_influencer_disclosure_codebook.csv` — field descriptions, item wording, value coding, and measure sources.
- `dataset_README.txt` — source study design and coding details.
- `crm-store.json` — local prototype state (not part of the research dataset).

The CSV and codebook are included in this repository so the prototype runs offline. The research dataset is public and distributed under CC BY 4.0; keep the citation below when reusing it. The local CRM store is only a small seed for the demo. New campaign and survey-demo entries are saved there while the server runs.

Source: Elshanhaby, W., Noueldin, A., Atallah, H. K. E., Rakha, S. A., & Elshemi, A. A. (2026). *Data for: AI Influencer Identity Disclosure, Perceived Authenticity, Parasocial Interaction, Brand Trust and Purchase Intention – A Survey Experiment in Saudi Arabia* (Version 1). Mendeley Data. [https://doi.org/10.17632/ks69yfk5by.1](https://doi.org/10.17632/ks69yfk5by.1). Licensed CC BY 4.0. The app provides downloads for the raw CSV, codebook, and analysis results.

## Analysis implemented

`research.mjs` reads the CSV with Node's built-in modules and computes:

- condition means and standard deviations for authenticity, parasocial interaction, brand trust, and purchase intention;
- Welch independent-samples t-tests, two-sided p-values, and pooled-standard-deviation Cohen's *d*;
- Cronbach's alpha for each multi-item outcome scale;
- the manipulation-check composite and Pearson correlations between study constructs.

The displayed analysis is descriptive and suitable for a prototype presentation. It does not claim to reproduce the source paper's full PLS-SEM or mediation analysis.

## API

- `GET /api/health` — server status
- `GET /api/research` — dataset metadata and computed summaries
- `GET /api/research/data.csv` — download raw data
- `GET /api/research/codebook.csv` — download codebook
- `GET /api/research/results.csv` — download computed results
- `GET /api/campaigns?search=&status=` — illustrative local campaigns
- `POST /api/campaigns` — add an illustrative campaign
- `GET /api/study` — local demo form count and published results
- `POST /api/study/launch` — enable the local survey demo
- `POST /api/responses` — save a separate 1–5 demo response locally
- `GET /api/export.csv` — export illustrative campaigns

The server binds to `127.0.0.1` and is intended for local classroom demonstration, not production deployment.
