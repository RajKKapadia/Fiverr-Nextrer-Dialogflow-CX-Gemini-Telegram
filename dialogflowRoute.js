const express = require('express');

const router = express.Router();

const { generateResponse } = require('./geminiApi');

const formatResponseForDialogflow = (message) => {
    let responseData = {
        fulfillmentResponse: {
            messages: [
                {
                    text: {
                        text: [message],
                        redactedText: [message]
                    },
                    responseType: 'HANDLER_PROMPT',
                    source: 'VIRTUAL_AGENT'
                }
            ],
            mergeBehavior: 'MERGE_BEHAVIOR_UNSPECIFIED'
        }
    };
    return responseData;
};

router.post('/webhook', async (req, res) => {
    const tag = req.body.fulfillmentInfo.tag;
    const query = req.body.text;
    let responseData = {};
    if (tag === 'askGemini') {
        let geminiResponse = await generateResponse(query);
        console.log(geminiResponse);
        responseData = formatResponseForDialogflow(geminiResponse.response);
    } else {
        responseData = formatResponseForDialogflow(`No handler for the tag -> ${tag}.`);
    }
    res.send(responseData);
});

module.exports = {
    router
};
