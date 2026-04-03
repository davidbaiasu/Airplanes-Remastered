const path = require("path");
const os = require("os");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
let playersOnline = 0;
const rooms = new Map(); // roomId -> player count

function getLanIpv4Addresses() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const networkDetails of Object.values(interfaces)) {
        if (!networkDetails) continue;

        for (const detail of networkDetails) {
            if (detail.family === "IPv4" && !detail.internal) {
                addresses.push(detail.address);
            }
        }
    }

    return [...new Set(addresses)];
}

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
    playersOnline += 1;
    io.emit("players-online", playersOnline);

    socket.on("create-room", (roomId, callback) => {
        rooms.set(roomId, 0);
        callback({ success: true });
    });

    socket.on("join-room", (roomId, callback) => {
        const count = rooms.get(roomId);
        if (count === undefined) {
            callback({ success: false, reason: "not-found" });
        } else if (count >= 2) {
            callback({ success: false, reason: "full" });
        } else {
            callback({ success: true });
        }
    });

    socket.on("register-room", (roomId) => {
        socket.joinedRoom = roomId;
        socket.join(roomId);
        const count = (rooms.get(roomId) ?? 0) + 1;
        rooms.set(roomId, count);
        if (count === 2) {
            io.to(roomId).emit("room-full");
        }
    });

    socket.on("start-game", (roomId) => {
        io.to(roomId).emit("game-started");
    });

    socket.on("disconnect", () => {
        playersOnline = Math.max(0, playersOnline - 1);
        io.emit("players-online", playersOnline);
        if (socket.joinedRoom) {
            const count = (rooms.get(socket.joinedRoom) ?? 1) - 1;
            if (count <= 0) {
                rooms.delete(socket.joinedRoom);
            } else {
                rooms.set(socket.joinedRoom, count);
                io.to(socket.joinedRoom).emit("player-left");
            }
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Airplanes LAN server running at http://localhost:${PORT}`);

    const lanAddresses = getLanIpv4Addresses();
    if (lanAddresses.length > 0) {
        console.log("Open one of these links on other laptops in the same Wi-Fi:");
        for (const ipAddress of lanAddresses) {
            console.log(`- http://${ipAddress}:${PORT}`);
        }
    } else {
        console.log("No LAN IPv4 address detected. Other devices may not be able to connect.");
    }
});
