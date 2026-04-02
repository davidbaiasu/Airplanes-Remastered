const playersOnlineElement = document.getElementById("id-p-players-online");

if (playersOnlineElement && typeof io === "function") {
    const socket = io();

    socket.on("players-online", (count) => {
        playersOnlineElement.textContent = `Players online: ${count}`;
    });
}
