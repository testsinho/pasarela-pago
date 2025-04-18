const express = require('express');
const app = express();
app.use(express.json());

// Simular integración con procesador externo
app.post('/external', (req, res) => {
  const { token, amount, currency } = req.body;
  // Simulación: si el monto es menor a 1000, éxito; si no, falla
  if (amount < 1000) {
    res.json({ status: 'approved', processorId: 'EXT123' });
  } else {
    res.json({ status: 'declined', processorId: 'EXT999' });
  }
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3004, () => console.log('External Integration Service on 3004'));
