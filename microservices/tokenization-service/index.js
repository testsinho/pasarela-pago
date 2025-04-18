const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const tokenMap = {};

// Tokenizar datos sensibles
app.post('/tokenize', (req, res) => {
  const { cardData } = req.body;
  const token = uuidv4();
  tokenMap[token] = cardData;
  res.json({ token });
});

// Detokenizar
app.post('/detokenize', (req, res) => {
  const { token } = req.body;
  const cardData = tokenMap[token];
  if (!cardData) return res.status(404).json({ error: 'Token not found' });
  res.json({ cardData });
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3005, () => console.log('Tokenization Service on 3005'));
