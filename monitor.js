require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const URL = "http://localhost:7000/health";

async function checkHealth() {
    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            console.log(`[✅] API Online: ${response.status}`);
        } else {
            sendAlert(`⚠️ ALERTA: A API retornou status ${response.status}`);
        }
    } catch (error) {
        sendAlert(`❌ ALERTA: A API redem back está fora do ar!\nErro: ${error.message}`);
    }
}

async function sendAlert(message) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message
        });
        console.log("[🚀] Alerta enviado para o Telegram!");
    } catch (err) {
        console.error("[❌] Erro ao enviar alerta para o Telegram:", err.message);
    }
}

// Verificar a cada 5 minutos
cron.schedule('*/5 * * * *', () => {
    console.log("🔍 Verificando status da API...");
    checkHealth();
});
