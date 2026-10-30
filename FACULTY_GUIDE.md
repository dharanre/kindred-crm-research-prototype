# Faculty presentation guide

## Project title

**AI identity disclosure and consumer–brand relationships**

## 30-second opening

“Our project asks whether telling consumers that an influencer is AI-generated changes how they respond to the endorsed brand. We use a public, randomized survey experiment with 600 Saudi consumers. Everyone viewed the same virtual-influencer sneaker advertisement; the randomized treatment changed whether the AI identity was made explicit. We compare authenticity, social connection, brand trust, and purchase intention.”

## Four-minute walkthrough

### 1. Why this is a CRM question

AI can make brand content faster to produce, while customers may also care about authenticity and transparency. For CRM, the practical issue is whether disclosure changes trust and relationship signals, and whether those signals carry through to stated purchase intention.

### 2. What was tested

The source study randomly assigned 600 eligible Saudi adults, 300 per condition. Participants saw an otherwise identical sponsored social post in which the synthetic influencer MIRA endorsed sneakers from fictional brand NOVA. One group saw an explicit AI identity disclosure; the other saw a “digital lifestyle creator” label without an explicit AI statement.

### 3. How the analysis works

Each outcome is a multi-item 7-point Likert composite. We first inspect the three manipulation-check items, then report Cronbach’s alpha for each scale, compare condition means using two-sided Welch t-tests, and show Cohen’s *d* for effect size. Pearson correlations describe associations among the constructs. The prototype recalculates these figures from the bundled CSV on startup.

### 4. Main result

The manipulation worked: the AI-identity check composite was much higher in the explicit-disclosure condition. Brand trust was higher by about 0.20 points on the 7-point scale (*p* ≈ .012, *d* ≈ .21), a small difference. The disclosed and undisclosed groups did not differ significantly on perceived authenticity, parasocial interaction, or purchase intention. Trust and purchase intention were positively correlated across respondents (*r* ≈ .47), but that correlation does not prove trust caused purchase intention.

### 5. Practical conclusion

In this specific virtual-influencer scenario, disclosure coincided with a small increase in brand trust, but it did not reliably change purchase intention. A CRM team should measure trust and downstream action separately and run additional tests across different products, audiences, and creative styles before applying the result broadly.

## Questions faculty may ask

**Is this our own survey?** No. It is a public, anonymized secondary dataset. The app's “Audience study” page is a separate local UI demonstration and must not be presented as part of the published sample.

**Can we say disclosure caused the trust difference?** The study uses randomized assignment and a common stimulus, so a between-condition interpretation is more defensible than an observational comparison. The prototype reports group contrasts and does not reproduce the source study's full structural equation model.

**Why is purchase intention not significant if trust correlates with it?** The randomized disclosure comparison and respondent-level correlation answer different questions. An association between trust and intention does not mean the disclosure treatment caused a change in intention.

**Can we generalize to all AI advertising?** No. The stimulus is a virtual influencer endorsement for a fictitious sneaker brand; the sample is eligible adults in Saudi Arabia. The data do not compare human-created ads, rational versus emotional appeal, actual purchases, or every disclosure format.

## Source citation

Elshanhaby, W., Noueldin, A., Atallah, H. K. E., Rakha, S. A., & Elshemi, A. A. (2026). *Data for: AI Influencer Identity Disclosure, Perceived Authenticity, Parasocial Interaction, Brand Trust and Purchase Intention – A Survey Experiment in Saudi Arabia* (Version 1). Mendeley Data. https://doi.org/10.17632/ks69yfk5by.1. CC BY 4.0.
