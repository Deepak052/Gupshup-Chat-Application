// src/socket.js
import { io } from "socket.io-client";

// Replace with your backend server URL
const socket = io("http://localhost:8000", {
  transports: ["websocket"], // optional but recommended
  withCredentials: true,
});

export default socket;
