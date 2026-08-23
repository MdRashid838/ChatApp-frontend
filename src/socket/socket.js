import { io } from "socket.io-client";

// Environment variable se Socket URL read karega, fallback me Render URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://chatapp-backend-191n.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default socket;