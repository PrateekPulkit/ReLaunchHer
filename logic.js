/**
 * logic.js — Model-based career plan inference engine for ReLaunchHer
 *
 * Architecture: weighted multi-factor scoring model
 * - Each profile field contributes independent score components
 * - Scores are normalized and combined to produce a readiness index
 * - All plan outputs (roadmap, sprint, gaps, nudges) are derived
 *   dynamically from the score components — nothing is hardcoded to a
 *   single field value.
 */

// ─────────────────────────────────────────────
// ROLE CATALOG — extended to 12 roles
// ─────────────────────────────────────────────
const roleCatalog = {
  "software engineer": {
    title: "Software Engineer",
    requiredSkills: ["javascript", "react", "apis", "git", "testing", "cloud basics", "typescript", "ci/cd"],
    niceToHave: ["docker", "kubernetes", "system design", "agile"],
    industrySignals: [
      "AI-assisted development (GitHub Copilot, Cursor) is now a standard expectation — familiarity signals modern awareness.",
      "Portfolio-ready GitHub projects matter more than course certificates alone.",
      "Companies actively run returnship programs for engineers with 3–6 year gaps.",
    ],
    courses: [
      "Modern JavaScript and TypeScript (Scrimba / Zero To Mastery)",
      "React and modern frontend engineering (Udemy / Frontend Masters)",
      "REST APIs and backend fundamentals (Codecademy / Coursera)",
      "Testing fundamentals with Jest and Cypress",
    ],
    certifications: ["Google Cloud Digital Leader", "Meta Front-End Developer Certificate", "AWS Cloud Practitioner"],
    returnships: [
      "iRelaunch Tech Returnship Programs",
      "Path Forward partner companies (Amazon, Microsoft, PayPal)",
      "Frontend internship-to-conversion tracks at product companies",
    ],
    adjacentRoles: ["QA Automation Engineer", "Technical Support Engineer", "Frontend Developer", "Developer Advocate"],
    interviewPrompts: [
      "Walk me through a project you built and the technical decisions you made.",
      "How have you kept your engineering thinking active during your break?",
      "Tell me how you'd debug a production issue under time pressure.",
      "What's a new tool or pattern you've explored recently and why?",
    ],
    salaryRange: { min: 65000, mid: 95000, max: 140000 },
    demandLevel: "very-high",
  },

  "data analyst": {
    title: "Data Analyst",
    requiredSkills: ["sql", "excel", "dashboarding", "statistics", "data storytelling", "python", "bi tools"],
    niceToHave: ["power bi", "tableau", "r", "machine learning basics", "data cleaning"],
    industrySignals: [
      "Analysts are increasingly expected to deliver business recommendations, not just reports.",
      "Self-serve BI tools (Looker, Power BI) and stakeholder communication are table stakes.",
      "Demand for data literacy in non-tech sectors (healthcare, retail, education) is surging.",
    ],
    courses: [
      "SQL for analytics (Mode Analytics / Khan Academy)",
      "Power BI or Tableau dashboard design (Udemy)",
      "Practical business statistics (Coursera — Duke or UC Davis)",
      "Python for data analysis (DataCamp / Kaggle)",
    ],
    certifications: ["Google Data Analytics Professional", "Microsoft Power BI Data Analyst (PL-300)", "IBM Data Analyst"],
    returnships: [
      "Analytics fellowship programs (NerdWallet, Capital One, Shopify)",
      "Business intelligence contract-to-hire roles",
    ],
    adjacentRoles: ["Reporting Analyst", "Operations Analyst", "Research Associate", "BI Developer"],
    interviewPrompts: [
      "Walk me through how you translated messy data into a business decision.",
      "What metrics would you track for a product targeting working mothers returning to work?",
      "How do you communicate technical insights to a non-technical stakeholder?",
      "Tell me about a dashboard you built and how it changed behavior.",
    ],
    salaryRange: { min: 55000, mid: 80000, max: 115000 },
    demandLevel: "high",
  },

  "product manager": {
    title: "Product Manager",
    requiredSkills: ["roadmapping", "stakeholder management", "user research", "analytics", "prioritization", "documentation", "agile"],
    niceToHave: ["sql basics", "a/b testing", "okrs", "competitive analysis", "customer interviews"],
    industrySignals: [
      "PMs who can partner across design, data, and engineering with crisp written thinking stand out.",
      "Customer empathy and experimentation design are strong differentiators for comeback PMs.",
      "Companies value 'founding PM' energy — people who can do more with less, a key break-era skill.",
    ],
    courses: [
      "Product strategy and prioritization (Reforge / Product School)",
      "User research and jobs-to-be-done (IDEO U / Coursera)",
      "Metrics, OKRs, and experimentation for PMs (Udemy)",
      "Writing clear product specs and PRDs",
    ],
    certifications: ["Certified Scrum Product Owner (CSPO)", "Product School PM Certificate", "Google Project Management"],
    returnships: [
      "Associate Product Manager relaunch programs (Google, Adobe, PayPal)",
      "Program Manager transition roles with PM exposure",
    ],
    adjacentRoles: ["Program Manager", "Customer Success Lead", "Business Analyst", "Growth Analyst"],
    interviewPrompts: [
      "Tell me about a product tradeoff you had to navigate and how you decided.",
      "How would you relaunch a product after receiving conflicting user feedback?",
      "What makes you uniquely effective at cross-functional collaboration?",
      "Design a feature for a return-to-work platform targeting mothers.",
    ],
    salaryRange: { min: 75000, mid: 110000, max: 160000 },
    demandLevel: "high",
  },

  "ux designer": {
    title: "UX Designer",
    requiredSkills: ["wireframing", "figma", "user interviews", "accessibility", "prototyping", "design systems", "usability testing"],
    niceToHave: ["motion design", "design ops", "html basics", "research synthesis", "stakeholder facilitation"],
    industrySignals: [
      "Accessible design and rapid prototyping are table stakes, even for mid-level roles.",
      "Design portfolios explaining decisions clearly carry more weight than visual showcases alone.",
      "AI design tools (Framer, Galileo AI) are becoming part of the UX workflow.",
    ],
    courses: [
      "Figma for product design (Figma Academy / YouTube)",
      "Accessibility and inclusive UX (Deque University)",
      "Portfolio storytelling for designers (Coursera — Google UX Design)",
      "UX research methods and synthesis",
    ],
    certifications: ["Google UX Design Professional Certificate", "Nielsen Norman Group UX Foundations", "Interaction Design Foundation"],
    returnships: [
      "UX portfolio reboot cohorts (Springboard, CareerFoundry)",
      "Design apprenticeship programs at agencies",
    ],
    adjacentRoles: ["UI Designer", "Content Designer", "UX Research Associate", "Service Designer"],
    interviewPrompts: [
      "Walk me through your design process for a complex user problem.",
      "Tell me about a time empathy changed your design decision completely.",
      "How do you navigate conflicting feedback from stakeholders and users?",
      "What does inclusive design mean when building for women returning to work?",
    ],
    salaryRange: { min: 60000, mid: 88000, max: 125000 },
    demandLevel: "moderate",
  },

  "marketing specialist": {
    title: "Marketing Specialist",
    requiredSkills: ["campaign planning", "content strategy", "seo", "analytics", "social media", "copywriting", "email marketing"],
    niceToHave: ["paid ads", "crm", "marketing automation", "video content", "influencer strategy"],
    industrySignals: [
      "Modern marketing roles expect channel fluency, experimentation, and lightweight analytics ownership.",
      "Candidates who tie storytelling to measurable growth stand out quickly.",
      "AI-generated content tools need a human editor — your judgment is a differentiator.",
    ],
    courses: [
      "Digital marketing strategy (Google Digital Garage)",
      "SEO and content optimization (Moz / Ahrefs Academy)",
      "Marketing analytics essentials (Analytics Mania / GA4 training)",
      "Email marketing and automation (Mailchimp Academy / HubSpot)",
    ],
    certifications: ["Google Analytics 4 Certification", "HubSpot Content Marketing", "Meta Blueprint"],
    returnships: [
      "Content marketing relaunch programs (HubSpot partner agencies)",
      "Lifecycle marketing associate roles at SaaS companies",
    ],
    adjacentRoles: ["Content Strategist", "Community Manager", "Brand Coordinator", "Social Media Manager"],
    interviewPrompts: [
      "How would you measure the success of a career comeback campaign?",
      "Tell me about a campaign you improved after seeing the data.",
      "How do you adapt messaging to build trust first, then conversion?",
      "What's a trend in digital marketing you are actively experimenting with?",
    ],
    salaryRange: { min: 48000, mid: 70000, max: 100000 },
    demandLevel: "high",
  },

  "hr manager": {
    title: "HR Manager",
    requiredSkills: ["recruitment", "employee relations", "labor law", "performance management", "onboarding", "hr systems", "communication"],
    niceToHave: ["hris tools", "dei programs", "learning and development", "compensation analysis"],
    industrySignals: [
      "HR leaders who can articulate DEI strategy with measurable outcomes are highly valued.",
      "People analytics is now an expected competency for mid-level HR roles.",
      "Hybrid work policy design and wellbeing programs are top priorities post-pandemic.",
    ],
    courses: [
      "SHRM essentials or PHR/SPHR prep",
      "People analytics fundamentals (Coursera — Wharton)",
      "Employment law and compliance basics",
      "Learning & Development strategy",
    ],
    certifications: ["SHRM-CP or SHRM-SCP", "PHR / SPHR (HRCI)", "CIPD Level 5 (UK)"],
    returnships: [
      "HR generalist returnship programs (LinkedIn, Deloitte)",
      "People ops contract roles at scaling startups",
    ],
    adjacentRoles: ["Talent Acquisition Specialist", "People Operations", "L&D Coordinator", "HRBP"],
    interviewPrompts: [
      "How would you handle a conflict between a high-performer and a manager?",
      "Tell me how you'd design an onboarding program for remote hires.",
      "What's your approach to building inclusive hiring practices?",
      "How have you used data to make a people decision?",
    ],
    salaryRange: { min: 55000, mid: 80000, max: 120000 },
    demandLevel: "moderate",
  },

  "project manager": {
    title: "Project Manager",
    requiredSkills: ["planning", "risk management", "stakeholder communication", "budgeting", "scheduling", "agile", "documentation"],
    niceToHave: ["scrum", "jira", "change management", "vendor management", "pmp certification"],
    industrySignals: [
      "Remote project management requires stronger async communication and documentation skills.",
      "PMs with hybrid (agile + waterfall) experience are preferred in regulated industries.",
      "AI project tools (Notion AI, ClickUp) are accelerating expectations around delivery speed.",
    ],
    courses: [
      "PMP exam prep (Joseph Phillips / Andrew Ramdayal on Udemy)",
      "Agile and Scrum fundamentals (Coursera / Scrum.org)",
      "Project management with Jira and Asana",
      "Stakeholder and risk communication",
    ],
    certifications: ["PMP (PMI)", "CAPM (PMI)", "PSM I / PSPO (Scrum.org)", "PRINCE2 Practitioner"],
    returnships: [
      "PMO analyst contract roles",
      "Program coordinator returnship at large enterprises",
    ],
    adjacentRoles: ["Scrum Master", "Program Coordinator", "Operations Manager", "Delivery Lead"],
    interviewPrompts: [
      "Tell me about a project that went off-track and how you recovered it.",
      "How do you manage stakeholders who have conflicting priorities?",
      "Walk me through your approach to project risk planning.",
      "How have you adapted your PM style for remote or distributed teams?",
    ],
    salaryRange: { min: 60000, mid: 90000, max: 130000 },
    demandLevel: "high",
  },

  "financial analyst": {
    title: "Financial Analyst",
    requiredSkills: ["excel", "financial modeling", "reporting", "budgeting", "forecasting", "powerpoint", "data analysis"],
    niceToHave: ["sql", "python", "cfa", "erp systems", "valuation", "variance analysis"],
    industrySignals: [
      "FP&A roles now expect comfort with BI tools like Tableau or Power BI alongside Excel.",
      "Automation of routine reporting means analysts must add value through insight and narrative.",
      "Financial storytelling to non-finance executives is a top differentiator.",
    ],
    courses: [
      "Financial modeling and valuation (Wall Street Prep / CFI)",
      "Advanced Excel for finance (Udemy / Excel Jet)",
      "Power BI for finance teams",
      "FP&A fundamentals (AFP Training)",
    ],
    certifications: ["CFA Level 1", "CPA / ACCA", "FMVA (CFI)", "AFP FP&A Certification"],
    returnships: [
      "Finance returnship programs (Goldman Sachs, JPMorgan re-entry tracks)",
      "FP&A associate contract roles",
    ],
    adjacentRoles: ["Financial Planning & Analysis", "Budget Analyst", "Treasury Analyst", "Risk Analyst"],
    interviewPrompts: [
      "Walk me through how you'd build a 3-statement financial model from scratch.",
      "How have you communicated a budget variance to a non-finance executive?",
      "Tell me about a forecast that was significantly off and how you handled it.",
      "What would you look for first when auditing a company's cost structure?",
    ],
    salaryRange: { min: 60000, mid: 85000, max: 120000 },
    demandLevel: "moderate",
  },

  "content strategist": {
    title: "Content Strategist",
    requiredSkills: ["content planning", "seo", "editorial calendar", "copywriting", "analytics", "brand voice", "audience research"],
    niceToHave: ["video scripting", "ai content tools", "cms platforms", "newsletter growth", "podcast strategy"],
    industrySignals: [
      "Content strategy is evolving from volume-focused to authority-building — quality expertise signals win.",
      "AI-assisted content creation raises the bar on original insight and human perspective.",
      "Distribution strategy (SEO, newsletter, social) is now as important as creation.",
    ],
    courses: [
      "Content strategy fundamentals (Coursera / LinkedIn Learning)",
      "SEO content writing (Semrush Academy)",
      "Building an editorial strategy (HubSpot Academy)",
      "AI-powered content workflows",
    ],
    certifications: ["HubSpot Content Marketing Certification", "Semrush SEO Toolkit", "Google Analytics"],
    returnships: [
      "Editorial associate roles at media companies",
      "Content team returnship at B2B SaaS companies",
    ],
    adjacentRoles: ["SEO Specialist", "Brand Strategist", "Social Media Strategist", "Communications Manager"],
    interviewPrompts: [
      "Show me a piece of content you are proud of and explain the strategy behind it.",
      "How would you build a content engine for a brand with zero organic presence?",
      "What's your process for aligning content with business goals?",
      "How do you measure whether content is actually working?",
    ],
    salaryRange: { min: 50000, mid: 72000, max: 100000 },
    demandLevel: "moderate",
  },

  "business analyst": {
    title: "Business Analyst",
    requiredSkills: ["requirements gathering", "process mapping", "stakeholder interviews", "documentation", "sql", "excel", "use cases"],
    niceToHave: ["bpmn", "agile ba", "wireframing basics", "data analysis", "change management"],
    industrySignals: [
      "BAs who can bridge business and technology are in consistent demand across all sectors.",
      "Agile BA skills (user stories, sprint ceremonies) are now baseline expectations.",
      "Domain expertise (finance, healthcare, logistics) accelerates a BA's comeback significantly.",
    ],
    courses: [
      "Business analysis fundamentals (IIBA / Udemy)",
      "Agile and Scrum for BAs",
      "Process mapping with BPMN",
      "SQL for business analysts",
    ],
    certifications: ["CBAP / CCBA (IIBA)", "PMI-PBA", "Certified Agile BA (IIBA-AAC)"],
    returnships: [
      "BA associate contract roles in consulting firms",
      "Digital transformation project BA roles",
    ],
    adjacentRoles: ["Systems Analyst", "Product Owner", "Operations Analyst", "Process Improvement Consultant"],
    interviewPrompts: [
      "Tell me about a time you uncovered a requirement that the stakeholder didn't know they needed.",
      "How do you handle a stakeholder who keeps changing their mind?",
      "Walk me through how you'd map a complex business process you've never seen before.",
      "How do you validate that a solution actually meets the original business need?",
    ],
    salaryRange: { min: 58000, mid: 82000, max: 115000 },
    demandLevel: "high",
  },

  "sales manager": {
    title: "Sales Manager",
    requiredSkills: ["pipeline management", "crm", "negotiation", "team leadership", "forecasting", "customer success", "presentation"],
    niceToHave: ["salesforce", "enterprise sales", "territory planning", "sales enablement", "outbound strategy"],
    industrySignals: [
      "Sales leaders who can coach teams through uncertainty (not just close themselves) are scarce and valued.",
      "SaaS sales methodology (MEDDIC, SPIN, Challenger) knowledge is increasingly expected.",
      "Remote selling proficiency is now as valued as in-person relationship building.",
    ],
    courses: [
      "Salesforce CRM fundamentals (Trailhead)",
      "Sandler sales methodology fundamentals",
      "Sales coaching and team leadership",
      "Revenue operations and pipeline management",
    ],
    certifications: ["Salesforce Sales Cloud Consultant", "HubSpot Sales Software Certification", "Certified Sales Leader (CSL)"],
    returnships: [
      "Sales team lead return-to-work programs (Salesforce, HubSpot)",
      "Regional sales manager contract roles",
    ],
    adjacentRoles: ["Account Executive", "Customer Success Manager", "Revenue Operations Manager", "Business Development Manager"],
    interviewPrompts: [
      "Tell me about your most complex deal and how you navigated it to close.",
      "How do you coach a struggling rep without micromanaging?",
      "Describe how you'd build a sales territory strategy from scratch.",
      "What metric do you watch most closely as a leading indicator of team health?",
    ],
    salaryRange: { min: 70000, mid: 100000, max: 150000 },
    demandLevel: "moderate",
  },

  "operations manager": {
    title: "Operations Manager",
    requiredSkills: ["process optimization", "team management", "vendor management", "budgeting", "kpis", "logistics", "documentation"],
    niceToHave: ["lean / six sigma", "supply chain", "erp systems", "change management", "project management"],
    industrySignals: [
      "Ops leaders who can drive efficiency while maintaining team culture are in high demand.",
      "Digital operations literacy — knowing when and how to automate — is now a key differentiator.",
      "Cross-functional influence without authority is a critical ops management skill post-pandemic.",
    ],
    courses: [
      "Operations management fundamentals (Coursera — Wharton or Penn State)",
      "Lean / Six Sigma Green Belt training",
      "Supply chain management basics",
      "Data-driven operations with dashboards",
    ],
    certifications: ["Lean Six Sigma Green or Black Belt", "Certified Operations Manager (COM)", "PMP", "APICS CSCP"],
    returnships: [
      "Operations associate roles at e-commerce and logistics companies",
      "Chief of Staff returnship programs",
    ],
    adjacentRoles: ["Chief of Staff", "Logistics Manager", "Supply Chain Analyst", "Continuous Improvement Lead"],
    interviewPrompts: [
      "Tell me about a process you significantly improved — what was the before and after?",
      "How do you prioritize when three operational fires happen simultaneously?",
      "Describe how you'd build accountability in a remote or hybrid operations team.",
      "What data would you look at first if a key KPI suddenly dropped by 20%?",
    ],
    salaryRange: { min: 62000, mid: 90000, max: 130000 },
    demandLevel: "moderate",
  },
};

// ─────────────────────────────────────────────
// TRANSFERABLE STRENGTHS MODEL
// Maps break reasons to role-relevant soft skills
// ─────────────────────────────────────────────
const transferableStrengthsModel = {
  motherhood: {
    skills: ["structured planning under uncertainty", "empathy and active listening", "calm decision-making under pressure", "energy and priority management", "multitasking without losing quality"],
    narrative: "Parenting builds real-world skills in rapid problem-solving, stakeholder management (children are the most demanding stakeholders), and resilience under ambiguity — all directly valued in professional environments.",
  },
  caregiving: {
    skills: ["crisis management and rapid prioritization", "multi-stakeholder coordination", "emotional intelligence", "resilience and adaptability", "logistics and resource planning"],
    narrative: "Caregiving often involves managing complex, high-stakes decisions with limited resources — a direct parallel to operational and people-management roles.",
  },
  health: {
    skills: ["self-management and discipline", "boundary-setting and communication", "informed decision-making", "resilience and recovery mindset", "patience and focus under difficulty"],
    narrative: "Navigating a health challenge demonstrates persistence, self-awareness, and the ability to advocate for oneself — all early signals of a strong professional returning with new perspective.",
  },
  education: {
    skills: ["continuous learning and intellectual curiosity", "research discipline and structured thinking", "self-motivation and goal tracking", "analytical frameworks", "sustained focus on long-term goals"],
    narrative: "Choosing to invest in learning during a gap signals intentionality and self-direction — qualities employers prize in high-potential returnees.",
  },
  relocation: {
    skills: ["adaptability to new environments", "cross-cultural communication", "resourcefulness without a support network", "problem-solving in unfamiliar contexts", "resilience during transition"],
    narrative: "Navigating relocation demonstrates adaptability and cultural intelligence, skills increasingly valued in global and diverse teams.",
  },
  layoff: {
    skills: ["professional resilience and perspective", "proactive self-development during uncertainty", "networking under adversity", "strategic self-positioning", "independent initiative"],
    narrative: "Using a layoff period productively signals maturity and proactivity — being let go during a downturn is rarely a reflection of capability and is widely understood by hiring managers.",
  },
  entrepreneurship: {
    skills: ["ownership and accountability", "customer conversation and market sense", "financial and resource discipline", "wearing multiple hats", "risk tolerance and bias for action"],
    narrative: "Entrepreneurship or freelancing builds end-to-end thinking, customer empathy, and a bias for action — highly valued in product, sales, and operations roles.",
  },
  other: {
    skills: ["resilience and adaptability", "self-direction and initiative", "organizational discipline", "emotional maturity", "reflective decision-making"],
    narrative: "Taking time away from traditional employment for personal reasons is increasingly normalized and demonstrates self-awareness and life management skills that are assets in the workplace.",
  },
};

// ─────────────────────────────────────────────
// BLOCKER-TO-ACTION MAPPING MODEL
// ─────────────────────────────────────────────
const blockerActionModel = {
  confidence: {
    weekOne: "Create a 'career wins' document — list every significant achievement from your previous roles with numbers where possible.",
    tactic: "Start with low-stakes informational interviews before high-pressure applications. Build evidence before belief.",
    resource: "Read 'Presence' by Amy Cuddy or follow @Heidi_Grant_H on LinkedIn for research-backed confidence strategies.",
  },
  "skills-gap": {
    weekOne: "Identify the top two skill gaps from your plan and block 1 hour per day specifically for structured skill-building.",
    tactic: "Build one public proof-of-work artifact (GitHub project, Notion case study, or dashboard) within 30 days.",
    resource: "Use Coursera, DataCamp, Scrimba, or Kaggle for free or low-cost structured learning with certificates.",
  },
  resume: {
    weekOne: "Rewrite your profile headline and About section on LinkedIn with a comeback narrative — lead with what you bring, not what you paused.",
    tactic: "Use the STAR format (Situation, Task, Action, Result) for every bullet point on your resume.",
    resource: "Resume.io, Enhancv, or Rezi.ai — or get a free review from a returnship program coordinator.",
  },
  time: {
    weekOne: "Block two 30-minute focus windows each day — even during nap times or lunch. Consistency beats duration.",
    tactic: "Use a micro-sprint model: one task per session, no multitasking. One application, one course module, one message.",
    resource: "Try Cal Newport's 'Time Blocking' method or the 'Two Deep Work Blocks' framework.",
  },
  network: {
    weekOne: "Message 5 people this week — not to ask for jobs, but to catch up and ask one thoughtful question about their career.",
    tactic: "Join one industry-specific Slack community or LinkedIn group and comment on 3 posts this week.",
    resource: "Return-to-work networks: iRelaunch, Fairygodboss, Reboot Accel, Women Back to Work.",
  },
  market: {
    weekOne: "Research 10 job postings for your target role and list the top 10 skills that appear most frequently.",
    tactic: "Use Glassdoor, Levels.fyi, or Payscale to anchor your salary range before the first recruiter call.",
    resource: "LinkedIn Salary Insights, Glassdoor, and Bain's Women in the Workplace report for context.",
  },
  childcare: {
    weekOne: "Draft a personal schedule that shows your available hours clearly — this will help you commit to specific blocks.",
    tactic: "Look for roles with async flexibility or remote-first cultures where output matters more than hours.",
    resource: "Explore Care.com subsidized care, employer backup care programs, and co-working childcare spaces near you.",
  },
  clarity: {
    weekOne: "Take the Holland Code (RIASEC) and StrengthsFinder 2.0 assessments to surface what energizes you.",
    tactic: "Interview 3 people in the roles you're considering — not to get a job, but to understand what they actually do day to day.",
    resource: "Book 'Designing Your Life' by Burnett & Evans, and the 80,000 Hours career planning guide.",
  },
};

// ─────────────────────────────────────────────
// SAMPLE PERSONAS — enriched with new fields
// ─────────────────────────────────────────────
export const samplePersonas = [
  {
    id: "anjali",
    label: "Returning Mother",
    transitionType: "same-role",
    previousRole: "Software Engineer",
    yearsExperience: 5,
    careerBreakYears: 4,
    reasonCategory: "motherhood",
    previousIndustry: "tech",
    educationLevel: "bachelors",
    leadershipExperience: "informal",
    targetRole: "Software Engineer",
    skills: "JavaScript, HTML, CSS, Git, debugging, mentoring",
    certificationsHeld: "",
    workArrangement: "remote",
    employmentType: "fulltime",
    confidenceLevel: 46,
    weeklyHours: 10,
    networkingStatus: "light",
    profileStatus: "outdated",
    skillCurrency: "somewhat",
    topBlocker: "confidence",
    targetTimeline: "6",
    salaryExpectation: "same",
    successDefinition: "hired",
    supportSystem: "community",
    companyPreference: "remote-first",
  },
  {
    id: "fatima",
    label: "Career Switcher",
    transitionType: "career-switch",
    previousRole: "Marketing Specialist",
    yearsExperience: 6,
    careerBreakYears: 3,
    reasonCategory: "caregiving",
    previousIndustry: "media",
    educationLevel: "bachelors",
    leadershipExperience: "team-lead",
    targetRole: "Product Manager",
    skills: "Campaign planning, copywriting, stakeholder communication, analytics, research",
    certificationsHeld: "Google Analytics",
    workArrangement: "hybrid",
    employmentType: "fulltime",
    confidenceLevel: 58,
    weeklyHours: 10,
    networkingStatus: "moderate",
    profileStatus: "partial",
    skillCurrency: "mostly-current",
    topBlocker: "skills-gap",
    targetTimeline: "6",
    salaryExpectation: "same",
    successDefinition: "hired",
    supportSystem: "informal",
    companyPreference: "midsize",
  },
  {
    id: "meera",
    label: "Skills Refresher",
    transitionType: "refresh",
    previousRole: "Data Analyst",
    yearsExperience: 8,
    careerBreakYears: 2,
    reasonCategory: "relocation",
    previousIndustry: "finance",
    educationLevel: "masters",
    leadershipExperience: "manager",
    targetRole: "Data Analyst",
    skills: "Excel, reporting, SQL, presentations, business analysis, statistics",
    certificationsHeld: "Microsoft Excel Advanced",
    workArrangement: "flexible",
    employmentType: "contract",
    confidenceLevel: 67,
    weeklyHours: 15,
    networkingStatus: "active",
    profileStatus: "partial",
    skillCurrency: "mostly-current",
    topBlocker: "network",
    targetTimeline: "3",
    salaryExpectation: "above",
    successDefinition: "hired",
    supportSystem: "mentor",
    companyPreference: "enterprise",
  },
];

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────
function normalizeRole(role) {
  const normalized = String(role || "").trim().toLowerCase();
  return roleCatalog[normalized] ? normalized : normalizeRoleByFuzzy(normalized);
}

function normalizeRoleByFuzzy(input) {
  const keys = Object.keys(roleCatalog);
  for (const key of keys) {
    if (input.includes(key) || key.includes(input.split(" ")[0])) return key;
  }
  return "business analyst"; // default fallback
}

function parseSkills(skills) {
  return String(skills || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

function sentenceCase(value) {
  const s = String(value || "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ─────────────────────────────────────────────
// SCORING MODEL
// Produces a weighted readiness score (0–100) from
// all profile dimensions — not just experience + confidence
// ─────────────────────────────────────────────
function scoreProfile(profile, matchRatio) {
  const scores = {};

  // 1. Experience depth (max 20 pts)
  const expYears = Number(profile.yearsExperience) || 0;
  scores.experience = clamp(expYears * 2.5, 0, 20);

  // 2. Career break penalty (max −20 pts, reduced by mitigating factors)
  const breakYears = Number(profile.careerBreakYears) || 0;
  let breakPenalty = breakYears * 4;
  // Mitigate if they were upskilling or freelancing during break
  if (["education", "entrepreneurship"].includes(profile.reasonCategory)) breakPenalty *= 0.6;
  if (profile.skillCurrency === "current") breakPenalty *= 0.4;
  if (profile.skillCurrency === "mostly-current") breakPenalty *= 0.7;
  scores.breakPenalty = -clamp(breakPenalty, 0, 20);

  // 3. Skill match ratio (max 22 pts)
  scores.skillMatch = matchRatio * 22;

  // 4. Confidence level (max 12 pts)
  scores.confidence = (Number(profile.confidenceLevel) || 50) * 0.12;

  // 5. Education level (max 8 pts)
  const eduMap = { highschool: 2, diploma: 4, bachelors: 6, masters: 7, phd: 8, professional: 8, self: 5 };
  scores.education = eduMap[profile.educationLevel] || 5;

  // 6. Leadership experience (max 8 pts)
  const leaderMap = { none: 0, informal: 3, "team-lead": 5, manager: 7, "senior-leader": 8 };
  scores.leadership = leaderMap[profile.leadershipExperience] || 0;

  // 7. Networking activity (max 6 pts)
  const netMap = { none: 0, light: 2, moderate: 4, active: 6 };
  scores.networking = netMap[profile.networkingStatus] || 0;

  // 8. Profile / resume status (max 6 pts)
  const profileMap = { outdated: 0, partial: 3, updated: 6 };
  scores.profileStatus = profileMap[profile.profileStatus] || 0;

  // 9. Weekly time commitment (max 6 pts)
  const hoursMap = { "2": 1, "5": 3, "10": 5, "15": 6, "20": 6 };
  scores.weeklyHours = hoursMap[String(profile.weeklyHours)] || 3;

  // 10. Certifications held (max 4 pts)
  const certs = String(profile.certificationsHeld || "").trim();
  scores.certs = certs.length > 3 ? 4 : 0;

  // 11. Support system (max 4 pts)
  const supportMap = { none: 0, informal: 1, community: 2, mentor: 4 };
  scores.support = supportMap[profile.supportSystem] || 0;

  // 12. Transition type (modifier: same-role easier, full switch harder)
  const transitionModifier = { "same-role": 4, refresh: 2, adjacent: 0, "career-switch": -4 };
  scores.transition = transitionModifier[profile.transitionType] || 0;

  // 13. Previous industry match bonus (matching industry → target role)
  // (Simple heuristic: tech → SE/DA, finance → FA, etc.)
  scores.industryBonus = 0; // base, can be extended

  // Sum all components
  const rawScore = Object.values(scores).reduce((acc, v) => acc + v, 0);
  return clamp(Math.round(rawScore), 20, 96);
}

// ─────────────────────────────────────────────
// DYNAMIC ROADMAP BUILDER
// Sprint phases adapted to timeline + blocker + available hours
// ─────────────────────────────────────────────
function buildRoadmap(profile, roleProfile, missingSkills, readinessScore) {
  const topGap = missingSkills[0] || roleProfile.requiredSkills[0];
  const secondGap = missingSkills[1] || roleProfile.requiredSkills[1];
  const hours = Number(profile.weeklyHours) || 5;
  const timeline = String(profile.targetTimeline);
  const blocker = profile.topBlocker;
  const isUrgent = timeline === "1" || timeline === "3";
  const isCareerSwitch = profile.transitionType === "career-switch";

  const blockerItem = blockerActionModel[blocker] || blockerActionModel.confidence;

  // Phase 1: 30 days — always starts with biggest blocker + first skill gap
  const phase1Actions = [
    `Address your biggest blocker first — this week: ${blockerItem.weekOne}`,
    `Complete one focused course module on "${topGap}" — ${hours >= 10 ? "aim for 2 modules per week" : "one module is a solid start"}.`,
    "Rewrite your LinkedIn About section with a comeback narrative — lead with impact, not the gap.",
  ];
  if (isCareerSwitch) {
    phase1Actions.push(`Identify 5 people already working in ${roleProfile.title} and send one friendly message — not for jobs, just to learn.`);
  }

  // Phase 2: 60 days — create visible proof of work
  const phase2Actions = [
    `Build one tangible proof-of-work item using "${secondGap || topGap}" — a project, case study, dashboard, or portfolio piece.`,
    `Apply to ${isUrgent ? "8–12" : "5–8"} ${roleProfile.title} or adjacent roles per week with a tailored cover note.`,
    "Begin mock interview practice — record yourself answering one question about your career break using the STAR method.",
  ];
  if (profile.networkingStatus === "none" || profile.networkingStatus === "light") {
    phase2Actions.push("Join one return-to-work community (iRelaunch, Fairygodboss, or Reboot Accel) and participate in at least one conversation.");
  }

  // Phase 3: 90 days — activate and accelerate
  const phase3Actions = [
    `Target ${roleProfile.returnships[0] || "returnship programs"} specifically — these are designed for your situation.`,
    `Prepare 3 compact interview stories that frame your break as context and your skills as the point.`,
    "Track your week: applications sent, responses, interviews, and one improvement to your profile each week.",
  ];
  if (readinessScore >= 70) {
    phase3Actions.push("With your readiness score, you are interview-ready — focus energy on quality applications over volume.");
  } else {
    phase3Actions.push("Close the top skill gap fully before the 90-day mark — this unlocks the biggest readiness jump.");
  }

  return [
    { phase: "30 Days", focus: "Clear the blocker. Start the refresh.", actions: phase1Actions },
    { phase: "60 Days", focus: "Build proof. Enter the market.", actions: phase2Actions },
    { phase: "90 Days", focus: "Activate returnships. Accelerate.", actions: phase3Actions },
  ];
}

// ─────────────────────────────────────────────
// WEEKLY SPRINT BUILDER
// Generates a realistic 5-item sprint personalized to the profile
// ─────────────────────────────────────────────
function buildWeeklySprint(profile, roleProfile, missingSkills) {
  const topGap = missingSkills[0] || roleProfile.requiredSkills[0];
  const secondGap = missingSkills[1] || roleProfile.requiredSkills[1];
  const hours = Number(profile.weeklyHours) || 5;
  const blockerAction = (blockerActionModel[profile.topBlocker] || blockerActionModel.confidence).weekOne;

  const sprint = [
    `Blocker action: ${blockerAction}`,
    `Spend ${Math.max(1, Math.floor(hours / 3))}h on "${topGap}" — complete one exercise or lesson with something to show.`,
    `Network nudge: reach out to ${profile.networkingStatus === "active" ? "3 new contacts" : "2 former colleagues"} in ${roleProfile.title} or adjacent roles.`,
    profile.profileStatus !== "updated"
      ? "Profile update: rewrite your resume's top 3 bullet points using impact and numbers."
      : `Apply to ${profile.transitionType === "career-switch" ? "3 targeted adjacent roles" : "5 roles in your target track"} with a tailored message.`,
    `Publish or polish one proof-of-work artifact connected to "${secondGap || topGap}".`,
  ];

  return sprint;
}

// ─────────────────────────────────────────────
// CONFIDENCE PLAN BUILDER
// ─────────────────────────────────────────────
function buildConfidencePlan(profile, readinessScore) {
  const confidence = Number(profile.confidenceLevel) || 50;
  const blocker = blockerActionModel[profile.topBlocker] || blockerActionModel.confidence;

  const base = [
    "Write a two-line comeback story: what you are bringing back, not what you paused.",
    "Track one weekly win — write it down every Friday. Visible progress changes how you feel.",
    `Tactic: ${blocker.tactic}`,
  ];

  if (confidence < 40) {
    return [
      ...base,
      "Start with low-stakes conversations — informational interviews, community events — before high-pressure applications.",
      `Resource: ${blocker.resource}`,
    ];
  }

  if (confidence < 65) {
    return [
      ...base,
      "Use your previous achievements as evidence: your capability is intact even if your context changed.",
      `Resource: ${blocker.resource}`,
    ];
  }

  return [
    ...base,
    `With ${readinessScore}% readiness, your biggest risk is over-preparing. Set a date to start applying and commit to it.`,
    "Get one peer to review your interview answers — external validation is the fastest confidence accelerator.",
  ];
}

// ─────────────────────────────────────────────
// NUDGE / ENCOURAGEMENT BUILDER
// ─────────────────────────────────────────────
function buildNudges(profile, readinessScore) {
  const { transitionType, yearsExperience, careerBreakYears, reasonCategory } = profile;
  const nudges = [];

  if (readinessScore >= 75) {
    nudges.push("Your readiness score puts you ahead of many first-time returnees. The next step is proof, not more preparation.");
    nudges.push(`With ${yearsExperience} years of experience, you bring depth that a recent graduate simply cannot replicate.`);
  } else if (readinessScore >= 55) {
    nudges.push("A focused 6-week sprint on your top two gaps could move your readiness into the confident zone.");
    nudges.push(`Your ${reasonCategory} break gave you skills that are genuinely hard to teach — lead with them.`);
  } else {
    nudges.push("You do not need to close every gap before applying. Employers hire for trajectory and attitude as much as current skills.");
    nudges.push(`Many returnees land roles within ${transitionType === "career-switch" ? "9–12" : "4–6"} months with a consistent plan. Start is the hardest part.`);
  }

  if (transitionType === "career-switch") {
    nudges.push(`Switching into ${profile.targetRole} is ambitious and very achievable — your cross-domain perspective is a genuine asset, not a liability.`);
  }

  return nudges;
}

// ─────────────────────────────────────────────
// NARRATIVE SUMMARY BUILDER
// ─────────────────────────────────────────────
function buildNarrativeSummary(profile, roleProfile, readinessScore, matchPercent) {
  const reason = sentenceCase(profile.reasonCategory || "personal");
  const breakModel = transferableStrengthsModel[profile.reasonCategory] || transferableStrengthsModel.other;
  const timeline = profile.targetTimeline;
  const timelineLabel = timeline === "1" ? "1 month" : timeline === "flexible" ? "a flexible timeline" : `${timeline} months`;

  return `A ${profile.previousRole || "professional"} with ${profile.yearsExperience || 0} years of experience returning after a ${profile.careerBreakYears || 0}-year break for ${reason.toLowerCase()} reasons. ${breakModel.narrative} With a ${matchPercent}% skill match and a readiness score of ${readinessScore}, the plan below is designed to get you interview-ready within ${timelineLabel} with ${profile.weeklyHours || 5} hours per week of focused effort.`;
}

// ─────────────────────────────────────────────
// MAIN ANALYSIS — EXPORTED
// ─────────────────────────────────────────────
export function analyzeProfile(profile) {
  const roleKey = normalizeRole(profile.targetRole || profile.previousRole || "");
  const roleProfile = roleCatalog[roleKey];

  const userSkills = parseSkills(profile.skills);
  const matchedSkills = roleProfile.requiredSkills.filter((skill) =>
    userSkills.some((u) => u.includes(skill) || skill.includes(u)),
  );
  const missingSkills = roleProfile.requiredSkills.filter((s) => !matchedSkills.includes(s));
  const matchRatio = matchedSkills.length / roleProfile.requiredSkills.length;
  const matchPercent = Math.round(matchRatio * 100);

  // Also check nice-to-have skills (bonus only, not penalty)
  const bonusSkills = (roleProfile.niceToHave || []).filter((skill) =>
    userSkills.some((u) => u.includes(skill) || skill.includes(u)),
  );

  const readinessScore = scoreProfile(profile, matchRatio);

  // Transferables from break reason + previous role + bonus skills
  const strengthsModel = transferableStrengthsModel[profile.reasonCategory] || transferableStrengthsModel.other;
  const transferables = unique([
    ...strengthsModel.skills,
    ...(profile.previousRole ? [`domain knowledge from ${String(profile.previousRole).toLowerCase()}`, "professional judgment"] : []),
    ...(bonusSkills.length ? bonusSkills.map((s) => `familiarity with ${s}`) : []),
  ]);

  const roadmap = buildRoadmap(profile, roleProfile, missingSkills, readinessScore);
  const weeklySprint = buildWeeklySprint(profile, roleProfile, missingSkills);
  const confidencePlan = buildConfidencePlan(profile, readinessScore);
  const nudges = buildNudges(profile, readinessScore);
  const narrativeSummary = buildNarrativeSummary(profile, roleProfile, readinessScore, matchPercent);

  const matchLabel =
    matchPercent >= 75 ? "Strong fit" :
    matchPercent >= 50 ? "Good comeback runway" :
    "Refresh-and-relaunch";

  const nextMilestone =
    readinessScore >= 75
      ? "You are interview-ready. Convert momentum into applications and proof points."
      : readinessScore >= 55
      ? `Close your top 2 skill gaps (${missingSkills.slice(0, 2).join(", ") || "see plan below"}) and strengthen your comeback story.`
      : `Start the 30-day sprint: one course module per day on "${missingSkills[0] || roleProfile.requiredSkills[0]}", one resume update this week.`;

  return {
    role: roleProfile.title,
    readinessScore,
    matchPercent,
    matchLabel,
    matchedSkills,
    missingSkills,
    bonusSkills,
    transferables,
    strengthsNarrative: strengthsModel.narrative,
    industrySignals: roleProfile.industrySignals,
    roadmap,
    weeklySprint,
    confidencePlan,
    narrativeSummary,
    learningPlan: [
      ...roleProfile.courses.map((course) => ({ type: "Course", name: course })),
      ...roleProfile.certifications.map((cert) => ({ type: "Certification", name: cert })),
    ],
    opportunities: unique([
      roleProfile.title,
      ...roleProfile.adjacentRoles,
      ...roleProfile.returnships,
    ]),
    interviewPrompts: roleProfile.interviewPrompts,
    encouragement: nudges,
    salaryRange: roleProfile.salaryRange,
    demandLevel: roleProfile.demandLevel,
    nextMilestone,
  };
}

export function getPersonaById(id) {
  return samplePersonas.find((p) => p.id === id);
}

export function getRoleCatalog() {
  return roleCatalog;
}
