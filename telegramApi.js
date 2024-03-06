const axios = require('axios');

const { TELEGRAM_API_KEY } = require('./constant');

const sendMessage = async (chatId, text) => {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`, {
        chat_id: chatId,
        text: text,
    });
    console.log(response.data);
};

module.exports = {
    sendMessage
};
