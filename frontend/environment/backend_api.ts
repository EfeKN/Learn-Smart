import axios from "axios";
// Create a new axios instance with a custom config for the backend
export const backendAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const backend = axios.create({
  baseURL: "http://localhost:8000",
});
