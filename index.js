const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const app = express();

// ==== تنظیم توکن ربات ====8240418030:AAGLcDd3GSfffaP65z7hSmo8kpXy9OWRm7U
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

// ==== آیدی کانال ====
const CHANNEL_ID = "@Entesharan";

// ==== تست ربات ====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "✅ ربات روشنه!\nبرای دیدن قیمت بنویس:\n/price bitcoin"
  );
});

// ==== دریافت قیمت ارز با دستور ====
bot.onText(/\/price (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match[1].toLowerCase();

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;
    const response = await axios.get(url);

    if (!response.data[symbol]) {
      bot.sendMessage(chatId, "⚠️ رمز ارز پیدا نشد! مثل:\n/price bitcoin");
      return;
    }

    const price = response.data[symbol].usd;
    bot.sendMessage(chatId, `💰 قیمت ${symbol.toUpperCase()}: ${price}$`);
  } catch {
    bot.sendMessage(chatId, "❌ خطا در دریافت قیمت!");
  }
});


//setInterval(sendAutoUpdate, 15 * 60 * 1000); // هر ۱۵ دقیقه {
  try {
    const cryptoUrl =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";

    const nftUrl =
      "https://api.coingecko.com/api/v3/simple/price?ids=cryptopunks,bored-ape-yacht-club,mutant-ape-yacht-club,azuki&vs_currencies=usd";

    const [cryptoRes, nftRes] = await Promise.all([
      axios.get(cryptoUrl),
      axios.get(nftUrl),
    ]);

    // قیمت رمزارز
    const btc = cryptoRes.data.bitcoin.usd;
    const eth = cryptoRes.data.ethereum.usd;

    // قیمت NFTها
    const punk = nftRes.data["cryptopunks"].usd;
    const bayc = nftRes.data["bored-ape-yacht-club"].usd;
    const mayc = nftRes.data["mutant-ape-yacht-club"].usd;
    const azuki = nftRes.data["azuki"].usd;

    const message = `
📊 آپدیت خودکار بازار کریپتو و NFT

💰 رمزارزها:
• بیت‌کوین: ${btc}$
• اتریوم: ${eth}$

🖼 NFT Floor Price:
• CryptoPunks: ${punk}$
• BAYC: ${bayc}$
• MAYC: ${mayc}$
• Azuki: ${azuki}$

📢 کانال:
@Entesharan

⏱ آپدیت: ${new Date().toLocaleString()}
    `;

    await bot.sendMessage(CHANNEL_ID, message);
    console.log("✅ آپدیت اتوماتیک ارسال شد");
  } catch (err) {
    console.error("❌ خطا در آپدیت:", err);
  }
}

// هر ۱ ساعت ارسال کن
setInterval(sendAutoUpdate, 60 * 60 * 1000);


// ==== سرور برای Render ====
app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));