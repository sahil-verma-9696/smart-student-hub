export const CSV_STUDENT_COLUMNS = [
  'name',
  'email',
  'phone',
  'branch',
  'year',
] as const;

export type CsvStudentRow = Record<
  (typeof CSV_STUDENT_COLUMNS)[number],
  string
>;

export const CSV_FIELD_MAP = {
  name: { csv: 'name', required: true },
  email: { csv: 'email', required: true },
  password: { csv: 'password', required: true },
  gender: { csv: 'gender', required: false },
  instituteId: { csv: 'instituteId', required: true },

  // contactInfo fields
  phone: { csv: 'phone', required: true },
  alternatePhone: { csv: 'alternatePhone', required: false },
  address: { csv: 'address', required: false },

  // In future, you can add more:
  // rollNo: { csv: 'roll_no', required: false },
  department: { csv: 'Department', required: false },
  backlogs: { csv: 'Backlogs', required: false }, // 🔥 NEW
};

export const MOCK_STUDENT_DATA = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 9876543210',
  linkedin: 'https://www.linkedin.com/in/aarav-sharma',
  github: 'https://github.com/aaravsharma',
  projects: [
    'Smart Attendance System using Face Recognition',
    'Realtime Collaborative Code Editor',
    'E-commerce Platform with Role-based Access',
  ],
  achievements: [
    'Top 10 finalist at HackRush 2024',
    'Won Best UI Award at DevSphere 2023',
    'Built a 10k+ downloads productivity Chrome extension',
  ],
  skills: [
    'React',
    'Next.js',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Docker',
    'TailwindCSS',
  ],
  certificates: [
    {
      path: '/uploads/certificates/cloud-fundamentals.pdf',
      type: 'pdf',
    },
    {
      path: '/uploads/certificates/react-essentials.png',
      type: 'image',
    },
  ],
  education: [
    'B.Tech in Computer Science - Delhi Institute of Technology (2022–2026)',
    'CBSE Class XII - Science (PCM)',
  ],
  work_experience: [
    'Frontend Intern at CodeWave Labs (May 2024 – Aug 2024)',
    'Open Source Contributor at Mozilla (Remote)',
  ],
};


export const mindPioletData = {
  profile: {
    name: 'Harsh Vardhan',
    age: 21,
    education: 'B.Tech CSE 3rd Year',
    skills: ['Cybersecurity', 'Kali Linux', 'Networking'],
    interests: ['Ethical Hacking', 'Security'],
  },
  achievements: [
    {
      title: 'CEH Certified',
      description: 'Certified Ethical Hacker',
      date: '2024-11-02',
    },
  ],
  projects: [
    {
      name: 'Vulnerability Scanner',
      description: 'Network vulnerability detection tool',
      techStack: ['Python', 'Nmap'],
      date: '2024-11-18',
    },
  ],
};
