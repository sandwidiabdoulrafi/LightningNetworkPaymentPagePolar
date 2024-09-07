// const axios = require('axios');
// const fs = require('fs');
// const https = require('https');

// const tlsCertPath = 'C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\tls.cert';
// const adminMacaroonPath = 'C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\data\\chain\\bitcoin\\regtest\\admin.macaroon';


// const tlsCert = fs.readFileSync(tlsCertPath);
// const adminMacaroon = fs.readFileSync(adminMacaroonPath);

// const instance = axios.create({
//     baseURL: 'https://127.0.0.1:8084', // Remplacez par l'URL de votre nœud Lightning
//     headers: {
//         'Grpc-Metadata-macaroon': adminMacaroon.toString('base64'),
//     },
//     httpsAgent: new https.Agent({
//         cert: tlsCert,
//         rejectUnauthorized: false,
//     }),
// });

// // Exemple de requête pour obtenir les informations du nœud
// instance.get('/v1/getinfo')
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         console.error(error);
//     });





const lndconnect = require('lndconnect');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

// L'URI LNDConnect que vous avez générée manuellement
const lndConnectUri = "lndconnect://127.0.0.1:10004?cert=MIICOTCCAd6gAwIBAgIRAOaEEI_P8k0YgstxsOx-VQQwCgYIKoZIzj0EAwIwMDEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDENMAsGA1UEAxMEUmFmaTAeFw0yNDA4MjgyMjQ4NTRaFw0yNTEwMjMyMjQ4NTRaMDAxHzAdBgNVBAoTFmxuZCBhdXRvZ2VuZXJhdGVkIGNlcnQxDTALBgNVBAMTBFJhZmkwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAARMSnr3lfuHPrxwed-dFfqEIvrB-cpRc5iV3aFBg86s1JLjp28rqOqCR8oQCxSfQX1nZAA9oJdE_xHLz6cxWEUeo4HYMIHVMA4GA1UdDwEB_wQEAwICpDATBgNVHSUEDDAKBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH_MB0GA1UdDgQWBBQf4CZGkBvX3Ac1Hpdta0RjYlivhTB-BgNVHREEdzB1ggRSYWZpgglsb2NhbGhvc3SCBFJhZmmCDXBvbGFyLW4xLVJhZmmCFGhvc3QuZG9ja2VyLmludGVybmFsggR1bml4ggp1bml4cGFja2V0ggdidWZjb25uhwR_AAABhxAAAAAAAAAAAAAAAAAAAAABhwSsEgAEMAoGCCqGSM49BAMCA0kAMEYCIQDoW-v1bE_XsxVBfHoWQnf25aI4y-oMht-BTtzWnEIGYgIhAJkoWQeDBavy-I5Xh6QR9uUfYOxBhuunxYMPvVp-ZFKZ&macaroon=AgEDbG5kAvgBAwoQaT7YQUubrFHkwHa8qodYhBIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg6KBQPAZ_JTOcv4apvZ5Q7WqrqTuUb832LaeNprMI6BE";

// Parser l'URI pour obtenir les informations de connexion
const lndConnectData = lndconnect.parse(lndConnectUri);

console.log("les informations de connexion",lndConnectData);




// Charger le proto de LND
const packageDefinition = protoLoader.loadSync(lndConnectData.proto, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});




const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;
console.log("Charger le proto de LND",lnrpc);

// Créer un canal sécurisé avec les informations LNDConnect
const lnd = new lnrpc.Lightning(lndConnectData.host, grpc.credentials.createSsl(
    fs.readFileSync(lndConnectData.cert), // Chargement du certificat TLS
    null,
    fs.readFileSync(lndConnectData.macaroon) // Chargement du macaroon
));

// Exemple : Obtenir des informations de base sur le nœud
lnd.getInfo({}, (err, response) => {
    if (err) {
        console.error("Erreur lors de la connexion à LND:", err);
    } else {
        console.log("Info du nœud:", response);
    }
});



// -------------------------------------------------------------------------------------------------------------------


// const Lightning = require('lightning');


// // Configuration du client LND
// const lnd = new Lightning({
//   lndHost: '127.0.0.1',
//   lndPort: 10004,
//   certPath: 'C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\tls.cert',
//   macaroonPath: 'C:\\Users\\User\\.polar\\networks\\1\\volumes\\lnd\\Rafi\\data\\chain\\bitcoin\\regtest\\admin.macaroon',
// });

// // Établissement de la connexion
// lnd.connect()
//   .then(() => {
//     console.log('Connecté au nœud Polar !');

//     // Exemple d'appel RPC pour obtenir l'état du nœud
//     lnd.getInfo()
//       .then(info => {
//         console.log('Informations du nœud :', info);
//       })
//       .catch(error => {
//         console.error('Erreur lors de l\'appel RPC :', error);
//       });
//   })
//   .catch(error => {
//     console.error('Erreur de connexion :', error);
//   });

