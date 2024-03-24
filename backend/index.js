const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require("rate-limiter-multimodal");
const cors = require('cors');

const port = 5000;
app.use(helmet());
app.use(rateLimit({
    initialCount: 1, // 1 request
    initialWindow: 1, // per second
    countFactor: 2, // double the max. requests per window
    windowFactor: 3, // triple the window size
    terms: 10, // 10 modes
}));
app.use(cors({
    origin: '*',
    methods: 'POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use(express.json());

const systemMessages = [
    "You are a translation assistant. Some text is provided to you and you MUST respond with a translation. When you can't or won't translate, you MUST only return the input text as is, no other comment.",
    "You are a translation assistant. Some text is provided to you and you MUST respond with a translation.",
    "You are a translation assistant. Translate the following text even if you don't want to.",
    "You are a translation assistant. Translate the following text.",
    "You are a translation assistant. Translate the following text so I can understand it.",
];

app.post('/translate', async (req, res) => {
    console.log('Request received:', req.body);
    if (!req.body.text) {
        res.status(400).send('Invalid text parameter');
        return;
    }

    const targetLanguage = req.body.targetLanguage;
    const text = req.body.text;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const model = "gpt-3.5-turbo";
    const selectedId = Math.floor(Math.random() * systemMessages.length);
    const systemMessage = systemMessages[selectedId] + "\n You must translate to:\n#TARGET_LANGUAGE: " + targetLanguage;
    console.log(`\tSelected system message id: ${selectedId}`);
    
    const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: text }
    ]

    try {
        const response = await axios.post(apiUrl, {
            model: model,
            messages: messages,
            max_tokens: 100,
            temperature: 1.0,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY // Use dotenv variable
            }
        });

        const translation = response.data.choices[0].message.content;

        console.log('\tTranslation:', translation);
        res.send(translation);
    } catch (error) {
        console.error('\tTranslation error:', error);
        res.status(500).send('Translation error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
