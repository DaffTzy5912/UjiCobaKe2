const rooms = {}; // Menyimpan status permainan

export default function handler(req, res) {
    const { roomId, playerId, choice } = req.query;

    if (!roomId || !playerId) {
        return res.json({ error: "Permintaan tidak valid" });
    }

    // Buat room jika belum ada
    if (!rooms[roomId]) {
        rooms[roomId] = { players: {}, choices: {}, result: "" };
    }

    // Simpan pilihan pemain
    if (choice) {
        rooms[roomId].choices[playerId] = choice;
    }

    const choices = Object.values(rooms[roomId].choices);

    if (choices.length < 2) {
        return res.json({ status: "Menunggu pemain lain..." });
    }

    // Jika sudah ada dua pilihan, tentukan hasilnya
    if (!rooms[roomId].result) {
        const [player1, player2] = Object.keys(rooms[roomId].choices);
        const choice1 = rooms[roomId].choices[player1];
        const choice2 = rooms[roomId].choices[player2];

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
    res.json({ result: rooms[roomId].result });

    // Reset room setelah 5 detik untuk game baru
    setTimeout(() => {
        delete rooms[roomId];
    }, 5000);
}
