import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;

