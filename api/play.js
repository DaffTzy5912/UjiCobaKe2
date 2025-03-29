const rooms = {};

export default function handler(req, res) {
    const { roomId, choice } = req.query;
    if (!roomId || !choice) return res.json({ result: "Invalid request" });

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = "";
    if (choice === botChoice) {
        result = "Seri!";
    } else if (
        (choice === "rock" && botChoice === "scissors") ||
        (choice === "scissors" && botChoice === "paper") ||
        (choice === "paper" && botChoice === "rock")
    ) {
        result = "Kamu menang!";
    } else {
        result = "Kamu kalah!";
    }

    res.json({ result, botChoice });
}
