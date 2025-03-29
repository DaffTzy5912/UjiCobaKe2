const rooms = {}; // Menyimpan status permainan

export default function handler(req, res) {
    const { roomId, playerId, choice } = req.query;

    if (!roomId || !playerId || !choice) {
        return res.json({ error: "Permintaan tidak valid" });
    }

    if (!rooms[roomId]) {
        rooms[roomId] = { players: {}, choices: {} };
    }

    // Simpan pilihan pemain
    rooms[roomId].choices[playerId] = choice;

    const choices = Object.values(rooms[roomId].choices);

    if (choices.length < 2) {
        return res.json({ status: "Menunggu pemain lain..." });
    }

    // Jika sudah ada dua pilihan, tentukan hasilnya
    const [choice1, choice2] = choices;
    let result = "";

    if (choice1 === choice2) {
        result = "Seri!";
    } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "scissors" && choice2 === "paper") ||
        (choice1 === "paper" && choice2 === "rock")
    ) {
        result = "Pemain 1 menang!";
    } else {
        result = "Pemain 2 menang!";
    }

    // Kirim hasil pertandingan
    res.json({ result, choices: rooms[roomId].choices });

    // Reset room setelah pertandingan selesai
    delete rooms[roomId];
}
