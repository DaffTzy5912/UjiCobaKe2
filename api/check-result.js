export default function handler(req, res) {
    const { roomId } = req.query;
    if (!roomId || !rooms[roomId] || !rooms[roomId].result) {
        return res.json({ status: "Menunggu hasil..." });
    }

    const result = rooms[roomId].result;
    delete rooms[roomId]; // Hapus data setelah dikirim
    res.json({ result });
}
