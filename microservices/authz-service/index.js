const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const SECRET = 'supersecretkey'; // En producción usar Secret Management

// Endpoint para autenticación y generación de token
app.post('/authorize', (req, res) => {
  const { user, password } = req.body;
  if (user === 'admin' && password === '1234') {
    const token = jwt.sign({ user }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

// Middleware para validar token
function verifyToken(req, res, next) {
  const bearer = req.headers['authorization'];
  if (!bearer) return res.status(403).json({ error: 'No token provided' });
  const token = bearer.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded.user;
    next();
  });
}

// Endpoint protegido de ejemplo
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello, ${req.user}` });
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(3001, () => console.log('AuthZ Service running on 3001'));
