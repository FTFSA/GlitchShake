const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static assets
app.use(express.static("public"));

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Broadcast a message to all clients when a user connects
  io.emit("user connected", "A new user has connected");

  // Broadcast to all OTHER clients (not the sender)
  socket.on("play sound", (soundName) => {
    console.log(`Broadcasting sound: ${soundName}`);
    socket.broadcast.emit("play sound", soundName); // <-- Fix here
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
