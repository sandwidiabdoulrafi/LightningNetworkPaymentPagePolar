const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const os = require("os");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');


//------------------------------------------------------SECTION CONFIGURATION DU L' ECOUTE---------------------------------------------------------------

const operation = express();
operation.use(cors());
operation.use(express.json());

const invoiceInterface = express();
invoiceInterface.use(cors());
invoiceInterface.use(express.json());






//------------------------------------------------------SECTION CONNEXION AU NOEUD---------------------------------------------------------------

// Configuration des suites de chiffrement pour gRPC
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

// Options pour le proto-loader
const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};
const packageDefinition = protoLoader.loadSync('lightning.proto', loaderOptions);

// Correction du chemin du fichier `tls.cert` en utilisant `path.join`
// const certPath = path.join(os.homedir(), ".polar", "networks", "1", "volumes", "lnd", "Rafi", "tls.cert");
// const macaroonPath = path.join(os.homedir(), ".polar", "networks", "1", "volumes", "lnd", "Rafi", "data", "chain", "bitcoin", "regtest", "admin.macaroon");
const certPath = path.join(os.homedir(), ".polar", "networks", "2", "volumes", "lnd", "Rafi", "tls.cert");
const macaroonPath = path.join(os.homedir(), ".polar", "networks", "2", "volumes", "lnd", "Rafi", "data", "chain", "bitcoin", "regtest", "admin.macaroon");

let lndCert = fs.readFileSync(certPath);

let macaroon = fs.readFileSync(macaroonPath).toString('hex'); // Convertir le macaroon en format hexadécimal

// Créer des métadonnées pour inclure le macaron dans la requête gRPC
const metadata = new grpc.Metadata();
metadata.add('macaroon', macaroon);

// Utiliser les credentials SSL et le macaroon
const credentials = grpc.credentials.combineChannelCredentials(
  grpc.credentials.createSsl(lndCert),
  grpc.credentials.createFromMetadataGenerator((_, callback) => {
      callback(null, metadata);
  })
);

const lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
const  lnrpc = lnrpcDescriptor.lnrpc;

// ceration d'une session 

const lightning = new lnrpc.Lightning('127.0.0.1:10005', credentials);


//  affichage des informations du noeud connecter
lightning.getInfo({}, (err, response) => {
  if (err) {
      console.error("Erreur lors de la connexion à LND :", err);
  } else {
      console.log("-----------------------------CONNEXION AU NOEUD  QUI EST SUR LE  RESEAU DE POLAR RUISSI--------------------------------------\n\n");
  }
});



//------------------------------------------------------SECTION  REALISATION  DES OPERATIONS---------------------------------------------------------------

let dataResultatOperation = {};

operation.post('/application/operation', (req, rep)=>{
    
  const data = req.body;
  
  const moyenPayment = data.moyenPayment;
  const amount = data.montant;
  const motif = data.motif;
  const adressCli = data.adressCli;
  const user = data.user;
  
  //faire le payement
  let request = {
    payment_request: adressCli,  
  };

  lightning.sendPaymentSync(request, function(err, response) {
    if (err) {
      console.error("Erreur lors du paiement :", err);
    } else {
      console.log("Réponse du paiement :", response);
      const invoice = {
        value: amount  // Le montant en satoshis que tu veux demander
      };
      
      lightning.addInvoice(invoice, (err, response) => {
        if (err) {
          console.error("Erreur lors de la génération de la facture :", err);
        } else {
          console.log("Invoice générée :", response);

          const dataSend = {
              moyenPayment: moyenPayment,
              amount: amount,
              motif: motif,
              adressCli: adressCli,
              date: new Date(),
              invoiceId: uuidv4(),
              user: user,
              payment_request: response
          };
          const IdPayement = {invoiceId: dataSend.invoiceId,};


          dataResultatOperation[dataSend.invoiceId] = dataSend;
          rep.status(200).json(IdPayement);

        }
      });
    
    }
  });
});


//generation de la facture 

invoiceInterface.post('/invoiceData',(req,rep)=>{

    const invoiceId = req.body;
    
    const dataOfId = dataResultatOperation[invoiceId.invoiceId];
    
    if(dataOfId){
      console.log('-----------------la facture',dataOfId);
      rep.status(200).json(dataOfId);
    }else{rep.status(404).json('Facture non trouver');}
});




operation.listen('10030',()=>(console.log("Le serveur des operation est en ecoute sur 10030")));

invoiceInterface.listen('10040', ()=>(console.log("le serveur des factures est en ecoute sur le port 10040")));







