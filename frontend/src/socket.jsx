// src/socket.js
import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const socket = io(baseURL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
