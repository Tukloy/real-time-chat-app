import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST'],
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    // Notify other users in the room
    socket.to(room).emit("message", {
      username: "System",
      text: `${username} has joined the room.`,
    });

    // Send a welcome message to the user
    socket.emit("message", {
      username: "System",
      text: `Welcome to the ${room} room, ${username}!`,
    });
  });

  // Handle messages within a room
  socket.on("message", (data) => {
    console.log(`Message from ${data.username} in ${data.room}: ${data.text}`);
    io.to(data.room).emit("message", data);
  });

  // Handle room leave event
  socket.on("leaveRoom", ({ username, room }) => {
    socket.leave(room);
    console.log(`${username} left room: ${room}`);

    socket.to(room).emit("message", {
      username: "System",
      text: `${username} has left the room.`,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
