const axios = require('axios');

async function e2ePaymentFlow() {
  try {
    // 1. Autenticación y obtención de token JWT
    const login = await axios.post('http://localhost:3001/authorize', {
      user: 'admin',
      password: '1234'
    });
    const token = login.data.token;
    console.log('Token JWT:', token);

    // 2. Tokenizar datos de tarjeta
    const tokenizeRes = await axios.post('http://localhost:3005/tokenize', {
      cardData: { number: '4111111111111111', exp: '12/28', cvv: '123' }
    });
    const cardToken = tokenizeRes.data.token;
    console.log('Token de tarjeta:', cardToken);

    // 3. Crear transacción (pendiente)
    const txRes = await axios.post('http://localhost:3003/transaction', {
      amount: 500,
      currency: 'USD',
      token: cardToken,
      status: 'pending'
    });
    const txId = txRes.data.id;
    console.log('Transacción creada:', txRes.data);

    // 4. Simular integración externa
    const extRes = await axios.post('http://localhost:3004/external', {
      token: cardToken,
      amount: 500,
      currency: 'USD'
    });
    console.log('Respuesta integración externa:', extRes.data);

    // 5. Actualizar estado de la transacción
    const updateRes = await axios.put(`http://localhost:3003/transaction/${txId}`, {
      status: extRes.data.status
    });
    console.log('Transacción actualizada:', updateRes.data);

    // 6. Consultar transacción final
    const finalTx = await axios.get(`http://localhost:3003/transaction/${txId}`);
    console.log('Transacción final:', finalTx.data);

    // 7. Obtener secreto para procesar pagos
    const secretRes = await axios.get('http://localhost:3006/secret/payment-api-key', {
      headers: { Authorization: 'Bearer admin-token' }
    });
    console.log('API Key de pago:', secretRes.data.value);

  } catch (err) {
    console.error('E2E Payment Flow Error:', err.response ? err.response.data : err.message);
  }
}

e2ePaymentFlow();
