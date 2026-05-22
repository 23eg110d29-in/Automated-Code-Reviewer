# Deployment Guide (Render / Vercel)

Backend (Render):
- Create a new Web Service on Render.
- Root directory: `backend`.
- Build command: `npm install`.
- Start command: `npm start`.
- Add environment variables from `backend/.env.example`: `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `LANGSMITH_API_KEY`, `LANGCHAIN_TRACING_V2`, `LANGSMITH_TRACING`, `LANGCHAIN_PROJECT`, `CLIENT_URL`, and optional `ADMIN_EMAIL`.
- Use `PORT` set by Render or default 5000.

Frontend (Vercel):
- Create a new Vercel project and connect the frontend folder.
- Set Build Command: `npm run build`, Output Directory: `dist`.
- Set environment variable `VITE_API_BASE` to point to your backend URL.
- Example: `VITE_API_BASE=https://your-render-service.onrender.com/api`.

Notes:
- For LangSmith/Groq keys, use secrets in your hosting provider.
- Ensure CORS on backend allows your frontend domain.
- Set `CLIENT_URL` on Render to your Vercel domain.
