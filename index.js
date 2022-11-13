const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
/* init middle wares */
app.use(cors());

const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("New user connected - " + socket.id);

  /* join room */
  socket.on("join_room", async (data) => {
    socket.join(data.roomId.trim().toUpperCase());
    socket.emit("welcome_message", {
      message: "Welcome to the room " + data.roomId.trim().toUpperCase(),
      name: data.yourName,
    });
  });

  /* notify if someone join */
  socket.on("notify_join", async (data) => {
    socket.to(data?.roomId.trim().toUpperCase()).emit("notify_joined", {
      roomId: data?.roomId.trim().toUpperCase(),
      name: data?.yourName,
      userId: socket.id,
    });
  });

  /* send message  */
  socket.on("send_message", (data) => {
    console.log("Message received: " + data.message);
    socket
      .to(data.room.trim().toUpperCase())
      .emit("receive_message", { ...data, sender: socket.id });
  });

  /* leave room */
  socket.on("leave_room", (data) => {
    socket.leave(data.roomId.trim().toUpperCase());
    console.log(
      socket.id + " User left room: " + data.roomId.trim().toUpperCase()
    );
  });

  /* notify if someone join */
  socket.on("notify_leave", async (data) => {
    socket.to(data?.roomId.trim().toUpperCase()).emit("notify_left", {
      roomId: data?.roomId.trim().toUpperCase(),
      name: data?.yourName,
      userId: socket.id,
    });
  });

  /* typing indicator */
  socket.on("typing", async (data) => {
    socket.to(data.trim().toUpperCase()).emit("isTyping", { isTyping: true });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected" + socket.id);
  });
});

/* First Routes */
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Socket.io Chat App" });
});

/* listen port */
http.listen(PORT, () => {
  console.log("listening on *:5000");
});
