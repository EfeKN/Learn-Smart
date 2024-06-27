// Creation Date: 28.06.2024

import axios from "axios";

// Create a new axios instance with a custom config for the backend
const backend_environment = axios.create({
  baseURL: process.env.BACKEND_API_URL,
});

export default backend_environment;
