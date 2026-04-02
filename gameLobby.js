const roomTitleElement = document.getElementById("id-h1-lobby-title");
const params = new URLSearchParams(window.location.search);
const rawRoomCode = params.get("room") || "----";
const roomCode = rawRoomCode.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4).padEnd(4, "-");

if (roomTitleElement) {
	roomTitleElement.textContent = `Room #${roomCode}`;
}

const lobbyStatusElement = document.getElementById("id-p-lobby-status");

const socket = io();

if (roomCode.length === 4 && !roomCode.includes("-")) {
	socket.emit("register-room", roomCode);
}

socket.on("room-full", () => {
	if (lobbyStatusElement) {
		lobbyStatusElement.textContent = "Both players have connected!";
	}
});

socket.on("player-left", () => {
	if (lobbyStatusElement) {
		lobbyStatusElement.textContent = "Waiting for second player...";
	}
});

const backButton = document.getElementById("id-btn-back");
if (backButton) {
	backButton.addEventListener("click", () => {
		window.location.href = "index.html";
	});
}
