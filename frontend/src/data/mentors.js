// Static fallback data — used when API is unreachable
const mentors = [
  {
    _id: "1",
    name: "Ahmed Khan",
    role: "Senior Software Engineer",
    avatar: "AK",
    avatarBg: "#e07a5f",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "System Design"],
    rating: 4.9,
    sessions: 127,
    bio: "I'm a Senior Software Engineer with 7+ years of experience building scalable web applications. I've worked at both startups and large tech companies, and I specialize in the MERN stack. I love helping students break into tech, prepare for technical interviews, and build impressive portfolio projects.",
    university: "NUST Islamabad",
    major: "Computer Science",
    gradYear: 2018,
    videoId: "dQw4w9WgXcQ",
    reviews: [
      { name: "Fatima R.", text: "Ahmed helped me prepare for my first internship interview. His guidance on system design was exactly what I needed. I got the offer!", stars: 5 },
      { name: "Bilal K.", text: "Great mentor who explains complex concepts in simple terms. Helped me understand React hooks properly.", stars: 5 },
      { name: "Ayesha M.", text: "Very patient and knowledgeable. Our sessions on MongoDB aggregation pipelines were incredibly helpful.", stars: 4 },
    ],
    price: "Free",
  },
  {
    _id: "2",
    name: "Sana Tariq",
    role: "Data Scientist & ML Engineer",
    avatar: "ST",
    avatarBg: "#3d405b",
    skills: ["Python", "Machine Learning", "Data Science", "TensorFlow", "SQL"],
    rating: 4.8,
    sessions: 89,
    bio: "I'm a Data Scientist working at a leading AI company. I hold a Master's in Data Science and have experience mentoring students in Python, machine learning, and data analysis. Whether you're working on your FYP, preparing for a data science role, or just want to understand ML concepts better, I'm here to help.",
    university: "LUMS Lahore",
    major: "Data Science",
    gradYear: 2019,
    videoId: "dQw4w9WgXcQ",
    reviews: [
      { name: "Hassan A.", text: "Sana made machine learning feel approachable. Her explanations of neural networks were the clearest I've ever heard.", stars: 5 },
      { name: "Zara N.", text: "She reviewed my FYP code and gave me actionable feedback that improved my project significantly.", stars: 5 },
    ],
    price: "Free",
  },
  {
    _id: "3",
    name: "Usman Rafiq",
    role: "Full-Stack Developer & Startup Founder",
    avatar: "UR",
    avatarBg: "#81b29a",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "Startup", "AWS"],
    rating: 4.7,
    sessions: 56,
    bio: "I'm a full-stack developer who built and sold my first SaaS product while still in university. I've been through the journey from learning to code to building products that real people use. I mentor students on full-stack development, launching MVPs, and navigating the tech startup ecosystem.",
    university: "FAST Islamabad",
    major: "Software Engineering",
    gradYear: 2020,
    videoId: "dQw4w9WgXcQ",
    reviews: [
      { name: "Kamran S.", text: "Usman is an inspiring mentor. He helped me go from knowing basic HTML/CSS to building a full-stack app in 2 months.", stars: 5 },
      { name: "Nadia Z.", text: "His advice on launching side projects was practical and motivating. Highly recommend for aspiring founders.", stars: 4 },
    ],
    price: "Free",
  },
  {
    _id: "4",
    name: "Zawar Ali Khan ",
    role: "Academic Researcher & Career Coach",
    avatar: "AR",
    avatarBg: "#f2cc8f",
    skills: ["Research", "Academic Writing", "Career Coaching", "Scholarships", "Python"],
    rating: 4,
    sessions: 20,
    bio: "I hold a bachelors degree in Computer Science and have published research in top-tier conferences. I've helped 200+ students with research proposals, thesis writing, scholarship applications, and career planning. If you're considering graduate studies (MS/PhD) abroad or preparing for a research career, I can help you navigate the process.",
    university: "AWKUM",
    major: "Computer Science (BCS)",
    gradYear: 2026,
    videoId: "dQw4w9WgXcQ",
    reviews: [
      { name: "Rabia H.", text: "Dr. Ayesha reviewed my Fulbright scholarship essays and her feedback was invaluable. I got the scholarship!", stars: 5 },
      { name: "Danish M.", text: "Her guidance on structuring my research proposal made a huge difference. She knows exactly what admissions committees look for.", stars: 5 },
      { name: "Saba K.", text: "Very professional and thorough. Helped me understand how to write a strong literature review for my thesis.", stars: 5 },
    ],
    price: "Free",
  },

  
];

// Extract all unique skills from mentors
export const allSkills = [
  ...new Set(mentors.flatMap((m) => m.skills)),
].sort();

export default mentors;
