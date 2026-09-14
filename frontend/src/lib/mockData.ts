export const mockPortfolioData = {
  personalInfo: {
    name: 'Alex Developer',
    role: 'Full Stack Engineer',
    bio: 'Passionate about building scalable web applications and intuitive user experiences.',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexdev',
    github: 'https://github.com/alexdev',
  },
  education: [
    {
      institution: 'State University',
      degree: 'B.S. Computer Science',
      startDate: 'Aug 2016',
      endDate: 'May 2020',
      location: 'City, State',
      gpa: '3.8',
    }
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Tech Innovators Inc.',
      startDate: 'Jun 2020',
      endDate: 'Present',
      location: 'Remote',
      bullets: [
        'Architected and deployed microservices using Node.js and Docker.',
        'Improved frontend performance by 40% through React code splitting.',
      ]
    }
  ],
  projects: [
    {
      name: 'E-commerce Dashboard',
      description: 'A comprehensive analytics dashboard for online retailers.',
      techStack: ['React', 'TypeScript', 'Tailwind'],
      links: { github: 'https://github.com', live: 'https://example.com' }
    }
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'PostgreSQL', 'Docker']
    }
  ],
  achievements: [
    'AWS Certified Solutions Architect',
    'Open Source Contributor to React Router'
  ]
};
