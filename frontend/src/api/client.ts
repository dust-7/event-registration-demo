import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL must be set');
}

export const client = axios.create({
  baseURL: apiUrl,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
