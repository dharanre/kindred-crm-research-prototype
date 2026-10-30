README
======

Dataset title
-------------
AI Influencer Marketing Study: Perceived AI Influencer Authenticity,
Parasocial Interaction, Brand Trust and Purchase Intention under AI
Identity Disclosure – Survey-Experiment Data from Saudi Arabia

Research model
--------------
Perceived AI Influencer Authenticity (PIA) -> Parasocial Interaction (PSI)
-> Brand Trust (BT) -> Purchase Intention (PI)
Moderator: AI Identity Disclosure (randomized condition, AI_Disclosure)

Files
-----
1. ai_influencer_disclosure_data.csv      Anonymous respondent-level data
                                          (600 rows x 45 variables)
2. ai_influencer_disclosure_codebook.csv  Variable names, labels, full item
                                          wording, value labels, sources, notes
3. README.txt                             This file

Study design
------------
Randomized, scenario-based online survey experiment (between-subjects).
All participants viewed the same sponsored social-media post in which a
synthetic AI influencer ("MIRA") endorses sneakers from a fictitious brand
("NOVA"). Image, brand, product description, caption, price, layout and
sponsored-post wording were identical across conditions; only the
prominence of the AI-identity disclosure differed.

  AI_Disclosure = 1  Condition A – Explicit AI identity disclosure  (n = 300)
     Profile label "AI-generated virtual influencer" plus the statement:
     "MIRA is a fully synthetic digital persona created using artificial
     intelligence. No real human is depicted."
  AI_Disclosure = 0  Condition B – No explicit AI identity disclosure (n = 300)
     Profile label "Digital lifestyle creator"; no statement about AI or
     nonhuman identity.

Participants were randomized 1:1 and debriefed after the survey.

Population and eligibility
--------------------------
Adults residing in Saudi Arabia recruited through an online consumer panel.
The survey terminated for any "No" answer to the screening items, so all
retained cases have Consent = 1 and S1-S5 = 1:
  S1  aged 18 or older
  S2  currently residing in Saudi Arabia
  S3  uses at least one social-media platform at least once a week
  S4  purchased a product or service online in the last three months
  S5  saw creators/influencers promote products or brands in the last
      three months
All retained respondents passed the attention check (AC1 = 6, "Agree").

Measures
--------
All multi-item measures use a 7-point Likert scale
(1 = Strongly disagree, 7 = Strongly agree). Full wording and sources for
every item are given in the codebook.

  Construct                               Items      Composite  Alpha*
  Manipulation check (AI disclosure)      MC1-MC3    -          .944
  Perceived AI influencer authenticity    PIA1-PIA3  PIA_Mean   .863
  Parasocial interaction                  PSI1-PSI5  PSI_Mean   .894
  Brand trust                             BT1-BT4    BT_Mean    .899
  Purchase intention                      PI1-PI4    PI_Mean    .900

  * Cronbach's alpha computed on this dataset (N = 600).

Composite scores are unweighted item means; no items are reverse-coded.
They are stored rounded to 4 decimal places.

Manipulation check
------------------
MC1-MC3 verify that the disclosure manipulation worked and are not part of
the structural measurement model. The moderator is the randomized
condition (AI_Disclosure), not the mean of the MC items.
Mean MC score: Explicit disclosure = 5.91; No explicit disclosure = 2.13.

Demographic and behavioural variables
-------------------------------------
D1_Gender, D2_Age, D3_Education, D4_Employment, D5_Income (SAR),
D6_Region, D7_Platform, D8_SocialMediaUse, D9_EndorsementExposure,
D10_AI_Familiarity (1-7), D11_OnlineShoppingFreq, D12_InfluencerPurchase.
Numeric codes follow the order of the response categories in the
questionnaire; value labels are listed in the codebook.
Note: D5_Income code 6 = "Prefer not to say" and D1_Gender code 3 =
"Prefer not to say". D9 is coded so that a higher value means less frequent
exposure.

Missing data
------------
No missing values.

File format
-----------
CSV, comma-delimited, UTF-8 encoding, variable names in the first row,
period (.) as decimal separator.

Ethics and anonymity
--------------------
Informed consent was obtained at the start of the survey and participants
could withdraw before submitting. No names, phone numbers, national IDs or
other personally identifying information were collected. Respondents are
identified only by sequential codes (R001-R600).
Ethics approval: [committee name and approval number]

Measurement sources
-------------------
Chaudhuri, A., & Holbrook, M. B. (2001). Journal of Marketing, 65(2), 81-93.
  https://doi.org/10.1509/jmkg.65.2.81.18255
Chung, S., & Cho, H. (2017). Psychology & Marketing, 34(4), 481-495.
  https://doi.org/10.1002/mar.21001
Dabiran, E., Farivar, S., Wang, F., & Grant, G. (2024). Journal of Retailing
  and Consumer Services, 79, 103797.
  https://doi.org/10.1016/j.jretconser.2024.103797
Hwang, K., & Zhang, Q. (2018). Computers in Human Behavior, 87, 155-173.
  https://doi.org/10.1016/j.chb.2018.05.029
Lee, H., Shin, M., Yang, J., & Chock, T. M. (2025). International Journal of
  Human-Computer Interaction, 41(10), 6029-6046.
  https://doi.org/10.1080/10447318.2024.2374100
Moulard, J. G., Garrity, C. P., & Rice, D. H. (2015). Psychology &
  Marketing, 32(2), 173-186. https://doi.org/10.1002/mar.20771
Muniz, F., Stewart, K., & Magalhaes, L. (2024). Journal of Consumer
  Behaviour, 23(3), 1234-1250. https://doi.org/10.1002/cb.2271
Sokolova, K., & Kefi, H. (2020). Journal of Retailing and Consumer
  Services, 53, 101742. https://doi.org/10.1016/j.jretconser.2019.01.011
Wang, X., & Qiu, X. (2024). Journal of Retailing and Consumer Services, 78,
  103777. https://doi.org/10.1016/j.jretconser.2024.103777
Xia, H., Zhang, L., Chen, J., & Wang, X. (2025). Journal of Retailing and
  Consumer Services, 87, 104366.
  https://doi.org/10.1016/j.jretconser.2025.104366

License
-------
[e.g., CC BY 4.0]

Contact
-------
[Author name, affiliation, email]
