import axios from "axios";
// Create a new axios instance with a custom config for the backend
const backendAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default backendAPI;
