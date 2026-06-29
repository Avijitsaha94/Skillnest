import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { Review } from '../models/Review';
import { Blog } from '../models/Blog';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? '';

// ─── Real-looking seed data ───────────────────────────────

const users = [
  {
    clerkId: 'user_demo_admin_001',
    email: 'admin@skillnest.com',
    name: 'Sarah Mitchell',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'admin' as const,
    bio: 'Platform administrator and curriculum designer with 10+ years in EdTech.',
  },
  {
    clerkId: 'user_demo_user_001',
    email: 'user@skillnest.com',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'user' as const,
    bio: 'Aspiring full-stack developer passionate about building products.',
  },
  {
    clerkId: 'user_demo_manager_001',
    email: 'manager@skillnest.com',
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    role: 'manager' as const,
    bio: 'Content manager ensuring quality learning experiences.',
  },
  {
    clerkId: 'user_instructor_001',
    email: 'daniel@skillnest.com',
    name: 'Daniel Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel',
    role: 'user' as const,
    bio: 'Senior software engineer at Google with 8 years of experience in web technologies.',
  },
  {
    clerkId: 'user_instructor_002',
    email: 'maya@skillnest.com',
    name: 'Maya Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    role: 'user' as const,
    bio: 'Data scientist and ML engineer. Former researcher at MIT Media Lab.',
  },
];

const courseData = [
  {
    title: 'Complete React & Next.js Development Bootcamp',
    shortDescription: 'Master modern React with hooks, context, and Next.js 14 App Router.',
    description:
      'This comprehensive course takes you from React fundamentals to building production-ready applications with Next.js 14. You will learn React hooks, state management with Zustand, server components, and deploying to Vercel. By the end, you will have built 5 real-world projects including an e-commerce platform and a social media app.',
    category: 'Web Development' as const,
    level: 'Intermediate' as const,
    price: 89,
    duration: 2400,
    tags: ['react', 'nextjs', 'typescript', 'tailwindcss', 'fullstack'],
    outcomes: [
      'Build production-ready React applications with TypeScript',
      'Implement server-side rendering and static generation with Next.js 14',
      'Manage complex application state with Zustand',
      'Integrate authentication with Clerk and payments with Stripe',
      'Deploy applications to Vercel and optimize for Core Web Vitals',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop',
    ],
    enrollments: 2847,
    rating: 4.8,
    reviewCount: 342,
  },
  {
    title: 'Python for Data Science & Machine Learning',
    shortDescription: 'Learn Python, pandas, scikit-learn, and build real ML models.',
    description:
      'Start your data science journey with Python. This course covers everything from Python basics to advanced machine learning algorithms. You will work with real datasets, build predictive models, create data visualizations, and deploy ML models to production. Includes 20+ hands-on projects.',
    category: 'Data Science' as const,
    level: 'Beginner' as const,
    price: 79,
    duration: 3200,
    tags: ['python', 'machine learning', 'pandas', 'numpy', 'scikit-learn'],
    outcomes: [
      'Write clean Python code for data analysis',
      'Clean and transform datasets with pandas and numpy',
      'Build and evaluate ML models with scikit-learn',
      'Create compelling data visualizations with matplotlib and seaborn',
      'Deploy ML models with FastAPI and Docker',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
    ],
    enrollments: 5123,
    rating: 4.9,
    reviewCount: 891,
  },
  {
    title: 'DevOps with Docker, Kubernetes & AWS',
    shortDescription: 'Master containerization, orchestration, and cloud deployment.',
    description:
      'Learn modern DevOps practices used at top tech companies. This hands-on course covers Docker containerization, Kubernetes orchestration, CI/CD pipelines with GitHub Actions, and deploying scalable applications on AWS. You will set up production-grade infrastructure from scratch.',
    category: 'DevOps' as const,
    level: 'Advanced' as const,
    price: 99,
    duration: 2800,
    tags: ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'],
    outcomes: [
      'Containerize any application with Docker and Docker Compose',
      'Deploy and manage Kubernetes clusters on AWS EKS',
      'Build automated CI/CD pipelines with GitHub Actions',
      'Implement infrastructure as code with Terraform',
      'Monitor production systems with Prometheus and Grafana',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop',
    ],
    enrollments: 1456,
    rating: 4.7,
    reviewCount: 187,
  },
  {
    title: 'UI/UX Design Fundamentals with Figma',
    shortDescription: 'Design beautiful interfaces from wireframes to high-fidelity prototypes.',
    description:
      'Transform your design skills with this comprehensive UI/UX course. Learn design thinking, user research, wireframing, prototyping, and building a professional design system in Figma. You will design 4 complete app interfaces and build a portfolio that gets you hired.',
    category: 'Design' as const,
    level: 'Beginner' as const,
    price: 69,
    duration: 1800,
    tags: ['figma', 'ui design', 'ux research', 'prototyping', 'design systems'],
    outcomes: [
      'Apply design thinking to solve real user problems',
      'Create wireframes and high-fidelity mockups in Figma',
      'Build and maintain a component-based design system',
      'Conduct usability tests and iterate on designs',
      'Present designs effectively to stakeholders',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    ],
    enrollments: 3201,
    rating: 4.6,
    reviewCount: 445,
  },
  {
    title: 'Node.js & Express REST API Masterclass',
    shortDescription: 'Build scalable REST APIs with Node.js, Express, MongoDB and JWT.',
    description:
      'Learn to build professional-grade REST APIs from scratch. This course covers Express.js architecture, MongoDB with Mongoose, JWT authentication, file uploads, email notifications, rate limiting, and deploying to production on Railway. You will build a complete e-commerce API.',
    category: 'Web Development' as const,
    level: 'Intermediate' as const,
    price: 75,
    duration: 2000,
    tags: ['nodejs', 'express', 'mongodb', 'jwt', 'rest api'],
    outcomes: [
      'Design and build scalable REST APIs with Express.js',
      'Model data with Mongoose and MongoDB',
      'Implement JWT-based authentication and authorization',
      'Handle file uploads, emails, and third-party integrations',
      'Deploy Node.js apps to production with CI/CD',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop',
    ],
    enrollments: 1892,
    rating: 4.7,
    reviewCount: 256,
  },
  {
    title: 'Deep Learning with TensorFlow & PyTorch',
    shortDescription: 'Build neural networks for image recognition, NLP, and generative AI.',
    description:
      'Dive deep into neural networks and modern deep learning. You will implement CNNs for computer vision, RNNs and Transformers for NLP, GANs for image generation, and fine-tune large language models. The course includes cutting-edge research papers translated into practical code.',
    category: 'Machine Learning' as const,
    level: 'Advanced' as const,
    price: 109,
    duration: 4000,
    tags: ['deep learning', 'tensorflow', 'pytorch', 'neural networks', 'transformers'],
    outcomes: [
      'Implement convolutional neural networks for image classification',
      'Build transformer models for natural language processing',
      'Train generative adversarial networks (GANs)',
      'Fine-tune pre-trained models like BERT and GPT',
      'Optimize and deploy deep learning models to production',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop',
    ],
    enrollments: 978,
    rating: 4.9,
    reviewCount: 134,
  },
  {
    title: 'Flutter Mobile App Development',
    shortDescription: 'Build beautiful iOS and Android apps with a single Flutter codebase.',
    description:
      'Learn to build cross-platform mobile apps with Flutter and Dart. From your first widget to publishing on the App Store and Google Play, this course covers state management with Riverpod, Firebase integration, REST API calls, and custom animations. Build 6 complete apps.',
    category: 'Mobile Development' as const,
    level: 'Beginner' as const,
    price: 85,
    duration: 2600,
    tags: ['flutter', 'dart', 'mobile', 'ios', 'android'],
    outcomes: [
      'Build cross-platform mobile apps with Flutter and Dart',
      'Manage app state with Riverpod',
      'Integrate Firebase for auth, database, and notifications',
      'Implement smooth animations and custom UI components',
      'Publish apps to App Store and Google Play',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop',
    ],
    enrollments: 2134,
    rating: 4.6,
    reviewCount: 301,
  },
  {
    title: 'Digital Marketing & Growth Hacking',
    shortDescription: 'Learn SEO, social media marketing, email campaigns, and paid ads.',
    description:
      'Master digital marketing from beginner to advanced. This course covers SEO, content marketing, social media strategy, Google and Meta Ads, email automation, conversion rate optimization, and analytics. You will build and launch real campaigns with measurable results.',
    category: 'Marketing' as const,
    level: 'Beginner' as const,
    price: 59,
    duration: 1500,
    tags: ['seo', 'google ads', 'social media', 'email marketing', 'analytics'],
    outcomes: [
      'Rank websites on the first page of Google with SEO',
      'Run profitable Google and Meta ad campaigns',
      'Build and grow an engaged social media following',
      'Create email marketing funnels that convert',
      'Analyze marketing data to make decisions',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop',
    ],
    enrollments: 4567,
    rating: 4.5,
    reviewCount: 623,
  },
];

const blogData = [
  {
    title: 'Why Next.js 14 App Router Will Change How You Build Web Apps',
    slug: 'nextjs-14-app-router-guide',
    excerpt:
      'The App Router is not just a routing update — it fundamentally changes how data flows in React applications. Here is what you need to know.',
    content: `The release of Next.js 14 with the stable App Router has marked a turning point in React development. Server Components, which allow components to run exclusively on the server, are now first-class citizens.

## What Changed

Previously, every React component ran on both client and server during SSR. Now, with Server Components, you can build an entire data-fetching layer without shipping any JavaScript to the browser. This means faster page loads and better SEO out of the box.

## Server Components in Practice

\`\`\`typescript
// This component runs ONLY on the server
async function CourseList() {
  const courses = await db.courses.findMany(); // Direct DB access
  return <div>{courses.map(c => <CourseCard key={c.id} {...c} />)}</div>;
}
\`\`\`

The key insight: no useEffect, no loading states, no API calls from the browser. The data is ready when the HTML reaches the user.

## What This Means for SkillNest

We rebuilt our explore page using Server Components and saw a 40% reduction in JavaScript bundle size. Course listings that previously required client-side fetching now render instantly from the server.

The learning curve is real — understanding the boundary between server and client takes practice. But once it clicks, you will never want to go back.`,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['nextjs', 'react', 'web development', 'server components'],
    isPublished: true,
    views: 3421,
  },
  {
    title: 'The 2025 Roadmap to Becoming a Full-Stack Developer',
    slug: 'full-stack-developer-roadmap-2025',
    excerpt:
      'With so many technologies to learn, where do you start? We mapped out the most efficient path from zero to job-ready full-stack developer.',
    content: `Every year the "what should I learn" question gets more complex. In 2025, the answer has become clearer, not harder.

## The Core Path

**Month 1-2: Foundations**
HTML, CSS, and JavaScript fundamentals. No shortcuts here — understanding the DOM and how the browser works will save you hundreds of hours later.

**Month 3-4: React & Node.js**
Build frontend UIs with React and learn server-side development with Node.js. These two skills together make you immediately employable.

**Month 5-6: Databases & Deployment**
SQL (PostgreSQL) and NoSQL (MongoDB), plus deploying apps to production with Docker and cloud services.

**Month 7+: Specialization**
TypeScript, testing, system design, and a specialty area (mobile, AI integration, DevOps).

## What to Skip

Spending months perfecting CSS animations before you can build an API. Learning jQuery in 2025. Doing 100 LeetCode problems before you have built a project. Building things matters infinitely more than optimizing your knowledge of things.

## The One Thing That Separates Successful Learners

Building projects. Not tutorials. Not courses. Your own ideas, implemented with the skills you have right now, even if the code is messy.`,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
    tags: ['career', 'learning', 'full-stack', 'roadmap'],
    isPublished: true,
    views: 8934,
  },
  {
    title: 'How I Used AI to Cut My Learning Time in Half',
    slug: 'using-ai-to-learn-faster',
    excerpt:
      'AI tools have transformed how developers learn. Here is a practical system for using Claude and ChatGPT as your personal tutor — without losing the depth.',
    content: `AI assistants have become the most powerful learning tool available to developers. But most people use them wrong.

## The Problem With AI-Assisted Learning

If you ask AI to solve your problems directly, you learn nothing. You get working code but no mental model. A week later you are stuck on the same type of problem.

## The Right Approach: Socratic AI Learning

Instead of "write me a function that sorts this array," try:

- "Explain why my merge sort implementation has O(n²) instead of O(n log n)"
- "What is wrong with this approach? What are three alternatives?"
- "I think the issue is with how I am handling the base case — can you confirm without giving me the answer?"

This turns AI into a tutor, not a code generator.

## Practical System

**Morning:** Read documentation or watch a short concept video (20 mins)
**Midday:** Build something with the concept, getting stuck intentionally
**Afternoon:** Use AI to debug your thinking, not your code
**Evening:** Write a short note summarizing what you learned

Following this system, I completed SkillNest's React course in 3 weeks instead of the estimated 6. The depth of understanding was actually higher because I built real projects alongside.`,
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=400&fit=crop',
    tags: ['ai', 'learning', 'productivity', 'career'],
    isPublished: true,
    views: 5678,
  },
  {
    title: 'TypeScript in 2025: Is It Still Worth Learning?',
    slug: 'typescript-2025-worth-learning',
    excerpt:
      'TypeScript adoption has crossed the 80% mark among professional developers. Here is why it has become non-negotiable and how to get up to speed fast.',
    content: `Five years ago TypeScript was optional. Today it is a professional expectation. If you are still writing plain JavaScript for production applications, it is time to make the switch.

## Why TypeScript Won

The developer experience improvements are real and measurable. Catching bugs at compile time instead of at 2am when production is down. Refactoring large codebases with confidence. Autocomplete that actually knows what your objects look like.

## Common Objections, Addressed

**"It takes too long to type everything."**
TypeScript's inference is remarkable. In most well-written TS code, you annotate maybe 20% of variables and the rest are inferred automatically.

**"My team is too small for it."**
TypeScript helps solo developers and small teams most. With no dedicated QA team, the compiler is your first line of defense.

**"I will learn it later."**
There is no later. Every major framework's documentation assumes TypeScript. Every senior dev job listing requires it.

## Getting Started This Week

Do not rewrite anything. Add TypeScript to your next project and set strict: false initially. Turn on one strict option per week. Within a month you will wonder how you ever shipped code without it.`,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    tags: ['typescript', 'javascript', 'web development'],
    isPublished: true,
    views: 4102,
  },
  {
    title: 'System Design Interview Prep: What Actually Matters',
    slug: 'system-design-interview-prep',
    excerpt:
      'After 50+ mock system design interviews, here are the patterns that separate candidates who get offers from those who do not.',
    content: `System design interviews terrify most candidates because the scope feels infinite. What are the 10 concepts I need to master? What drawing style is expected? Am I supposed to know all the numbers?

Here is the truth: interviewers are not testing your knowledge of specific technologies. They are testing how you think through ambiguous problems.

## The Framework That Works

**1. Clarify requirements (5 minutes)**
Ask about scale, consistency requirements, latency targets. Most candidates skip this and design the wrong system.

**2. Estimate scale (3 minutes)**
Back-of-envelope math. "10M users, 100 requests/day each = 10B requests/day = ~115k RPS." This tells you whether you need caching, horizontal scaling, and database sharding.

**3. Design high level (10 minutes)**
Draw boxes: client, load balancer, application servers, cache, database, CDN. Explain the request flow out loud.

**4. Deep dive on bottlenecks (15 minutes)**
Pick the hardest part and go deep. Database design, caching strategy, handling failure cases.

## What To Stop Worrying About

Memorizing exact Cassandra vs DynamoDB internals. Knowing the exact byte sizes of everything. Drawing perfectly neat diagrams.

## What To Start Doing

Practice talking out loud. The interview is a conversation, not an exam. Interviewers want to hire someone they would enjoy working with on hard problems.`,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    tags: ['system design', 'interviews', 'career', 'backend'],
    isPublished: true,
    views: 6789,
  },
];

const reviewComments = [
  'This course completely changed how I think about React. The section on Server Components alone was worth the price.',
  'Daniel is an exceptional instructor. He explains complex concepts in a way that actually sticks. Highly recommended.',
  'I came in as a complete beginner and finished building a real app. The projects are practical and challenging.',
  'Best course I have taken on this platform. Clear, concise, and up to date with the latest best practices.',
  'The hands-on projects are what set this apart. You actually build real things, not toy examples.',
  'Finished this course in 3 weeks and immediately landed a junior dev role. The portfolio projects helped a lot.',
  'The instructor really knows their stuff. Even the tricky edge cases are explained clearly.',
  'Worth every penny. Updated regularly and the community support is excellent.',
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Review.deleteMany({}),
      Blog.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    const admin = createdUsers[0];
    const instructor1 = createdUsers[3];
    const instructor2 = createdUsers[4];
    console.log(`Created ${createdUsers.length} users`);

    // Create courses (alternate instructors)
    const courseDocs = courseData.map((c, i) => ({
      ...c,
      instructor: i % 2 === 0 ? instructor1._id : instructor2._id,
      isPublished: true,
    }));
    const createdCourses = await Course.insertMany(courseDocs);
    console.log(`Created ${createdCourses.length} courses`);

    // Create reviews
    const demoUser = createdUsers[1];
    const reviews = createdCourses.slice(0, 4).map((course, i) => ({
      course: course._id,
      user: demoUser._id,
      rating: [5, 4, 5, 4][i],
      comment: reviewComments[i],
    }));
    await Review.insertMany(reviews);
    console.log(`Created ${reviews.length} reviews`);

    // Enroll demo user in first 3 courses
    await User.findByIdAndUpdate(demoUser._id, {
      enrolledCourses: createdCourses.slice(0, 3).map((c) => c._id),
      completedCategories: ['Web Development'],
    });

    // Create blog posts
    const blogsWithAuthor = blogData.map((b) => ({ ...b, author: admin._id }));
    await Blog.insertMany(blogsWithAuthor);
    console.log(`Created ${blogData.length} blog posts`);

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Demo Credentials:');
    console.log('  User  : user@skillnest.com');
    console.log('  Admin : admin@skillnest.com');
    console.log('  Manager: manager@skillnest.com');
    console.log('  (Set passwords in Clerk dashboard)\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
