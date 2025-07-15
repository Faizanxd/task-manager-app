import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-manager-app-1-d5y6.onrender.com/api",
  withCredentials: true,
});

export default instance;
