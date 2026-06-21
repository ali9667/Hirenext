# HireNext — Full Stack Job Portal

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev          # starts on :5000
```

### 3. Seed data (optional)
```bash
cd backend
npm run seed
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev          # starts on :5173
```

Open http://localhost:5173

---

## Demo accounts (after seeding)
- **Seeker:** rahul@example.com / Demo1234!
- **Company:** demo@techcorp.in / Demo1234!

---

## Stack
- React 18, React Router, Redux Toolkit, TanStack Query, React Hook Form
- Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Custom CSS (no UI library) — Plus Jakarta Sans font
