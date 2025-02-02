---
title: Server.js
---
# Introduction

This document will walk you through the implementation of the server in <SwmPath>[server.js](/server.js)</SwmPath>. The server is designed to handle HTTP requests and real-time communication using [Socket.io](http://Socket.io).

We will cover:

1. How static assets are served and why it's necessary.
2. How [Socket.io](http://Socket.io) manages connections and broadcasts messages.
3. How the server handles disconnections.
4. How the server is started and listens for incoming requests.

# Serving static assets

<SwmSnippet path="/server.js" line="9">

---

To serve static files like HTML, CSS, and JavaScript, we use Express's static middleware. This is crucial for delivering the client-side code to the user's browser.

```
// Serve static assets
app.use(express.static("public"));

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Broadcast a message to all clients when a user connects
  io.emit("user connected", "A new user has connected");
```

---

</SwmSnippet>

# Managing connections with [Socket.io](http://Socket.io)

<SwmSnippet path="/server.js" line="9">

---

[Socket.io](http://Socket.io) is used to handle real-time communication. When a user connects, a message is broadcasted to all clients. This allows the server to notify all users of new connections.

```
// Serve static assets
app.use(express.static("public"));

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Broadcast a message to all clients when a user connects
  io.emit("user connected", "A new user has connected");
```

---

</SwmSnippet>

# Broadcasting messages

<SwmSnippet path="/server.js" line="19">

---

The server listens for specific events, such as "play sound", and broadcasts these events to all other connected clients. This ensures that actions taken by one user can be communicated to others in real-time.

```
  // Broadcast to all OTHER clients (not the sender)
  socket.on("play sound", (soundName) => {
    console.log(`Broadcasting sound: ${soundName}`);
    socket.broadcast.emit("play sound", soundName); // <-- Fix here
  });
```

---

</SwmSnippet>

# Handling disconnections

<SwmSnippet path="/server.js" line="25">

---

When a user disconnects, the server logs this event. This helps in maintaining an accurate count of connected users and can be used for debugging purposes.

```
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
```

---

</SwmSnippet>

# Starting the server

<SwmSnippet path="/server.js" line="31">

---

Finally, the server is started and listens on a specified port. This is the entry point for all incoming HTTP and WebSocket connections.

```
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
```

---

</SwmSnippet>

This setup ensures that the server can handle both static content delivery and real-time communication efficiently.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBR2xpdGNoU2hha2UlM0ElM0FGVEZTQQ==" repo-name="GlitchShake"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
