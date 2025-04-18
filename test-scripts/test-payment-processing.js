const axios = require('axios');

async function testPaymentProcessing() {
  try {
    // Procesar un pago
    const response = await axios.post('http://localhost:3002/process', {
      cardData: {
        number: '4111111111111111',
        exp: '12/28',
        cvv: '123'
      },
      amount: 500,
      currency: 'USD'
    });
    console.log('Payment Result:', response.data);
  } catch (err) {
    console.error('Payment Processing Test Error:', err.response ? err.response.data : err.message);
  }
}

testPaymentProcessing();
