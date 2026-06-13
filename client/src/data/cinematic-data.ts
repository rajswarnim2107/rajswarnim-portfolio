/**
 * Curated content for the cinematic experience — the headline narrative,
 * distilled from resume-data.ts and ordered for storytelling.
 */

export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Render with decimals (e.g. 0.5 → "0.5") */
  decimals?: number;
}

export type VizType =
  | 'tokens' // flowing search tokens
  | 'rag' // document chunks converging to an answer
  | 'heatmap' // ranking heatmap reshuffling
  | 'matrix' // dense feature matrix / classification
  | 'avatar' // wireframe face mesh
  | 'stream' // streaming latency graph
  | 'pulse'; // anomaly spikes on a metric line

export interface CaseStudy {
  id: string;
  index: string; // "01".."07" mono label
  title: string;
  hook: string; // one-line cinematic hook
  description: string;
  metrics: Metric[];
  tags: string[];
  viz: VizType;
  accent: string; // hex accent for glow/borders
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'query-retrieval',
    index: '01',
    title: 'Entity-Aware Query Retrieval',
    hook: 'Teaching hotel search to read between the lines.',
    description:
      'A modular query-resolution pipeline that extracts key entities and dynamically switches between entity-first parsing and LLM-powered hybrid search — a full overhaul of hotel search architecture for complex, multi-entity queries.',
    metrics: [
      { value: 500, suffix: 'K', label: 'daily users' },
      { value: 100, suffix: '%', label: 'search architecture overhauled' },
    ],
    tags: ['LLM', 'NLP', 'Entity Extraction', 'Search'],
    viz: 'tokens',
    accent: '#a855f7',
  },
  {
    id: 'multimodal-rag',
    index: '02',
    title: 'Multi-modal RAG for CX Agents',
    hook: 'Thousands of SOPs, one instant answer.',
    description:
      'An assistive CX bot built on RAG over thousands of SOPs, with context engineering from direct sources and a robust ingestion pipeline forming a complete knowledge base.',
    metrics: [
      { value: 66, suffix: '%', label: 'accuracy — up from 55%' },
      { value: 6, prefix: '~', suffix: ' min', label: 'resolution — down from 17 min' },
    ],
    tags: ['RAG', 'LLM', 'Context Engineering'],
    viz: 'rag',
    accent: '#3b82f6',
  },
  {
    id: 'rl-ranking',
    index: '03',
    title: 'RL-Based Hotel Ranking',
    hook: 'A ranking policy that learns from every click.',
    description:
      'Thompson Sampling for segment-aware personalization with a real-time feedback pipeline — clicks, dwell-time, bookings — continuously refining ranking policies on the fly.',
    metrics: [
      { value: 5, suffix: 'M', label: 'daily users' },
      { value: 24, suffix: '%', label: 'booking conversion uplift' },
    ],
    tags: ['Reinforcement Learning', 'Real-time ML'],
    viz: 'heatmap',
    accent: '#4facfe',
  },
  {
    id: 'pnr-prediction',
    index: '04',
    title: 'PNR Confirmation Prediction',
    hook: 'A billion datapoints, answered in 30 milliseconds.',
    description:
      'An end-to-end ML-driven train PNR confirmation service — a pipeline ingesting 1B+ datapoints across 250+ features, memory-optimized for scalable training and real-time inference.',
    metrics: [
      { value: 50, suffix: 'M+', label: 'daily requests' },
      { value: 30, prefix: '<', suffix: ' ms', label: 'latency per request' },
    ],
    tags: ['Classification', 'Scale', 'Feature Engineering'],
    viz: 'matrix',
    accent: '#f093fb',
  },
  {
    id: 'ai-agent',
    index: '05',
    title: 'Multimodal Conversational Agent',
    hook: 'An AI travel agent with a face and a voice.',
    description:
      'A GPU-accelerated pipeline for a video-based AI agent — ControlNet diffusion for facial movement, Wav2Lip for lip sync, GAN face restoration, and ElevenLabs TTS for lifelike interaction.',
    metrics: [
      { value: 2, prefix: '<', suffix: ' s', label: 'response time at scale' },
      { value: 4, label: 'generative models in one pipeline' },
    ],
    tags: ['Computer Vision', 'Diffusion', 'TTS'],
    viz: 'avatar',
    accent: '#a855f7',
  },
  {
    id: 'cache-predictor',
    index: '06',
    title: 'Real-Time Flight Cache Predictor',
    hook: 'Predicting searches before they happen.',
    description:
      'Parametric survival models forecasting user search behavior over a streaming pipeline of millions of flight searches, pre-emptively populating cache with fresh, relevant pricing.',
    metrics: [
      { value: 35, suffix: '%', label: 'cache utilization boost' },
      { value: 1, prefix: '₹', suffix: 'MM', label: 'daily margin uplift · P95 4s → <1s' },
    ],
    tags: ['Survival Models', 'Streaming'],
    viz: 'stream',
    accent: '#4facfe',
  },
  {
    id: 'anomaly-detection',
    index: '07',
    title: 'Anomaly Detection Platform',
    hook: 'Ten thousand metrics, watched in real time.',
    description:
      'A near-real-time observability platform monitoring 10K+ business and technical metrics with forecasting-based detection and injection validation — incident triage cut from days to minutes.',
    metrics: [
      { value: 94, suffix: '%', label: 'detection accuracy' },
      { value: 10, suffix: 'K+', label: 'metrics monitored daily' },
    ],
    tags: ['Forecasting', 'Real-time Systems'],
    viz: 'pulse',
    accent: '#3b82f6',
  },
];

export const HERO = {
  greeting: 'Hello(); // I am',
  name: 'Raj Swarnim',
  title: 'Technical Architect — AI Research @ ixigo',
  tagline: 'I design & code AI/ML systems that serve millions daily.',
  chips: [
    { value: 50, suffix: 'M+', label: 'daily users' },
    { value: 24, suffix: '%', label: 'conversion uplift' },
    { value: 8, suffix: ' yrs', label: 'applied AI' },
    { value: 1, prefix: '₹', suffix: 'MM+', label: 'daily margin impact' },
  ] as Metric[],
};

export const ABOUT = {
  heading: 'The Architect',
  bio: 'Seasoned AI/ML Engineer with 8 years in Applied AI Research & Data Science. I design and ship LLM-based applications, recommendation and ranking systems, reinforcement learning, and real-time ML at scale — and I built and scaled cross-functional AI teams from the ground up.',
  education: [
    {
      degree: 'M.Tech in Data Sciences',
      school: 'IIT Hyderabad',
      detail: 'CGPA 9.06',
    },
    { degree: 'B.Tech in Computer Science', school: 'IET Kolkata', detail: 'CGPA 8.85' },
  ],
};

export interface SkillCluster {
  id: string;
  label: string;
  accent: string;
  skills: { name: string; level: number }[];
}

export const SKILL_CLUSTERS: SkillCluster[] = [
  {
    id: 'core',
    label: 'Core Engineering',
    accent: '#3b82f6',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'SQL', level: 90 },
      { name: 'Apache Spark', level: 85 },
    ],
  },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    accent: '#a855f7',
    skills: [
      { name: 'PyTorch', level: 90 },
      { name: 'LLMs & RAG', level: 85 },
      { name: 'NLP', level: 85 },
      { name: 'Computer Vision', level: 80 },
    ],
  },
  {
    id: 'ml-systems',
    label: 'ML Systems',
    accent: '#4facfe',
    skills: [
      { name: 'Reinforcement Learning', level: 90 },
      { name: 'Time Series', level: 85 },
      { name: 'Real-time ML', level: 90 },
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps & Infra',
    accent: '#f093fb',
    skills: [
      { name: 'AWS', level: 85 },
      { name: 'Kubernetes', level: 75 },
      { name: 'Docker', level: 90 },
      { name: 'MLflow', level: 80 },
    ],
  },
];

export const SCALE_STATS: Metric[] = [
  { value: 50, suffix: 'M+', label: 'daily users served' },
  { value: 1, suffix: 'B+', label: 'datapoints in one pipeline' },
  { value: 30, prefix: '<', suffix: 'ms', label: 'inference latency' },
  { value: 1, prefix: '₹', suffix: 'MM+', label: 'daily margin impact' },
];

export interface JourneyNode {
  year: string;
  title: string;
  org: string;
  detail: string;
}

export const JOURNEY: JourneyNode[] = [
  {
    year: '2013–2017',
    title: 'B.Tech, Computer Science',
    org: 'IET Kolkata',
    detail: 'CGPA 8.85 — where the obsession with systems began.',
  },
  {
    year: '2018',
    title: 'Software Engineer → AI Products (R&D)',
    org: 'ixigo',
    detail: 'Joined the AI research group; first production ML systems.',
  },
  {
    year: '2020',
    title: 'Senior ML Engineer',
    org: 'ixigo',
    detail: 'Shipped real-time prediction at 50M+ requests/day scale.',
  },
  {
    year: '2022–2024',
    title: 'M.Tech in Data Sciences',
    org: 'IIT Hyderabad',
    detail: 'CGPA 9.06 — research in cloud-native AutoML platforms.',
  },
  {
    year: 'Present',
    title: 'Technical Architect — AI Research',
    org: 'ixigo',
    detail: 'Building and scaling cross-functional AI teams from the ground up.',
  },
];

export const AWARDS = [
  { title: 'ixi-Guru Award', detail: 'Engineering & AI Research Excellence' },
  { title: 'Premio Award ×3', detail: 'Three-time recipient, Research Excellence' },
  { title: 'Kaggle Rank 1', detail: 'ML Hackathon @ IIT Hyderabad' },
];

export const CONTACT = {
  heading: "Let's Build",
  line: 'Open to conversations about applied AI, ML platforms, and systems that think.',
  email: 'rajswarnim2107@gmail.com',
  linkedin: 'https://www.linkedin.com/in/raj-swarnim',
  github: 'https://github.com/rajswarnim2107',
};
