const express = require('express');
const app = express();
const http = require('http');
// socket.io har mange problemer med cors. Derfor er det godt at have installeret dette library, for at finde bugs nemmere. 
const cors = require('cors');
const { Server } = require('socket.io');
const { copyFileSync } = require('fs');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    // specify the settings for the cors in the socket io server
    cors: {
        // origin - The server (url) which is going to be calling to our socket.io server
        // in our case it is the local host for React.
        origin: 'http://localhost:3000',
        methods: ["GET", "POST", "UPDATE", "DELETE"],
    },
});

// io socket listens for events. If someone connects for example
// on is always a callBack function
io.on("connection", (socket) => {
    console.log("User connected. ID is: " + socket.id);

    // Listens for the join room method
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room ${data}`);
    })

    // Listens for the send message method
    socket.on("send_message", (data) => {
        console.log("Message sent");
        // We send the message to all the people in that room using the socket.to(room)
        socket.to(data.room).emit("receive_message", data);
    });

    // be able to disconnect - runs when someone tries to disconnect
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
});

server.listen(3001, () => {
    console.log("Server running");
});