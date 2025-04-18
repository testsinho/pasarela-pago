const axios = require('axios');

async function testTokenization() {
  try {
    // Tokenizar datos
    const tokenizeRes = await axios.post('http://localhost:3005/tokenize', {
      cardData: { number: '4111111111111111', exp: '12/28', cvv: '123' }
    });
    console.log('Token generado:', tokenizeRes.data.token);

    // Detokenizar
    const detokenizeRes = await axios.post('http://localhost:3005/detokenize', {
      token: tokenizeRes.data.token
    });
    console.log('Datos originales:', detokenizeRes.data.cardData);
  } catch (err) {
    console.error('Tokenization Test Error:', err.response ? err.response.data : err.message);
  }
}

testTokenization();
