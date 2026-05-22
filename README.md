# Automated Code Reviewer

Production-ready full-stack web application for AI-powered source code reviews.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router DOM, React Toastify
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, CORS, dotenv
- AI: Groq LLM through LangChain `ChatGroq`
- Observability: LangSmith tracing plus local trace records in MongoDB

## Features

- Register, login, logout, password hashing, and JWT-protected routes
- Dashboard for submitting JavaScript, Python, Java, C, C++, and TypeScript
- AI reviews with score, bugs, security issues, performance suggestions, code smells, best practices, refactored code, and explanation
- Review history with search and delete
- Admin analytics for total users, total reviews, most reviewed language, language stats, and recent activity
- Responsive dashboard UI with loading states and toast notifications

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

Backend defaults to `http://localhost:5001` (auto-fallback if port is busy). Frontend defaults to `http://localhost:5173`.

### Port already in use (EADDRINUSE)

Windows:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or from `backend`:

```powershell
npm run kill-port
npm run dev:clean
```

Mac/Linux:

```bash
lsof -i :5000
kill -9 <PID>
```

## Environment

Backend `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
LANGSMITH_API_KEY=your_langsmith_api_key
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_TRACING_V2=true
LANGSMITH_TRACING=true
LANGCHAIN_PROJECT=Automated-Code-Reviewer
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
```

Frontend optional `.env`:

```env
VITE_API_BASE=http://localhost:5001/api
VITE_API_PORT=5001
```

## API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/reviews/submit` | JWT | Submit code review |
| GET | `/api/reviews?q=term` | JWT | Search/list review history |
| DELETE | `/api/reviews/:id` | JWT | Delete review |
| GET | `/api/reviews/admin/stats` | Admin JWT | Analytics dashboard data |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Render and Vercel steps.

## Layout Reference

See [SAMPLE_SCREENSHOTS.md](SAMPLE_SCREENSHOTS.md) for the intended screen structure.
"# Automated-Code-Reviewer" 
