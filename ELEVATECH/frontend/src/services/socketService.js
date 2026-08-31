import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export function joinCustomerRoom(token) {
  if (!token) {
    return;
  }

  if (!socket.connected) {
    socket.once("connect", () => {
      socket.emit("join_customer_room", {
        token,
      });
    });
  } else {
    socket.emit("join_customer_room", {
      token,
    });
  }
}

export default socket;

