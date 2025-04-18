const axios = require('axios');

async function testSecretMgmt() {
  try {
    // Obtener secreto (requiere autorización)
    const response = await axios.get('http://localhost:3006/secret/payment-api-key', {
      headers: { Authorization: 'Bearer admin-token' }
    });
    console.log('Secreto obtenido:', response.data.value);
  } catch (err) {
    console.error('Secret Mgmt Test Error:', err.response ? err.response.data : err.message);
  }
}

testSecretMgmt();
