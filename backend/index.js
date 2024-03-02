const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.get('/translate', async (req, res) => {
    console.log('Request received:', req.query.text);

    const text = req.query.text;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const model = "gpt-3.5-turbo";
    const messages = [
        { role: 'system', content: 'You are a translation assistant. Users provide you some text and you respond with the most likely translation.\n#TARGET_LANGUAGE: ENGLISH' },
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

        const translation = response.data.choices[0].text.trim();
        
        console.log('Translation:', translation);
        res.send(translation);
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).send('Translation error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
