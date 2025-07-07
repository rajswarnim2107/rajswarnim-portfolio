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
      id: "current",
      title: "Technical Architect - AI Research",
      company: "ixigo (Le Travenues Technology Ltd.)",
      department: "AI Products (R&D)",
      period: "Apr 2025 - Present",
      current: true,
      achievements: [
        "Designed Entity Aware Query Retrieval system serving 500K users daily",
        "Implemented Multi-modal RAG for CX agents, boosting accuracy from 55% to 66%",
        "Led personalization engine adding ₹100K+ monthly revenue"
      ]
    },
    {
      id: "principal",
      title: "Principal Research Engineer (AI)",
      company: "ixigo (Le Travenues Technology Ltd.)",
      department: "Research & Data Science",
      period: "Apr 2021 - Mar 2025",
      current: false,
      achievements: [
        "Built RL-based hotel ranking serving 5M users, 24% booking uplift",
        "Developed multimodal AI conversational agent with sub-2s response times",
        "Engineered ML-driven PNR confirmation service for 50M+ daily requests"
      ]
    },
    {
      id: "senior",
      title: "Senior Research Engineer (AI)",
      company: "ixigo (Le Travenues Technology Ltd.)",
      department: "Research & Data Science",
      period: "Apr 2019 - Mar 2021",
      current: false,
      achievements: [
        "Designed anomaly detection system monitoring 10K+ daily metrics",
        "Built dynamic flight cache system, boosting utilization by 32-35%",
        "Delivered ₹1MM daily margin uplift through intelligent caching"
      ]
    },
    {
      id: "engineer",
      title: "Software Engineer (AI)",
      company: "ixigo (Le Travenues Technology Ltd.)",
      department: "Research & Data Science",
      period: "Jan 2018 - Mar 2019",
      current: false,
      achievements: [
        "Built ETA prediction pipeline for 7K trains using time-series models",
        "Reduced P95 RMSE from 17 min to 9 min through A/B testing"
      ]
    }
  ],
  
  projects: [
    {
      id: "query-retrieval",
      title: "Entity Aware Query Retrieval",
      description: "Modular search pipeline with dynamic entity extraction and LLM-powered hybrid search for hotel discovery.",
      icon: "search",
      metrics: [
        { icon: "users", label: "500K daily users" },
        { icon: "chart-line", label: "Improved search precision & relevancy" }
      ],
      technologies: ["LLM", "NLP", "Search"]
    },
    {
      id: "multimodal-rag",
      title: "Multi-modal RAG for CX",
      description: "Assistive customer service bot with RAG architecture trained on thousands of SOPs.",
      icon: "robot",
      metrics: [
        { icon: "percentage", label: "55% → 66% accuracy improvement" },
        { icon: "clock", label: "17 min → 6 min resolution time" }
      ],
      technologies: ["RAG", "LLM", "CX"]
    },
    {
      id: "rl-ranking",
      title: "RL-Based Hotel Ranking",
      description: "Reinforcement learning algorithm with Thompson Sampling for personalized hotel recommendations.",
      icon: "brain",
      metrics: [
        { icon: "users", label: "5M daily users" },
        { icon: "arrow-up", label: "24% booking conversion uplift" }
      ],
      technologies: ["RL", "Personalization", "Ranking"]
    },
    {
      id: "ai-agent",
      title: "AI Conversational Agent",
      description: "GPU-accelerated video-based AI agent with deep-fake avatars and real-time lip sync.",
      icon: "video",
      metrics: [
        { icon: "stopwatch", label: "Sub-2s response times" },
        { icon: "chart-line", label: "Boosted user engagement" }
      ],
      technologies: ["Computer Vision", "GAN", "TTS"]
    },
    {
      id: "pnr-prediction",
      title: "PNR Confirmation Prediction",
      description: "End-to-end ML pipeline for train PNR confirmation with real-time probability predictions.",
      icon: "train",
      metrics: [
        { icon: "database", label: "50M+ daily requests" },
        { icon: "tachometer-alt", label: "<30ms latency" }
      ],
      technologies: ["Classification", "Real-time", "Scale"]
    },
    {
      id: "anomaly-detection",
      title: "Anomaly Detection Platform",
      description: "Real-time observability system monitoring 10K+ daily metrics with 94% detection accuracy.",
      icon: "chart-area",
      metrics: [
        { icon: "percentage", label: "94% detection accuracy" },
        { icon: "clock", label: "Days → Minutes triage time" }
      ],
      technologies: ["Anomaly Detection", "Monitoring", "Real-time"]
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
