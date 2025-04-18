const axios = require('axios');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function e2ePaymentFlow() {
  let passed = 0, failed = 0;
  function reportStep(name, ok, details = '') {
    if (ok) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.error(`❌ ${name} - ${details}`);
      failed++;
    }
  }
  try {
    // 1. Autenticación y obtención de token JWT
    let token = null;
    try {
      const login = await axios.post('http://localhost:3001/authorize', {
        user: 'admin',
        password: '1234'
      });
      token = login.data.token;
      assert(typeof token === 'string' && token.length > 10, 'Token inválido');
      reportStep('AuthZ: Token obtenido', true);
    } catch (e) {
      reportStep('AuthZ: Token obtenido', false, e.message);
      throw e;
    }

    // 2. Tokenizar datos de tarjeta
    let cardToken = null;
    try {
      const tokenizeRes = await axios.post('http://localhost:3005/tokenize', {
        cardData: { number: '4111111111111111', exp: '12/28', cvv: '123' }
      });
      cardToken = tokenizeRes.data.token;
      assert(typeof cardToken === 'string' && cardToken.length > 10, 'Token de tarjeta inválido');
      reportStep('Tokenización: Token generado', true);
    } catch (e) {
      reportStep('Tokenización: Token generado', false, e.message);
      throw e;
    }

    // 3. Crear transacción (pendiente)
    let txId = null;
    try {
      const txRes = await axios.post('http://localhost:3003/transaction', {
        amount: 500,
        currency: 'USD',
        token: cardToken,
        status: 'pending'
      });
      txId = txRes.data.id;
      assert(typeof txId === 'number', 'ID de transacción inválido');
      reportStep('Transacción: Creada', true);
    } catch (e) {
      reportStep('Transacción: Creada', false, e.message);
      throw e;
    }

    // 4. Simular integración externa
    let extStatus = null;
    try {
      const extRes = await axios.post('http://localhost:3004/external', {
        token: cardToken,
        amount: 500,
        currency: 'USD'
      });
      extStatus = extRes.data.status;
      assert(['approved','declined'].includes(extStatus), 'Estado externo inválido');
      reportStep('Integración externa: Respuesta recibida', true);
    } catch (e) {
      reportStep('Integración externa: Respuesta recibida', false, e.message);
      throw e;
    }

    // 5. Actualizar estado de la transacción
    try {
      const updateRes = await axios.put(`http://localhost:3003/transaction/${txId}`, {
        status: extStatus
      });
      assert(updateRes.data.status === extStatus, 'Estado de transacción no actualizado');
      reportStep('Transacción: Estado actualizado', true);
    } catch (e) {
      reportStep('Transacción: Estado actualizado', false, e.message);
      throw e;
    }

    // 6. Consultar transacción final
    try {
      const finalTx = await axios.get(`http://localhost:3003/transaction/${txId}`);
      assert(finalTx.data.status === extStatus, 'Estado final incorrecto');
      reportStep('Transacción: Consulta final', true);
    } catch (e) {
      reportStep('Transacción: Consulta final', false, e.message);
      throw e;
    }

    // 7. Obtener secreto para procesar pagos
    try {
      const secretRes = await axios.get('http://localhost:3006/secret/payment-api-key', {
        headers: { Authorization: 'Bearer admin-token' }
      });
      assert(secretRes.data.value && secretRes.data.value.length > 5, 'API Key inválida');
      reportStep('Secretos: API Key obtenida', true);
    } catch (e) {
      reportStep('Secretos: API Key obtenida', false, e.message);
      throw e;
    }

    console.log('\n---\nResumen de pruebas:');
    console.log(`Pasaron: ${passed}, Fallaron: ${failed}`);
    if (failed === 0) {
      console.log('✅ FLUJO E2E COMPLETADO CON ÉXITO');
    } else {
      console.log('❌ FLUJO E2E CON ERRORES');
    }
  } catch (err) {
    console.error('E2E Payment Flow Error:', err.response ? err.response.data : err.message);
    console.log('❌ FLUJO E2E ABORTADO');
  }
}

e2ePaymentFlow();
