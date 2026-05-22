const axios = require('axios');

const API = 'http://localhost:3000/api';

async function run() {
  try {
    console.log('Registering test user...');
    const reg = await axios.post(`${API}/auth/register`, { name: 'smoke', email: 'smoke+test@example.com', password: 'password123' }, { timeout: 10000 });
    console.log('Register response:', reg.data);
  } catch (e) {
    console.warn('Register failed (maybe exists):', e.response?.data || e.message);
  }

  try {
    console.log('Logging in...');
    const login = await axios.post(`${API}/auth/login`, { email: 'smoke+test@example.com', password: 'password123' }, { timeout: 10000 });
    console.log('Login response:', login.data);
    const token = login.data.token;
    if (!token) return;

    console.log('Submitting sample review...');
    const sample = `function add(a,b){return a+b}`;
    const res = await axios.post(`${API}/reviews/submit`, { code: sample, language: 'JavaScript' }, { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 });
    console.log('Review response:', res.data);
  } catch (e) {
    console.error('Smoke test error:', e.response?.data || e.message);
  }
}

run();
