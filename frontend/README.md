# Frontend - Automated Code Reviewer

## Setup

```powershell
cd frontend
npm install
npm run dev
```

Set API base URL in `.env` (or use default localhost):

`VITE_API_BASE=http://localhost:5000/api`

This project uses Vite + React + Tailwind. Key pages:
- `/login` - user login
- `/register` - create account
- `/dashboard` - submit code for review
- `/history` - list previous reviews
- `/admin` - admin analytics for users and reviews

