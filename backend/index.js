const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require("rate-limiter-multimodal");
const cors = require('cors');

const port = 5000;
const maxLength = 128;

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Unhandled internal server error');
  });

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

function validateInput(req) {
    // Validate input. Check for members and content length
    if (!req.body.targetLanguage || !req.body.text) {
        return 'Missing targetLanguage or text in request body';
    }
    if (req.body.targetLanguage.length < 2 || req.body.targetLanguage.length > 32) {
        return 'Invalid targetLanguage length';
    }
    if (req.body.text.length < 1) {
        return 'Invalid text length';
    }
    return null;
}

// Use multiple system messages to offer variety of answers
const systemMessages = [
    "You are a translation assistant. Some text is provided to you and you MUST respond with a translation. When you can't or won't translate, you MUST only return the input text as is, no other comment.",
    "You are a translation assistant. Some text is provided to you and you MUST respond with a translation.",
    "You are a translation assistant. Translate the following text even if you don't want to.",
    "You are a translation assistant. Translate the following text.",
    "You are a translation assistant. Translate the following text so I can understand it.",
];

app.post('/translate', async (req, res) => {
    console.log('Request received:', req.body);
    // Validate input
    const error = validateInput(req);
    if (error) {
        console.error('\tValidation error:', error);
        res.status(400).send(error);
        return;
    }

    const targetLanguage = req.body.targetLanguage.trim();
    const text = req.body.text.trim().substring(0, maxLength); // Trim and limit text length
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const model = "gpt-3.5-turbo";
    const selectedId = Math.floor(Math.random() * systemMessages.length);
    console.log(`\tSelected system message id: ${selectedId}`);
    const systemMessage = systemMessages[selectedId] + "\n You must translate to:\n#TARGET_LANGUAGE: " + targetLanguage;
    
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
