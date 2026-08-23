import { io } from "socket.io-client";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const SOCKET_URL = isLocal
  ? "http://localhost:5000"
  : "https://chatapp-backend-191n.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default socket;