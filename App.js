const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");

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

  const users = [];
  /* join room */
  socket.on("join_room", async (data) => {
    socket.join(data.roomId);
    console.log(socket.id + " User joined room: " + data.roomId);
    users.push({ id: socket.id, roomId: data.roomId });
   
  });

  /* send message  */
  socket.on("send_message", (data) => {
    console.log("Message received: " + data.message);
    socket
      .to(data.room)
      .emit("receive_message", { ...data, sender: socket.id });
  });

  /* leave room */
  socket.on("leave_room", (data) => {
    socket.leave(data.roomId);
    console.log(socket.id + " User left room: " + data.roomId);
    users.splice(
      users.findIndex((user) => user.userId === socket.id),
      1
    );
    socket.emit("users", users);
  });

  /* get all the joined clients in room */
    socket.on("get_joined_users", (data) => {
        var clients = socket.sockets?.clients(data?.roomId); 
        console.log(clients);
       
    });



  socket.on("disconnect", () => {
    console.log("User was disconnected" + socket.id);
  });
});





module.exports = { app, http };
