const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// === تنظیم توکن ربات ===
// توکن رباتی که BotFather بهت داده رو اینجا قرار بده
const TOKEN = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";

// === ساخت ربات با متد polling ===
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "ربات فعال است ✅");
});

// سرور برای Render
app.get("/", (req, res) => {
  res.send("NFT Bot Server is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});