import { io } from "socket.io-client";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const SOCKET_URL = isLocal
  ? "http://localhost:5000"
  : "https://chatapp-backend-191n.onrender.com";

const socket = io(SOCKET_URL, {
  // Pehle polling se secure handshake karega, fir websocket par upgrade hoga
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  withCredentials: true,
});

export default socket;