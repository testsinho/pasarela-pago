const axios = require('axios');

async function testExternalIntegration() {
  try {
    // Simular integración externa
    const response = await axios.post('http://localhost:3004/external', {
      token: 'tok_abc',
      amount: 500,
      currency: 'USD'
    });
    console.log('Respuesta integración externa:', response.data);
  } catch (err) {
    console.error('External Integration Test Error:', err.response ? err.response.data : err.message);
  }
}

testExternalIntegration();
