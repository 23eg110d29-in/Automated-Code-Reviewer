# Backend - Automated Code Reviewer

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run dev server:

```powershell
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register with `{ name, email, password }` |
| POST | `/api/auth/login` | Public | Login with `{ email, password }` |
| POST | `/api/reviews/submit` | JWT | Review code with `{ code, language }` |
| GET | `/api/reviews?q=term` | JWT | List/search the current user's reviews |
| DELETE | `/api/reviews/:id` | JWT | Delete one owned review |
| GET | `/api/reviews/admin/stats` | Admin JWT | Analytics totals and language statistics |

## Notes

- Configure `GROQ_API_KEY`, `MONGO_URI`, `JWT_SECRET`, and `LANGSMITH_API_KEY` in `.env`.
- `LANGCHAIN_API_KEY` is also accepted as an alias for LangSmith compatibility.
- `services/aiReviewer.js` uses LangChain `ChatGroq`; LangSmith tracing is enabled when `LANGCHAIN_TRACING_V2=true` or `LANGSMITH_TRACING=true`.
