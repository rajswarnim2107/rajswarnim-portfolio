export const resumeData = {
  personal: {
    name: "Raj Swarnim",
    title: "Technical Architect - AI Research",
    company: "ixigo",
    location: "India",
    phone: "+91-8820218074",
    email: "rajswarnim2107@gmail.com",
    linkedin: "Raj Swarnim - ixigo | LinkedIn",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
  },
  
  synopsis: "Seasoned AI/ML Engineer with 8 years of experience in Applied AI Research & Data Science. Deep analytical expertise in designing and implementing AI/ML algorithms, including LLM-based applications. Managed and led multi-level initiatives in Personalization, Ranking, Recommendation, Chatbots and others. Built and scaled cross-functional AI teams and end-to-end processes from the ground up at ixigo. Partnered with stakeholders across product, engineering, growth, and business to align ML strategy with organizational goals.",
  
  specializations: [
    "Machine Learning",
    "Deep Learning", 
    "LLMs & RAG",
    "MLOps"
  ],
  
  stats: [
    { value: 8, label: "Years Experience", suffix: "" },
    { value: 500, label: "K+ Daily Users", suffix: "" },
    { value: 24, label: "% Booking Uplift", suffix: "" },
    { value: 100, label: "K+ Monthly Revenue", suffix: "" }
  ],
  
  experience: [
    {
      id: "ixigo",
      title: "Technical Architect - AI Research",
      company: "ixigo (Le Travenues Technology Ltd.)",
      department: "AI Products (R&D)",
      period: "Jan 2018 - Present",
      current: true,
      achievements: [
        "Led AI/ML initiatives across multiple product lines serving 50M+ users daily with end-to-end ML systems",
        "Built and scaled cross-functional AI teams and processes from the ground up, managing multi-level initiatives in Personalization, Ranking, Recommendation, and Chatbots",
        "Partnered with stakeholders across product, engineering, growth, and business to align ML strategy with organizational goals",
        "Designed and implemented AI/ML algorithms including LLM-based applications, reinforcement learning systems, and real-time prediction pipelines",
        "Managed progression from Software Engineer to Technical Architect over 7+ years, demonstrating consistent technical leadership and innovation"
      ]
    }
  ],
  
  projects: [
    {
      id: "query-retrieval",
      title: "Entity Aware Query Retrieval (Hotel Search)",
      description: "Designed and implemented a search with modular query-resolution pipeline that extracts key entities and dynamically switches between entity-first parsing and LLM-powered hybrid search. Led a full overhaul of the hotel search architecture to improve precision and relevancy for complex, multi-entity queries, serving 500K users daily.",
      icon: "search",
      metrics: [
        { icon: "users", label: "500K daily users" },
        { icon: "chart-line", label: "Improved search precision & relevancy" }
      ],
      technologies: ["LLM", "NLP", "Entity Extraction", "Search"]
    },
    {
      id: "multimodal-rag",
      title: "Multi-modal RAG for CX Agents",
      description: "Designed and implemented an assistive CX bot (using RAG) trained over thousands of SOPs. Performed context engineering from direct sources, for relevant answers to a customer. Developed a robust SOP ingestion pipeline building a complete knowledge base. Boosted response accuracy from 55% to 66% and cut chat resolution time from 17 min to ~6 min.",
      icon: "robot",
      metrics: [
        { icon: "percentage", label: "55% → 66% accuracy improvement" },
        { icon: "clock", label: "17 min → 6 min resolution time" }
      ],
      technologies: ["RAG", "LLM", "Context Engineering", "Knowledge Base"]
    },
    {
      id: "personalization-recommendation",
      title: "Personalisation & Recommendation (Hotels)",
      description: "Led a cross-sell recommendation engine using user segmentation to deliver personalized hotel suggestions. Also, a Similar-Hotel Recommender with weighted clustering and affinity propagation, surfacing alternatives based on location, amenities, and reviews. Integrated segment-aware targeting to drive cross-sell offers, lifting hotel bookings by 7% and adding ₹100K+ in monthly revenue.",
      icon: "brain",
      metrics: [
        { icon: "users", label: "Personalized recommendations" },
        { icon: "arrow-up", label: "7% booking uplift, ₹100K+ monthly revenue" }
      ],
      technologies: ["Clustering", "Affinity Propagation", "User Segmentation", "Recommendation"]
    },
    {
      id: "rl-ranking",
      title: "RL-Based Hotel Ranking & Relevance",
      description: "Built an RL-based hotel-ranking algorithm with Thompson Sampling for segment-aware personalization serving 5M users daily. Designed a realtime feedback pipeline (clicks, dwell-time, bookings) to continuously refine ranking policies on the fly. Delivered a 24% uplift in booking conversions and improved recommendation relevance via dynamic, feedback-driven personalization.",
      icon: "brain",
      metrics: [
        { icon: "users", label: "5M daily users" },
        { icon: "arrow-up", label: "24% booking conversion uplift" }
      ],
      technologies: ["Reinforcement Learning", "Thompson Sampling", "Real-time ML", "Personalization"]
    },
    {
      id: "pnr-prediction",
      title: "Classification - (Trains PNR Confirmation Prediction)",
      description: "Engineered an end to end ML-driven trains PNR confirmation service, serving 50 M+ daily requests with proper alerting monitoring with <30 ms latency per request. Built an end-to-end pipeline ingesting 1 B+ datapoints across 250+ features, optimizing memory usage for scalable training and inference. Delivered a 7% lift in waitlist conversion and boosted user trust with real-time, accurate probability predictions.",
      icon: "train",
      metrics: [
        { icon: "database", label: "50M+ daily requests, 1B+ datapoints" },
        { icon: "tachometer-alt", label: "<30ms latency, 7% conversion lift" }
      ],
      technologies: ["Classification", "Real-time ML", "Feature Engineering", "Scale"]
    },
    {
      id: "ai-agent",
      title: "Multimodal AI-Conversational Travel Agent",
      description: "Led development of a GPU-accelerated pipeline for a video-based AI agent, delivering deep-fake avatars with sub-2 s response times at scale. Integrated ControlNet diffusion models for facial movements, Wav2Lip for lip sync, GAN-based face restoration, and ElevenLabs TTS for lifelike interactions. Significantly boosted user engagement by enabling the chatbot to 'speak' via video.",
      icon: "video",
      metrics: [
        { icon: "stopwatch", label: "Sub-2s response times" },
        { icon: "chart-line", label: "Boosted user engagement" }
      ],
      technologies: ["Computer Vision", "ControlNet", "Wav2Lip", "GAN", "TTS"]
    },
    {
      id: "anomaly-detection",
      title: "Product Observability & Anomaly Detection Platform",
      description: "Designed and developed a near-real-time observability/anomaly detection system monitoring 10K+ daily business and technical metrics to detect outages. Led a cross-functional team to implement forecasting-based anomaly detection with injection validation, achieving ~94% detection accuracy and low false positives. Slashed incident triage TAT from days to minutes, mitigating downtime risks and safeguarding business continuity.",
      icon: "chart-area",
      metrics: [
        { icon: "percentage", label: "94% detection accuracy" },
        { icon: "clock", label: "Days → Minutes triage time" }
      ],
      technologies: ["Anomaly Detection", "Forecasting", "Real-time Systems", "Monitoring"]
    },
    {
      id: "cache-predictor",
      title: "Real Time Flight Search Cache Predictor",
      description: "Build a dynamic cache for Flights for better cache utilisation and to reduce price change. Contributed in building a streaming pipeline to ingest millions of flight searches and preemptively populate cache with LookAhead, ensuring fresh, relevant pricing. Applied parametric survival models to forecast user search behavior, boosting cache utilization by 32–35% and cutting P95 latency from 4 s to <1 s. Drove ~2.2 k incremental daily bookings and over ₹1 MM in daily margin uplift through timely, data-driven cache refreshes.",
      icon: "database",
      metrics: [
        { icon: "percentage", label: "32-35% cache utilization boost" },
        { icon: "tachometer-alt", label: "4s → <1s P95 latency, ₹1MM daily uplift" }
      ],
      technologies: ["Survival Models", "Cache Optimization", "Streaming", "Real-time"]
    },
    {
      id: "eta-prediction",
      title: "Forecasting ETA Prediction (Trains)",
      description: "Built an online forecasting pipeline for ~7 k trains using classical time-series models (ARIMA, Exponential Smoothing) to predict station arrival delays. Used an A/B testing framework to benchmark model performance, cutting P95 RMSE from 17 min to 9 min and MAE from 9 min to 4 min. Deployed the service for real-time inference, ensuring low-latency, high-accuracy ETA updates.",
      icon: "train",
      metrics: [
        { icon: "train", label: "7K trains monitored" },
        { icon: "chart-line", label: "P95 RMSE: 17min → 9min, MAE: 9min → 4min" }
      ],
      technologies: ["Time Series", "ARIMA", "Exponential Smoothing", "A/B Testing"]
    }
  ],
  
  skills: {
    "Programming Languages": [
      { name: "Python", level: 95 },
      { name: "SQL", level: 90 },
      { name: "R", level: 75 },
      { name: "Shell", level: 80 }
    ],
    "ML/AI Frameworks": [
      { name: "PyTorch", level: 90 },
      { name: "Scikit-Learn", level: 95 },
      { name: "Keras", level: 85 },
      { name: "LLMs & RAG", level: 85 }
    ],
    "Cloud & DevOps": [
      { name: "AWS", level: 85 },
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 75 },
      { name: "MLflow", level: 80 }
    ],
    "Data Engineering": [
      { name: "Apache Spark", level: 85 },
      { name: "Dask", level: 80 },
      { name: "Pandas", level: 95 },
      { name: "NumPy", level: 95 }
    ],
    "ML Specializations": [
      { name: "Reinforcement Learning", level: 90 },
      { name: "Time Series", level: 85 },
      { name: "Computer Vision", level: 80 },
      { name: "NLP", level: 85 }
    ],
    "Tools & Platforms": [
      { name: "Git", level: 90 },
      { name: "Prefect", level: 80 },
      { name: "Metabase", level: 75 },
      { name: "Superset", level: 75 }
    ]
  },
  
  education: [
    {
      degree: "M.Tech in Data Sciences",
      field: "Computer Science & Engineering",
      institution: "Indian Institute of Technology, Hyderabad",
      period: "Jul 2022 - Apr 2024",
      cgpa: "9.06",
      primary: true
    },
    {
      degree: "B.Tech in Computer Science",
      field: "Computer Science & Engineering",
      institution: "Institute of Engineering & Technology, Kolkata",
      period: "Jun 2013 - Jun 2017",
      cgpa: "8.85",
      primary: false
    }
  ],
  
  research: [
    {
      title: "AI-Stack Platform",
      institution: "IIT Hyderabad",
      period: "Jul 2024 - Jun 2025",
      description: "Modular cloud-native AutoML platform with Docker Swarm orchestration",
      primary: true
    },
    {
      title: "Healthcare Twitter Analysis",
      institution: "IEEE RAIT 2016 | IIT Dhanbad",
      period: "Sep 2015 - Mar 2016",
      description: "NLP techniques for health information extraction from social media",
      primary: false
    }
  ],
  
  awards: [
    {
      title: "ixigo ixi-Guru Award",
      description: "Engineering & AI Research Excellence",
      icon: "trophy"
    },
    {
      title: "ixigo Premio Award",
      description: "3x recipient for Research Excellence",
      icon: "medal"
    },
    {
      title: "Kaggle Rank 1",
      description: "ML Hackathon @ IIT Hyderabad",
      icon: "code"
    },
    {
      title: "Cricket Championship",
      description: "State Level - First Position",
      icon: "star"
    }
  ]
};
