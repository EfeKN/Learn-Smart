import axios from "axios";
// Create a new axios instance with a custom config for the backend
const backendAPI = axios.create({
  baseURL: process.env.BACKEND_API_URL,
});

export default backendAPI;
