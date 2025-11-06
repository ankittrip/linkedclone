import dotenv from "dotenv";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();



const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.set("io", io);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
