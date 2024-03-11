const express = require('express');
const axios = require('axios');

const router = express.Router();

const { TELEGRAM_API_KEY } = require('./constant');
const { detectIntentText } = require('./dialoflowApi');
const { sendMessage } = require('./telegramApi');

const handleDialogflowQuery = async (chatId, query) => {
    const detectedIntentTextResponse = await detectIntentText(query, `abcde-fhgij-${chatId}-12345`);
    console.log(detectedIntentTextResponse);
    const messages = detectedIntentTextResponse.responses;
    messages.forEach(async (message) => {
        await sendMessage(chatId, message);
    });
    console.log('Success.');
};

router.post('/webhook', async (req, res) => {
    try {
        console.log('A new message came.')
        const message = req.body.message;
        console.log(JSON.stringify(message, 2, ' '));
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
        const url = `${baseUrl}/telegramWebhook/telegram/webhook`;
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
