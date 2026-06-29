# SkillNest — AI-Powered Online Learning Platform

> An AI-powered course marketplace built with Next.js 14, Express.js, MongoDB, and Clerk authentication.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb)](https://mongodb.com)

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | https://skillnest.vercel.app |
| Backend API | https://skillnest-api.railway.app |

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| User | user@skillnest.com | Demo1234! |
| Admin | admin@skillnest.com | Admin1234! |
| Manager | manager@skillnest.com | Manager1234! |

---

## ✨ Features

### Core
- 🔐 Authentication via Clerk (Email + Google + Facebook OAuth)
- 👥 Role-Based Access Control (User / Admin / Manager)
- 📚 500+ courses with search, filter, sort, and pagination
- ⭐ Reviews and ratings system
- 📝 Blog with full article support
- 📊 Admin dashboard with real-time analytics

### AI Features (3 implemented)
1. **AI Content Generator** — Enter a course title and audience; AI generates a professional description, 5 learning outcomes, and relevant tags using GPT-4o-mini
2. **AI Smart Recommendations** — Analyzes your enrolled courses and completed categories to recommend the 6 best next courses for your learning journey
3. **AI Chat Assistant** — Real-time streaming chatbot that answers questions about courses, learning paths, and technology topics (SSE streaming)

---

## 🛠 Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework + SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| TanStack Query | Server state + caching |
| Axios | HTTP client |
| Recharts | Dashboard charts |
| Clerk | Auth UI components |
| React Hook Form + Zod | Form validation |
| Sonner | Toast notifications |

### Backend
| Tool | Purpose |
|---|---|
| Express.js | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database + ODM |
| Clerk SDK | JWT verification |
| OpenAI SDK | AI features |
| Zod | Request validation |
| express-rate-limit | Rate limiting |
| Helmet + CORS | Security headers |
| Svix | Webhook verification |

---

## 📁 Project Structure

```
skillnest/
├── backend/
│   ├── src/
│   │   ├── config/         # DB + env validation
│   │   ├── middleware/      # Auth, RBAC, error handler, rate limiter
│   │   ├── models/          # Mongoose schemas (Course, User, Review, Blog)
│   │   ├── repositories/    # DB access layer
│   │   ├── services/        # Business logic + AI service
│   │   ├── routes/          # Express route handlers
│   │   ├── types/           # Shared TypeScript types
│   │   └── seed/            # Database seed script
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── (public)/        # Landing, Explore, Course detail, Blog, About, Contact, FAQ
    │   ├── (auth)/          # Sign-in, Sign-up
    │   ├── dashboard/       # User dashboard (4 pages)
    │   └── admin/           # Admin dashboard (6 pages)
    ├── components/
    │   ├── shared/          # Navbar, Footer, ThemeProvider
    │   ├── landing/         # Hero + 8 landing sections
    │   ├── explore/         # CourseCard + skeleton
    │   ├── dashboard/       # Charts, data tables
    │   └── ai/              # Content generator + chat
    ├── hooks/               # useDebounce, useFilters, useCountUp, useInView
    ├── lib/                 # Axios instance, utils
    └── types/               # Shared TypeScript types
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Clerk account (free tier works)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skillnest.git
cd skillnest
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your .env values (MongoDB URI, Clerk keys, OpenAI key)
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Fill in your Clerk publishable key and API URL
npm install
npm run dev
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```

This creates 8 courses, 5 blog posts, demo users (admin + regular user + manager), and reviews.

### 5. Clerk Webhook Setup
In your Clerk dashboard:
1. Go to Webhooks → Add Endpoint
2. URL: `https://your-backend.com/api/webhook/clerk`
3. Events: `user.created`, `user.updated`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET` in your `.env`

---

## 🔌 API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| GET | /api/courses | List courses with filters + pagination |
| GET | /api/courses/top | Top 8 rated courses |
| GET | /api/courses/:id | Course detail |
| GET | /api/blogs | Blog listing |
| GET | /api/blogs/:slug | Blog post |
| GET | /api/reviews/course/:id | Course reviews |

### Protected (requires auth)
| Method | Path | Description |
|---|---|---|
| GET | /api/users/me | Own profile |
| PATCH | /api/users/me | Update profile |
| POST | /api/courses/:id/enroll | Enroll in course |
| POST | /api/reviews/course/:id | Leave review |
| GET | /api/dashboard/user | User stats |
| POST | /api/ai/generate | AI content generator |
| GET | /api/ai/recommendations | AI recommendations |
| POST | /api/ai/chat | AI chat (SSE streaming) |

### Admin only
| Method | Path | Description |
|---|---|---|
| GET | /api/dashboard/admin | Admin analytics |
| GET | /api/users | All users paginated |
| PATCH | /api/users/:id/role | Change user role |
| POST | /api/courses | Create course |
| DELETE | /api/courses/:id | Delete course |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```
Set environment variables in Vercel dashboard.

### Backend → Railway
```bash
# Connect GitHub repo in Railway dashboard
# Set environment variables
# Railway auto-detects Node.js and deploys
```

### Database → MongoDB Atlas
1. Create free M0 cluster at cloud.mongodb.com
2. Add connection string to `MONGODB_URI`
3. Whitelist Railway/Vercel IP addresses (or use 0.0.0.0/0 for development)

---

## 🎨 Design System

- **Primary**: Indigo `#6366F1` — CTAs, links, active states
- **Secondary**: Emerald `#10B981` — success, ratings, AI features
- **Accent**: Amber `#F59E0B` — highlights, badges, stars
- **Neutral**: Gray scale — text, borders, backgrounds
- Full dark mode support via CSS variables
- Responsive: mobile-first, works on all screen sizes

---

## 🔒 Security

- All AI API keys are server-side only — never exposed to the browser
- Clerk JWT verified on every protected request
- Zod validation on all request bodies
- Rate limiting: 100 req/min general, 10 req/min for AI endpoints
- CORS restricted to frontend origin
- Helmet security headers enabled
- MongoDB injection prevention via Mongoose

---

Made with ❤️ using Next.js 14, Express.js, MongoDB, Clerk, and OpenAI
