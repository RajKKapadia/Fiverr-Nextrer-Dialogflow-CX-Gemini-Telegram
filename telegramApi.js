const axios = require('axios');

const { TELEGRAM_API_KEY } = require('./constant');

const sendMessage = async (chatId, text) => {
    axios.post(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`, {
        chat_id: chatId,
        text: text,
    })
        .then(response => {
            console.log('Message posted');
        })
        .catch(error => {
            console.error(error);
        });
};

module.exports = {
    sendMessage
};
