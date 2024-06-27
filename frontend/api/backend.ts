import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.BACKEND_API_URL,
});

export default backend;

// now import backend and use it like backend.get(...) or backend.post(...)
