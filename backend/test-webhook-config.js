require('dotenv').config();
const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

async function testPaymentQuery() {
  const paymentId = '1325326516'; // Último pago del log
  console.log(`🔍 Consultando estado del pago ID: ${paymentId}\n`);
  
  try {
    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });
    
    console.log('PAGO ENCONTRADO:\n');
    console.log('  - ID:', paymentDetails.id);
    console.log('  - Status:', paymentDetails.status, paymentDetails.status === 'approved' ? '✅' : '❌');
    console.log('  - Status Detail:', paymentDetails.status_detail);
    console.log('  - External Reference:', paymentDetails.external_reference);
    console.log('  - Transaction Amount:', paymentDetails.transaction_amount);
    console.log('  - Payment Method:', paymentDetails.payment_method_id);
    console.log('  - Payment Type:', paymentDetails.payment_type_id);
    console.log('  - Date Created:', paymentDetails.date_created);
    console.log('  - Date Approved:', paymentDetails.date_approved);
    console.log('  - Merchant Order ID:', paymentDetails.order?.id);
    
    console.log('\n📊 RESUMEN:');
    if (paymentDetails.status === 'approved') {
      console.log(' EL PAGO FUE APROBADO');
      console.log('✅ El webhook de payment.updated debería haber llegado');
    } else if (paymentDetails.status === 'pending') {
      console.log('⏳ EL PAGO ESTÁ PENDIENTE');
      console.log('ℹ️  El usuario aún no completó el pago');
    } else if (paymentDetails.status === 'rejected') {
      console.log('❌ EL PAGO FUE RECHAZADO');
      console.log('ℹ️  Motivo:', paymentDetails.status_detail);
    } else {
      console.log(`ℹ️  Estado: ${paymentDetails.status}`);
    }
    
  } catch (error) {
    console.error('\n❌ Error consultando pago:', error.message);
    if (error.message === 'Payment not found') {
      console.log('\nℹ️  El pago no existe o fue creado pero nunca procesado');
      console.log('ℹ️  Esto significa que el usuario NO completó el pago en Mercado Pago');
    }
  }
}

testPaymentQuery();
