/* ═══════════════════════════════════════════
   DATA  —  Single source of truth
   Edit this file to update any content on the site.

   NOTE: Some entries below carry a `visible: false` flag. These are
   placeholders ("Coming soon" certs, empty timeline slots, a blank
   testimonial) that aren't ready to show visitors yet — the render
   functions in views/certs.js and views/sidebar.js filter these out
   automatically. Flip `visible` to `true` (or just delete the flag)
   once the real content is ready.
   ═══════════════════════════════════════════ */

/* ── Tech Stack ─────────────────────────────────────────────── */
export const techStack = {
  preview: [
    {
      label: 'Frontend',
      tags: [
        { name: 'React',           accent: true  },
        { name: 'Next.js',         accent: true  },
        { name: 'TypeScript',      accent: false },
        { name: 'Tailwind CSS',    accent: false },
        { name: 'Framer Motion',   accent: false },
      ],
    },
    {
      label: 'Backend',
      tags: [
        { name: 'Node.js',         accent: true  },
        { name: 'PHP',             accent: false },
        { name: 'MySQL',           accent: false },
        { name: 'MongoDB',         accent: false },
        { name: 'Firebase',        accent: false },
      ],
    },
    {
      label: 'DevOps & Deployment',
      tags: [
        { name: 'Git',             accent: false },
        { name: 'GitHub',          accent: false },
        { name: 'GitHub Actions',  accent: false },
        { name: 'Vercel',          accent: false },
        { name: 'Render',          accent: false },
      ],
    },
  ],

  full: [
  {
    label: 'Frontend',
    tags: [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'TSX', 'JSON',
      'React', 'Next.js', 'Tailwind CSS', 'Bootstrap',
      'Framer Motion', 'Zustand', 'Vite', 'Phaser.js', 'MindAR',
    ],
  },
  {
    label: 'Backend',
    tags: [
      'Node.js', 'PHP', 'FastAPI',
      'MySQL', 'MongoDB', 'Firebase',
      'Supabase', 'Neon PostgreSQL',
    ],
  },
  {
    label: 'Programming Languages',
    tags: [
      'C', 'C++', 'C#', 'Java',
      'JavaScript', 'TypeScript',
      'Python', 'PHP',
    ],
  },
  {
    label: 'Machine Learning & AI',
    tags: [
      'Pandas', 'NumPy', 'scikit-learn',
      'XGBoost', 'TensorFlow', 'PyTorch',
    ],
  },
  {
    label: 'Authentication & Security',
    tags: [
      'JWT',
      'FastAPI Users',
      'Supabase Auth',
    ],
  },
  {
    label: 'Databases & Storage',
    tags: [
      'MySQL', 'MongoDB', 'Firebase',
      'Supabase', 'Neon PostgreSQL',
      'Cloudinary', 'Supabase Storage',
    ],
  },
  {
    label: 'DevOps & Deployment',
    tags: [
      'Git', 'GitHub', 'GitHub Actions',
      'Vercel', 'Netlify',
      'Railway', 'Render', 'Fly.io',
    ],
  },
  {
    label: 'Development Tools & IDEs',
    tags: [
      'Visual Studio Code',
      'Visual Studio 2022',
      'Antigravity',
      'Cursor',
      'Android Studio',
      'Google AI Studio',
      'Eclipse', 'NetBeans',
      'Dev-C++',
      'Unity Hub',
      'Unreal Engine',
    ],
  },
  {
    label: 'Design & Creative Tools',
    tags: [
      'Figma',
      'Adobe Illustrator',
      'Adobe Photoshop',
      'Blender',
      'Piskel',
      'Canva',
    ],
  },
],
};

/* ── Projects ────────────────────────────────────────────────── */
export const projects = {
  preview: [
    { name: 'xStudio',  desc: 'Digital agency that partners with startups and enterprises.', url: 'x-studio-team.vercel.app', href: 'https://x-studio-team.vercel.app', image: '/assets/bg/xstudio-opt.webp' },
    { name: 'Kabata',   desc: 'Scalable, child-safe educational gaming platform that supports smartphone controllers.', url: 'kabata.onrender.com', href: 'https://kabata.onrender.com', image: '/assets/bg/kabata-opt.webp' },
    { name: 'TaskEase', desc: 'Online task management platform.', url: 'taskease-six.vercel.app', href: 'https://taskease-six.vercel.app', image: '/assets/bg/taskease-opt.webp' },
    { name: 'Print-Smart', desc: 'Online UI/UX printing service.', url: 'print-smart-six.vercel.app', href: 'https://print-smart-six.vercel.app', image: '/assets/bg/print-smart-opt.webp' },
  ],

  full: [
    { name: 'xStudio',                desc: 'Digital agency that partners with startups and enterprises.',        url: 'x-studio-team.vercel.app',           href: 'https://x-studio-team.vercel.app',       image: '/assets/bg/xstudio-opt.webp'       },
    { name: 'Kabata',                 desc: 'Scalable, child-safe educational gaming platform.',                  url: 'kabata.onrender.com',                href: 'https://kabata.onrender.com',            image: '/assets/bg/kabata-opt.webp'       },
    { name: 'TaskEase',               desc: 'Online task management platform.',                                   url: 'taskease-six.vercel.app',            href: 'https://taskease-six.vercel.app',        image: '/assets/bg/taskease-opt.webp'     },
    { name: 'Print-Smart',            desc: 'Online UI/UX printing service.',                                     url: 'print-smart-six.vercel.app',         href: 'https://print-smart-six.vercel.app',     image: '/assets/bg/print-smart-opt.webp'  },
    { name: 'Drip-drop',              desc: 'IoT design for smart home clothesline .',                            url: 'drip-drop-alpha.vercel.app',         href: 'https://drip-drop-alpha.vercel.app',     image: '/assets/bg/drip-drop-opt.webp'    },
    { name: 'HCI-2',                  desc: 'UI/UX Design for movie websites.',                                   url: 'hci-2-two.vercel.app',               href: 'https://hci-2-two.vercel.app',          image: '/assets/bg/hci-2-opt.webp'       },
    { name: 'StreetSignLearner',      desc: 'Street sign learning app.',                                          url: 'street-sign-learner.vercel.app',     href: 'https://street-sign-learner.vercel.app', image: '/assets/bg/street-sign-opt.webp' },
  ],
};

/* ── Certifications ──────────────────────────────────────────── */
/* `icon`  = small issuer logo shown in lists/cards
   `image` = the actual certificate scan/photo shown in the click-to-preview
             modal — point these at your real cert images in assets/certs/
   `visible: false` = not shown on the live site yet (still "Coming soon") */
export const certifications = [
  { icon: '/assets/icons/watt-opt.webp', image: '/assets/certs/watt-cert-opt.webp', name: 'Educational Tour', issuer: 'World of Adventures Travel and Tour', desc: 'Awarded a Certificate of Completion for successfully participating in an Educational Tour across Cebu and Bohol, gaining firsthand exposure to leading IT companies and technology organizations.', href: '#' },
  { icon: '/assets/icons/hcdc-opt.webp', image: '/assets/certs/hcdc-cert-opt.webp', name: 'Programming Competition', issuer: 'Holy Cross of Davao College', desc: 'Recognized as Champion in the IT Category Programming Competition during CET TechnoFair 2024, showcasing excellence in programming, logical problem-solving, and innovative technology solutions.', href: '#' },
  { icon: '/assets/icons/testdome.png', image: '/assets/certs/testdome.jpg', name: 'Coming soon', issuer: 'N/A', desc: 'Demonstrates practical software engineering skills across algorithms, data structures, and design.', href: '#', visible: false },
  { icon: '/assets/icons/oracle.png', image: '/assets/certs/oracle.jpg', name: 'Coming soon', issuer: 'N/A', desc: 'Professional-level certification in generative AI concepts, tools, and implementation.', href: '#', visible: false },
];

/* ── Experience Timeline ─────────────────────────────────────── */
/* `visible: false` = placeholder slot, not shown on the live site yet */
export const experience = [
  { role: 'Coming soon',               company: 'N/A',                          period: 'N/A',     current: false, visible: false },
  { role: 'Coming soon',               company: 'N/A',                          period: 'N/A',     current: false, visible: false },
  { role: 'Coming soon',               company: 'N/A',                          period: 'N/A',     current: false, visible: false },
  { role: 'BS Information Technology', company: 'Holy Cross of Davao College',  period: 'Present', current: true  },
  { role: 'Hello, World! <span class="timeline-wave-emoji" aria-hidden="true">👋🏻</span>', company: 'Wrote my first line of code',  period: '2023',    current: false },
];

/* ── Testimonials ────────────────────────────────────────────── */
/* `visible: false` = placeholder slot, not shown on the live site yet */
export const testimonials = [
  {
    quote:  'Shares knowledge effectively with clear, well-structured ideas that are easy to understand, providing valuable insights that greatly benefit the business.',
    initials: 'OC',
    name:   'Oscar Cebellon',
    role:   'CEO, Ocl Fiber Services',
  },
  {
    quote:  "The website provided a positive experience because it was easy to navigate and hassle-free. Its simple, minimalist, and organized design made managing information more efficient. It also showed how the system can help reduce medical errors through its specificity.",
    initials: 'AL',
    name:   'Ashley Lanuza',
    role:   'SN, San Pedro College',
  },
  {
    quote:  "",
    initials: 'N/A',
    name:   'Name',
    role:   'Position, Company',
    visible: false,
  },
];

/* ── GitHub Activity ─────────────────────────────────────────── */
export const github = {
  username: 'irallanto',
};

/* ── Social Links ────────────────────────────────────────────── */
export const socialLinks = [
  { icon: '/assets/icons/linkedin-opt.webp', label: 'LinkedIn',    handle: 'linkedin.com/in/patllanto', href: 'https://www.linkedin.com/in/pat-llanto-52156941a' },
  { icon: '/assets/icons/facebook-opt.webp', label: 'Facebook',    handle: 'facebook.com/patllanto',    href: 'https://www.facebook.com/profile.php?id=61574448241679'    },
  { icon: '/assets/icons/gmail-opt.webp',      label: 'Gmail',       handle: 'patllanto4@gmail.com',      href: 'mailto:patllanto4@gmail.com'      },
];