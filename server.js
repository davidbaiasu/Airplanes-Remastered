const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
let playersOnline = 0;

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
    playersOnline += 1;
    io.emit("players-online", playersOnline);

    socket.on("disconnect", () => {
        playersOnline = Math.max(0, playersOnline - 1);
        io.emit("players-online", playersOnline);
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Airplanes LAN server running at http://localhost:${PORT}`);
});
