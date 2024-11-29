// socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("Authorization");
console.log("token: ", token);

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

export default socket;
