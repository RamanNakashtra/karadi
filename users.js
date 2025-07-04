let adminCoins = 100000;
let players = []; // Example: [{ name: "user1", coins: 5000 }]

export default function handler(req, res) {
  const { name, action, coins } = req.query;
  const amount = parseInt(coins);

  if (!name || !action || isNaN(amount)) {
    return res.status(400).json({ error: "Missing or invalid query parameters." });
  }

  const playerIndex = players.findIndex(p => p.name === name);

  if (action === "create") {
    if (playerIndex !== -1) return res.status(409).json({ error: "Player already exists." });
    if (adminCoins >= amount) {
      players.push({ name, coins: amount });
      adminCoins -= amount;
      return res.status(201).json({ message: `Player ${name} created`, adminCoins, players });
    } else {
      return res.status(400).json({ error: "Not enough coins in admin wallet." });
    }
  }

  if (action === "deposit") {
    if (playerIndex === -1) return res.status(404).json({ error: "Player not found." });
    if (adminCoins >= amount) {
      players[playerIndex].coins += amount;
      adminCoins -= amount;
      return res.status(200).json({ message: `Deposited ₹${amount}`, adminCoins, players });
    } else {
      return res.status(400).json({ error: "Admin doesn't have enough coins." });
    }
  }

  if (action === "withdraw") {
    if (playerIndex === -1) return res.status(404).json({ error: "Player not found." });
    if (players[playerIndex].coins >= amount) {
      players[playerIndex].coins -= amount;
      adminCoins += amount;
      return res.status(200).json({ message: `Withdrawn ₹${amount}`, adminCoins, players });
    } else {
      return res.status(400).json({ error: "Player doesn't have enough coins." });
    }
  }

  if (action === "list") {
    return res.status(200).json({ adminCoins, players });
  }

  return res.status(400).json({ error: "Invalid action." });
}
