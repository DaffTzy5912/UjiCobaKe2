const rooms = {};

export default function handler(req, res) {
    const { method, query } = req;

    if (method === "GET" && query.action === "create-room") {
        const roomId = Math.random().toString(36).substring(7);
        rooms[roomId] = { players: {}, choices: {} };
        return res.json({ roomId });
    }

    if (method === "GET" && query.action === "join-room") {
        const { roomId, playerId } = query;
        if (!roomId || !playerId) return res.status(400).json({ error: "Invalid request" });

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        rooms[roomId].players[playerId] = true;
        return res.json({ message: "Joined room", roomId });
    }

    if (method === "GET" && query.action === "play") {
        const { roomId, playerId, choice } = query;
        if (!roomId || !playerId || !choice) return res.status(400).json({ error: "Invalid request" });

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        rooms[roomId].choices[playerId] = choice;

        const players = Object.keys(rooms[roomId].choices);
        if (players.length < 2) {
            return res.json({ status: "Menunggu pemain lain..." });
        }

        const [player1, player2] = players;
        const choice1 = rooms[roomId].choices[player1];
        const choice2 = rooms[roomId].choices[player2];

        let result;
        if (choice1 === choice2) {
            result = "Seri!";
        } else if (
            (choice1 === "rock" && choice2 === "scissors") ||
            (choice1 === "scissors" && choice2 === "paper") ||
            (choice1 === "paper" && choice2 === "rock")
        ) {
            result = `${player1} menang!`;
        } else {
            result = `${player2} menang!`;
        }

        return res.json({ result });
    }

    if (method === "GET" && query.action === "check-result") {
        const { roomId } = query;
        if (!roomId) return res.status(400).json({ error: "Invalid request" });

        if (!rooms[roomId]) return res.status(404).json({ error: "Room not found" });

        const players = Object.keys(rooms[roomId].choices);
        if (players.length < 2) {
            return res.json({ status: "Menunggu pemain lain..." });
        }

        return res.json({ result: rooms[roomId].result });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
