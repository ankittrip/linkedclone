import { io as socketIOClient, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const initSocket = (): Socket => {
  if (!socket) {
    socket = socketIOClient(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });
  }
  return socket;
};


export const connectSocket = (): void => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};


export const disconnectSocket = (): void => {
  if (socket) socket.disconnect();
};


export const getSocket = (): Socket => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");
  return socket;
};
