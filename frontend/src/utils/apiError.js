export function getApiErrorMessage(err, fallback = 'Request failed') {
  if (!err) return fallback

  const data = err.response?.data
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg || e.message).filter(Boolean).join('. ')
  }

  const status = err.response?.status
  if (status === 502 || status === 503 || status === 504) {
    return 'Backend is not running. Open a terminal, run: cd backend && npm run dev'
  }

  if (err.request && !err.response) {
    return 'Cannot reach the backend. Start it with: cd backend && npm run dev (default port 5001)'
  }

  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'Cannot reach the backend. Start it with: cd backend && npm run dev (default port 5001)'
  }

  return fallback
}
