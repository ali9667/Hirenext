require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const SeekerProfile = require('./models/SeekerProfile');
const Job = require('./models/Job');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hirenext');
  await Promise.all([Job.deleteMany(), Company.deleteMany(), SeekerProfile.deleteMany(), User.deleteMany()]);

  const companyUser = await User.create({ email: 'demo@techcorp.in', password: 'Demo1234!', full_name: 'TechCorp HR', userType: 'company' });
  const company = await Company.create({
    owner_id: companyUser._id, company_name: 'TechCorp Solutions', is_verified: true, is_hiring: true,
    tagline: 'Building enterprise software at scale', industry_type: 'Software & IT', team_size: '201–500',
    location: 'Bengaluru, Karnataka', company_website: 'https://techcorp.in',
    about_company: 'TechCorp Solutions builds cloud-based workflow automation for 2,000+ enterprise clients. Series B, backed by Sequoia & Lightspeed.',
    headquarter_mail_id: 'careers@techcorp.in', headquarter_phone_no: '+91-80-41234567',
    social_links: { linkedin: 'linkedin.com/company/techcorp-solutions' }
  });

  const seekerUser = await User.create({ email: 'rahul@example.com', password: 'Demo1234!', full_name: 'Rahul Sharma', userType: 'seeker' });
  await SeekerProfile.create({
    user_id: seekerUser._id, headline: 'Full Stack Developer · React & Node.js · 3 YOE', open_to_work: true,
    bio: 'I build fast, accessible web apps. Currently leading frontend at StartupXYZ. Looking for my next senior IC role.', location: 'Mumbai',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    experience_level: 'mid', expected_salary: '25–35 LPA', notice_period: '30 days',
    social_links: { github: 'github.com/rahulsharma', linkedin: 'linkedin.com/in/rahulsharma' },
    experience: [{ company: 'StartupXYZ', title: 'Frontend Lead', start_date: new Date('2022-01-01'), current: true, description: 'Leading frontend for a 50K-user SaaS product.' }],
    education: [{ institution: 'Mumbai University', degree: 'B.E.', field: 'Computer Engineering', start_year: 2017, end_year: 2021 }]
  });

  // Other companies
  const otherCompanies = [];
  const defs = [
    { name: 'Razorpay', industry: 'Fintech', size: '2,001–5,000', loc: 'Bengaluru', verified: true },
    { name: 'Zepto', industry: 'Quick Commerce', size: '1,001–2,000', loc: 'Mumbai', verified: true },
    { name: 'CRED', industry: 'Fintech', size: '1,001–2,000', loc: 'Bengaluru', verified: true },
    { name: 'Groww', industry: 'Fintech', size: '1,001–2,000', loc: 'Bengaluru', verified: true },
    { name: 'BrowserStack', industry: 'SaaS', size: '501–1,000', loc: 'Mumbai', verified: true },
  ];
  for (const d of defs) {
    const u = await User.create({ email: `hr@${d.name.toLowerCase().replace(/\s/g,'')}.com`, password: 'Demo1234!', full_name: `${d.name} HR`, userType: 'company' });
    const c = await Company.create({ owner_id: u._id, company_name: d.name, industry_type: d.industry, team_size: d.size, location: d.loc, is_verified: d.verified, is_hiring: true, about_company: `${d.name} is one of India's most innovative technology companies.`, headquarter_mail_id: `hr@${d.name.toLowerCase()}.com`, company_website: `https://${d.name.toLowerCase()}.com` });
    otherCompanies.push({ company: c, user: u });
  }

  const allCompanies = [{ company, user: companyUser }, ...otherCompanies];

  const jobs = [
    { ci: 0, title: 'Senior React Developer', desc: 'Join our core product team. You\'ll architect complex React apps for 50,000+ enterprise users, own the frontend infrastructure, and mentor junior engineers. High ownership, fast ships.', req: ['4+ years React', 'TypeScript expert', 'Redux/Zustand', 'Design systems experience'], resp: ['Build features end-to-end', 'Improve performance', 'Code reviews & mentoring'], skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], level: 'senior', type: 'hybrid', loc: 'Bengaluru', smin: 2500000, smax: 4000000, open: 2, feat: true, urg: false },
    { ci: 1, title: 'Senior Backend Engineer', desc: 'Scale payment infrastructure processing ₹100Cr+ daily. Design distributed systems, optimise DB performance, own critical API services serving 8M+ businesses.', req: ['4+ years backend', 'Node.js or Go', 'PostgreSQL + Redis', 'High-throughput systems'], resp: ['Design and build APIs', 'DB optimisation', 'Incident ownership'], skills: ['Node.js', 'PostgreSQL', 'Redis', 'Kubernetes'], level: 'senior', type: 'hybrid', loc: 'Bengaluru', smin: 3000000, smax: 5000000, open: 3, feat: true, urg: true },
    { ci: 2, title: 'Product Manager — Consumer', desc: 'Own key metrics for Zepto\'s consumer app. Define roadmap, run A/B tests, partner with engineering and design. Directly influence 2Cr+ monthly orders.', req: ['3+ years PM', 'Strong SQL', 'A/B testing at scale', 'Consumer apps background'], resp: ['Own product roadmap', 'Run experiments', 'Define success metrics'], skills: ['SQL', 'Analytics', 'Jira', 'Figma'], level: 'senior', type: 'full-time', loc: 'Mumbai', smin: 2800000, smax: 4500000, open: 1, feat: false, urg: true },
    { ci: 3, title: 'Product Designer', desc: 'Design for 13M+ premium CRED members. Obsessive craft standards. Own flows from first pixel to production. Work closely with engineers who care about design.', req: ['3+ years product design', 'Figma expert', 'Shipped consumer products', 'Motion design a plus'], resp: ['Own end-to-end design', 'Maintain design system', 'User research'], skills: ['Figma', 'Prototyping', 'Motion Design', 'Design Systems'], level: 'mid', type: 'remote', loc: 'Remote', smin: 1800000, smax: 3000000, open: 2, feat: false, urg: false },
    { ci: 4, title: 'DevOps / SRE Engineer', desc: 'Run infrastructure for 10M+ investor portfolios. Zero downtime is non-negotiable — you\'re handling people\'s money. 99.99% uptime target. Modern cloud-native stack.', req: ['3+ years DevOps/SRE', 'AWS or GCP', 'Kubernetes at scale', 'Terraform/Ansible'], resp: ['Manage cloud infra', 'Improve deploy velocity', 'On-call rotation'], skills: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus'], level: 'senior', type: 'remote', loc: 'Remote', smin: 2500000, smax: 4200000, open: 2, feat: true, urg: false },
    { ci: 5, title: 'Full Stack Engineer', desc: 'Build features used by Apple, Twitter, and 50,000 companies to test their software. BrowserStack engineering is world-class — you\'ll be surrounded by people who raise your bar.', req: ['3+ years full stack', 'React + backend', 'PostgreSQL or MySQL', 'AWS or GCP'], resp: ['Build platform features', 'Own code quality', 'Collaborate globally'], skills: ['React', 'Ruby on Rails', 'PostgreSQL', 'AWS'], level: 'mid', type: 'hybrid', loc: 'Mumbai', smin: 2200000, smax: 3800000, open: 4, feat: false, urg: false },
    { ci: 0, title: 'Data Scientist', desc: 'Build ML models that personalise our workflow automation platform for 2,000+ enterprise clients. Own the full ML lifecycle — from data to deployed model to production monitoring.', req: ['2+ years ML/Data Science', 'Python & ML frameworks', 'SQL proficiency', 'Production ML experience'], resp: ['Build recommendation models', 'A/B testing infrastructure', 'Feature engineering'], skills: ['Python', 'TensorFlow', 'SQL', 'Spark'], level: 'mid', type: 'hybrid', loc: 'Bengaluru', smin: 2000000, smax: 3500000, open: 2, feat: false, urg: false },
    { ci: 1, title: 'Android Developer', desc: 'Build the Razorpay merchant app used by 8M+ businesses. You\'ll own features from spec to production on a platform that directly enables India\'s entrepreneurs.', req: ['2+ years Android/Kotlin', 'Jetpack Compose', 'REST API integration', 'Performance profiling'], resp: ['Build merchant-facing features', 'Improve app performance', 'Work with payment APIs'], skills: ['Kotlin', 'Jetpack Compose', 'Retrofit', 'Coroutines'], level: 'mid', type: 'full-time', loc: 'Bengaluru', smin: 1800000, smax: 3000000, open: 3, feat: false, urg: true },
    { ci: 2, title: 'Data Analyst', desc: 'Turn operational data into decisions at Zepto. Build dashboards, run ad-hoc analysis, partner with ops to cut delivery time. Your work directly impacts 10-minute delivery SLAs.', req: ['1+ year analyst experience', 'Advanced SQL', 'Python or R', 'Tableau or Looker'], resp: ['Build and maintain dashboards', 'Ad-hoc analysis', 'Present to leadership'], skills: ['SQL', 'Python', 'Tableau', 'Statistics'], level: 'junior', type: 'full-time', loc: 'Mumbai', smin: 900000, smax: 1600000, open: 5, feat: false, urg: false },
    { ci: 3, title: 'Backend Engineer (Go)', desc: 'Build high-throughput financial APIs at CRED for 13M premium users. Correctness and performance are everything here — you\'re touching real financial data.', req: ['2+ years Go', 'Distributed systems', 'PostgreSQL', 'High-availability systems'], resp: ['Design financial APIs', 'Optimise for performance', 'Own service reliability'], skills: ['Go', 'PostgreSQL', 'Redis', 'gRPC'], level: 'mid', type: 'full-time', loc: 'Bengaluru', smin: 2200000, smax: 3800000, open: 3, feat: false, urg: false },
    { ci: 4, title: 'Frontend Engineer', desc: 'Build Groww\'s investment app UI for 10M+ users. Every pixel matters — this is what people see when managing their savings. High craft bar, zero shortcuts.', req: ['2+ years React', 'TypeScript', 'Performance optimization', 'Accessibility standards'], resp: ['Build investment flows', 'Improve Core Web Vitals', 'Work with design system'], skills: ['React', 'TypeScript', 'Redux', 'CSS'], level: 'mid', type: 'hybrid', loc: 'Bengaluru', smin: 1800000, smax: 3000000, open: 2, feat: false, urg: false },
    { ci: 5, title: 'Solutions Engineer', desc: 'Help 50,000 companies adopt BrowserStack. Technical bridge between sales and engineering. Run POCs, onboard enterprise clients, solve complex integration challenges.', req: ['2+ years SE or technical sales', 'Software testing knowledge', 'Client-facing experience', 'Any scripting language'], resp: ['Run technical demos', 'Build POCs', 'Onboard enterprise clients'], skills: ['Selenium', 'APIs', 'JavaScript', 'Communication'], level: 'junior', type: 'full-time', loc: 'Mumbai', smin: 1200000, smax: 2000000, open: 6, feat: false, urg: false },
  ];

  for (const j of jobs) {
    const { company: co, user: u } = allCompanies[j.ci % allCompanies.length];
    await Job.create({
      company_id: co._id, posted_by: u._id,
      title: j.title, description: j.desc, requirements: j.req, responsibilities: j.resp, skills_required: j.skills,
      experience_level: j.level, job_type: j.type, location: j.loc,
      salary_min: j.smin, salary_max: j.smax, salary_visible: true,
      openings: j.open, is_featured: j.feat, is_urgent: j.urg, status: 'active',
      total_applications: Math.floor(Math.random() * 180) + 10,
      views: Math.floor(Math.random() * 900) + 100,
    });
  }

  console.log('\n✅  Done\n');
  console.log('  👤  Seeker:   rahul@example.com   /  Demo1234!');
  console.log('  🏢  Company:  demo@techcorp.in    /  Demo1234!\n');
  process.exit(0);
};

run().catch(e => { console.error(e.message); process.exit(1); });
