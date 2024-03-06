const express = require('express');
const axios = require('axios');

const router = express.Router();

const { TELEGRAM_API_KEY } = require('./constant');
const { detectIntentText } = require('./dialoflowApi');
const { sendMessage } = require('./telegramApi');

const handleDialogflowQuery = async (chatId, query) => {
    const detectedIntentTextResponse = await detectIntentText(query, `abcde-fhgij-${chatId}-12345`);
    const messages = detectedIntentTextResponse.responses;
    messages.forEach(async (message) => {
        await sendMessage(chatId, message);
    });
};

router.post('/webhook', async (req, res) => {
    const message = req.body.message;
    try {
        if (message && message.text) {
            const chatId = message.chat.id;
            const query = message.text;
            handleDialogflowQuery(chatId, query);
        }
    } catch (error) {
        console.log('Error at /telegram/webhook');
    }
    res.sendStatus(200);
});

router.get('/setWebhook', async (req, res) => {
    try {
        const baseUrl = `${req.protocol}s://${req.get('host')}`;
        const url = `${baseUrl}/telegram/webhook`;
        let options = {
            method: 'POST',
            url: `https://api.telegram.org/bot${TELEGRAM_API_KEY}/setWebhook`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                url: url
            }
        };
        const response = await axios.request(options);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});

module.exports = {
    router
};
