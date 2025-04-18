const express = require('express');
const app = express();
app.use(express.json());

const secrets = {
  'payment-api-key': 'PAYMENT-KEY-123',
  'jwt-secret': 'supersecretkey',
};

// Obtener secreto (requiere autenticación por header)
app.get('/secret/:key', (req, res) => {
  const auth = req.headers['authorization'];
  if (auth !== 'Bearer admin-token') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const value = secrets[req.params.key];
  if (!value) return res.status(404).json({ error: 'Not found' });
  res.json({ value });
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3006, () => console.log('Secret Management Service on 3006'));
