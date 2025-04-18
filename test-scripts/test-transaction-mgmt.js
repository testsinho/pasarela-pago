const axios = require('axios');

async function testTransactionMgmt() {
  try {
    // Crear transacción
    const createRes = await axios.post('http://localhost:3003/transaction', {
      amount: 500,
      currency: 'USD',
      token: 'tok_abc',
      status: 'pending'
    });
    console.log('Transacción creada:', createRes.data);

    // Consultar transacción
    const getRes = await axios.get(`http://localhost:3003/transaction/${createRes.data.id}`);
    console.log('Transacción consultada:', getRes.data);

    // Actualizar transacción
    const updateRes = await axios.put(`http://localhost:3003/transaction/${createRes.data.id}`, {
      status: 'approved'
    });
    console.log('Transacción actualizada:', updateRes.data);
  } catch (err) {
    console.error('Transaction Mgmt Test Error:', err.response ? err.response.data : err.message);
  }
}

testTransactionMgmt();
