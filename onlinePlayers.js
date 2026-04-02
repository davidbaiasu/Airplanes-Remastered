const playersOnlineElement = document.getElementById("id-p-players-online");
const roomCodeInput = document.getElementById("id-input-room-code");
const createButton = document.getElementById("id-btn-create");
const joinButton = document.getElementById("id-btn-join");

const socket = io();

if (roomCodeInput) {
    roomCodeInput.addEventListener("input", () => {
        roomCodeInput.value = roomCodeInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    });
}

if (createButton) {
    createButton.addEventListener("click", () => {
        const room = new Room();
        socket.emit("create-room", room.roomId, ({ success }) => {
            if (success) {
                window.location.href = room.toLobbyUrl();
            }
        });
    });
}

if (joinButton) {
    joinButton.addEventListener("click", () => {
        const code = roomCodeInput ? roomCodeInput.value : "";
        if (!Room.isValidRoomId(code)) return;
        socket.emit("join-room", code, ({ success, reason }) => {
            if (success) {
                window.location.href = new Room(code).toLobbyUrl();
            } else if (reason === "full") {
                alert("Room is full.");
            } else {
                alert("No room found.");
            }
        });
    });
}

socket.on("players-online", (count) => {
    if (playersOnlineElement) {
        playersOnlineElement.textContent = `Players online: ${count}`;
    }
});
