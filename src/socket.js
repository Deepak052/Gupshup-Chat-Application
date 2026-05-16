// src/socket.js
import { io } from "socket.io-client";
import { base_Api_url } from "./utils/constant";


// Replace with your backend server URL
const socketUrl = base_Api_url.replace('/api/v1/', '');

const socket = io(socketUrl, {
  transports: ["websocket"], // optional but recommended
  withCredentials: true,
});

export default socket;
