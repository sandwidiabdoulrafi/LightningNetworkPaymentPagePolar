const axios = require('axios');
const https = require('https');
const fs = require('fs');

// Charger le certificat TLS et le macaroon
const lndCert = fs.readFileSync('C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\tls.cert');
const macaroon = fs.readFileSync('C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\data\\chain\\bitcoin\\regtest\\admin.macaroon').toString('hex');

// Créer une instance Axios avec les configurations nécessaires
const client = axios.create({
  baseURL: 'https://127.0.0.1:8084/v1',
  headers: { 'Grpc-Metadata-macaroon': macaroon },
  httpsAgent: new https.Agent({ 
    ca: lndCert 
  })
});

// Créer une facture
const createInvoice = async () => {
  try {
    const response = await client.post('/invoices', {
      value: 1000, // Montant en satoshis
      memo: 'Test Payment'
    });
    return response.data.payment_request;
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
  }
};

// Payer la facture
const payInvoice = async (paymentRequest) => {
  try {
    const response = await client.post('/channels/transactions', {
      payment_request: paymentRequest
    });
    console.log('Résultat du paiement:', response.data);
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
  }
};

// Créer une facture et la payer
createInvoice().then(paymentRequest => {
  payInvoice(paymentRequest);
});
