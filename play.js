const rooms = {}; // Menyimpan data room dan pilihan pemain

export default function handler(req, res) {
    const { roomId, player, choice } = req.query;

    if (!roomId || !player || !choice) {
        return res.json({ result: "Invalid request" });
    }

    if (!rooms[roomId]) {
        rooms[roomId] = {};
    }

    rooms[roomId][player] = choice;

    // Cek apakah kedua pemain sudah memilih
    const players = Object.keys(rooms[roomId]);
    if (players.length < 2) {
        return res.json({ result: "Menunggu pemain lain..." });
    }

    // Dapatkan pilihan kedua pemain
    const [player1, player2] = players;
    const choice1 = rooms[roomId][player1];
    const choice2 = rooms[roomId][player2];

    // Tentukan pemenang
    let result = "";
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

    // Hapus room setelah selesai (agar tidak penuh)
    delete rooms[roomId];

    res.json({ result, player1: choice1, player2: choice2 });
}
