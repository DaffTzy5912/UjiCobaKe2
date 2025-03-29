const rooms = {}; // Simpan room dan pemainnya

export default function handler(req, res) {
    const { roomId, playerName, choice } = req.query;

    if (!roomId || !playerName || !choice) {
        return res.json({ error: "Permintaan tidak valid" });
    }

    if (!rooms[roomId]) {
        rooms[roomId] = { players: {}, choices: {} };
    }

    // Simpan nama pemain dan pilihan suit mereka
    rooms[roomId].players[playerName] = true;
    rooms[roomId].choices[playerName] = choice;

    const playerNames = Object.keys(rooms[roomId].choices);

    if (playerNames.length < 2) {
        return res.json({ status: "Menunggu pemain lain..." });
    }

    // Jika kedua pemain sudah memilih, tentukan hasilnya
    const [p1, p2] = playerNames;
    const choice1 = rooms[roomId].choices[p1];
    const choice2 = rooms[roomId].choices[p2];

    let result1 = "";
    let result2 = "";

    if (choice1 === choice2) {
        result1 = result2 = "Seri!";
    } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "scissors" && choice2 === "paper") ||
        (choice1 === "paper" && choice2 === "rock")
    ) {
        result1 = `Kamu menang! (${p1} vs ${p2})`;
        result2 = `Kamu kalah! (${p2} vs ${p1})`;
    } else {
        result1 = `Kamu kalah! (${p1} vs ${p2})`;
        result2 = `Kamu menang! (${p2} vs ${p1})`;
    }

    // Kirim hasil pertandingan ke kedua pemain
    res.json({
        results: {
            [p1]: result1,
            [p2]: result2
        }
    });

    // Reset room setelah pertandingan selesai
    delete rooms[roomId];
}
