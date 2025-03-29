const rooms = {}; // Menyimpan status permainan

export default function handler(req, res) {
    const { roomId, playerId, choice } = req.query;

    if (!roomId || !playerId) {
        return res.json({ error: "Permintaan tidak valid" });
    }

    // Buat room jika belum ada
    if (!rooms[roomId]) {
        rooms[roomId] = { creator: playerId, players: [], choices: {}, result: "" };
    }

    // Tambahkan pemain ke room jika belum ada
    if (!rooms[roomId].players.includes(playerId)) {
        rooms[roomId].players.push(playerId);
    }

    // Simpan pilihan pemain jika ada
    if (choice) {
        rooms[roomId].choices[playerId] = choice;
    }

    const players = rooms[roomId].players;
    const choices = rooms[roomId].choices;

    // Jika belum ada dua pemain, kembalikan status menunggu
    if (players.length < 2) {
        return res.json({
            status: "Menunggu pemain lain...",
            isCreator: playerId === rooms[roomId].creator,
            players: players,
            choices: choices || {},
        });
    }

    // Jika sudah ada dua pemain tetapi belum semua memilih
    if (Object.keys(choices).length < 2) {
        return res.json({
            status: "Menunggu lawan memilih...",
            isCreator: playerId === rooms[roomId].creator,
            players: players,
            choices: choices || {},
        });
    }

    // Jika sudah ada dua pilihan, tentukan hasilnya
    if (!rooms[roomId].result) {
        const [player1, player2] = Object.keys(choices);
        const choice1 = choices[player1];
        const choice2 = choices[player2];

        let result = "";

        if (choice1 === choice2) {
            result = "Seri!";
        } else if (
            (choice1 === "rock" && choice2 === "scissors") ||
            (choice1 === "scissors" && choice2 === "paper") ||
            (choice1 === "paper" && choice2 === "rock")
        ) {
            result = `${player1} menang! ${player2} kalah.`;
        } else {
            result = `${player2} menang! ${player1} kalah.`;
        }

        rooms[roomId].result = result;
    }

    // Kirim hasil pertandingan ke kedua pemain
    res.json({
        result: rooms[roomId].result || "",
        isCreator: playerId === rooms[roomId].creator,
        players: players || [],
        choices: choices || {},
    });

    // Reset room setelah 5 detik untuk game baru
    setTimeout(() => {
        delete rooms[roomId];
    }, 5000);
}
