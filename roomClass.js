class Room {

    roomId = null;
    peopleInside  = 0;

    constructor(roomId = Room.generateRandomCode()) {
        if (!Room.isValidRoomId(roomId)) {
            throw new Error("Invalid room code. Expected 4 letters.");
        }

        this.roomId = roomId;
    }

    static generateRandomCode() {
        let roomCode = "";

        for (let i = 0; i < 4; i++) {
            roomCode += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }

        return roomCode;
    }

    static isValidRoomId(roomId) {
        return /^[A-Z]{4}$/.test(roomId);
    }

    toLobbyUrl() {
        return `gameLobby.html?room=${encodeURIComponent(this.roomId)}`;
    }

}