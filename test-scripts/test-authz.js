const axios = require('axios');

async function testAuthz() {
  try {
    // 1. Obtener token
    const login = await axios.post('http://localhost:3001/authorize', {
      user: 'admin',
      password: '1234'
    });
    console.log('Token:', login.data.token);

    // 2. Acceder a endpoint protegido
    const protectedRes = await axios.get('http://localhost:3001/protected', {
      headers: { Authorization: `Bearer ${login.data.token}` }
    });
    console.log('Protected:', protectedRes.data);
  } catch (err) {
    console.error('AuthZ Test Error:', err.response ? err.response.data : err.message);
  }
}

testAuthz();
