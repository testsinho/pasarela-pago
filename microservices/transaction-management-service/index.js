const express = require('express');
const app = express();
app.use(express.json());

let transactions = [];
let idCounter = 1;

// Crear transacción
app.post('/transaction', (req, res) => {
  const { amount, currency, token, status } = req.body;
  const tx = { id: idCounter++, amount, currency, token, status };
  transactions.push(tx);
  res.json(tx);
});

// Consultar transacción
app.get('/transaction/:id', (req, res) => {
  const tx = transactions.find(t => t.id == req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
});

// Actualizar transacción
app.put('/transaction/:id', (req, res) => {
  const tx = transactions.find(t => t.id == req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  Object.assign(tx, req.body);
  res.json(tx);
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3003, () => console.log('Transaction Management Service on 3003'));
