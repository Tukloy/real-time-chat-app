import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 5000
const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    }
});

app.use(cors())

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("message", (data) => {
      console.log("Message received:", data);
      io.emit("message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

server.listen(port, () => {
  console.log('server running at port ' + port);
});