const express = require('express');
const app = express();
const port = 5000;

app.get('/translate', (req, res) => {
  // Handle translation logic here
  res.send('Translation endpoint');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
