// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const fs = require("fs");
// const os = require("os");
// const path = require("path");

// // Configuration des suites de chiffrement pour gRPC
// process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

// // Options pour le proto-loader
// const loaderOptions = {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// };
// const packageDefinition = protoLoader.loadSync('lightning.proto', loaderOptions);

// // Correction du chemin du fichier `tls.cert` en utilisant `path.join`
// const certPath = path.join(os.homedir(), ".polar", "networks", "1", "volumes", "lnd", "Rafi", "tls.cert");
// const macaroonPath = path.join(os.homedir(), ".polar", "networks", "1", "volumes", "lnd", "Rafi", "data", "chain", "bitcoin", "regtest", "admin.macaroon");


// let lndCert = fs.readFileSync(certPath);

// let macaroon = fs.readFileSync(macaroonPath).toString('hex'); // Convertir le macaroon en format hexadécimal

// // Créer des métadonnées pour inclure le macaron dans la requête gRPC
// const metadata = new grpc.Metadata();
// metadata.add('macaroon', macaroon);

// // Utiliser les credentials SSL et le macaroon
// const credentials = grpc.credentials.combineChannelCredentials(
//     grpc.credentials.createSsl(lndCert),
//     grpc.credentials.createFromMetadataGenerator((_, callback) => {
//         callback(null, metadata);
//     })
// );

// const lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
// const  lnrpc = lnrpcDescriptor.lnrpc;


// // ceration d'une session 

// const lightning = new lnrpc.Lightning('127.0.0.1:10005', credentials);




// //  affichage des informations du noeud connecter
// lightning.getInfo({}, (err, response) => {
//     if (err) {
//         console.error("Erreur lors de la connexion à LND :", err);
//     } else {
//         console.log("-----------------------------CONNEXION AU NOEUD  QUI EST SUR LE  RESEAU DE POLAR RUISSI--------------------------------------\n\n");
//         // console.log("Informations sur le nœud : ", response);
//     }
// });













// // faire un payement 

// const addressCli = 'lnbcrt500u1pnwejaupp5476v6hwemzqg88ahvwa8ladmn2jha45dvqfezh3u4m3pzrsnf6kqdqu2pshjmt9de6zqar0ypskc6tdv9hqsp5ww65ty0szevakcr0ck22mrj84xldxhsywyllrytpsnw6de7jx40qmqz9gxqrrsscqp79q2sqqqqqysgq9fkkgf9jmlv7v28ayrgsheq0fnu9gtuft9ls0v0f98xscvpgy7fxxlna7z5jqkyfryvyvuujwekj26dwl03gk28lgu3y4jaxuvetahgqv74tvr';


// const payment_hash = 0;

// let request = {
//     payment_request: addressCli,  // Remplace par une invoice valide générée par le destinataire
//   };
  
//   lightning.sendPaymentSync(request, function(err, response) {
//     if (err) {
//       console.error("Erreur lors du paiement :", err);
//     } else {
//       console.log("Réponse du paiement :", response);
//     }
//   });





//   // On suppose que tu as déjà initialisé ta connexion à l'API gRPC
// const invoice = {
//     value: 50000  // Le montant en satoshis que tu veux demander
//   };
  
//   lightning.addInvoice(invoice, (err, response) => {
//     if (err) {
//       console.error("Erreur lors de la génération de la facture :", err);
//     } else {
//       console.log("Invoice générée :", response);
//       console.log("Payment Request (à donner au payeur) :", response.payment_request);
//     }
//   });
  























// // lightning.sendPaymentSync(request, (error, response)=>{
// //     if(error){
// //         console.log("Erreur lors de l'operation de payement :", error);
// //     }else{
// //         console.log("L'opération a été un succès. Informations de la transaction :");
// //         console.log("Hash du paiement :", response.payment_hash);  // Hash du paiement effectué
// //         console.log("Préimage du paiement :", response.payment_preimage);  // Préimage (preuve du paiement)
// //     }
// // })



// // const balance = await lightning.walletBalance()
// // console.log("INFO BALANCE: ", balance);









// // let dest_pubkey = '031ed39168e2a92de60ccef077ed55b8ccbf6ab6530889faeecf9b4e53dff63516'; 
// // let dest_pubkey_bytes = Buffer.from(dest_pubkey, "hex");

// // // Montant à envoyer (en satoshis)
// // let amount = 50000;

// // // Effectuer une transaction unique
// // lightning.sendPaymentSync({ 
// //     dest: dest_pubkey_bytes, 
// //     amt: amount 
// // }, (error, response) => {
// //     if (error) {
// //         console.error("Erreur lors de l'opération de paiement : ", error);
// //     } else {
// //         console.log("Transaction réussie ! Détails : ", response);
// //     }
// // });






































// const { createPool} = require('mysql');
// const connectBD = express();
// const pool = createPool({
//     host:"sql106.infinityfree.com",
//     user:"if0_37576689",
//     password:"ProjetJokerUuBF",
//     database:"if0_37576689_ProjectJoker"
// })














const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '192.168.11.1', // Remplacez par le bon hôte
  port: '3306', // Séparez le port ici
  user: 'if0_37576689', // Nom d'utilisateur MySQL
  password: 'ProjetJokerUuBF', // Mot de passe MySQL
  database: 'if0_37576689_ProjectJoker', // Nom de la base de données
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données.');
});
