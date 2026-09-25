import { io } from "socket.io-client";

export const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;