const express = require('express');
const cors = require('cors');



// ------------------------------SECTION connection avec la base de donnée--------------------------------------------------------
// const { createPool} = require('mysql');
// const connectBD = express();
// const pool = createPool({
//     host:"",
//     user:"",
//     password:"",
//     database:"",
//     port: ,
// })

const { createPool} = require('mysql');
const connectBD = express();
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"lightningpayementsite",
    connectionLimit: 10 
})


// ------------------------------SECTION DE l'INSCRIPTION--------------------------------------------------------

const singer= express();
singer.use(cors()); 



singer.use(express.json());

singer.post('/user/inscription',(req,rep)=>{

    const dataInscrip = req.body;
    const neWnom = dataInscrip.nom;
    const prenom = dataInscrip.prenom;
    const genre = dataInscrip.genre;
    const email = dataInscrip.email;
    const mot_de_passe = dataInscrip.mot_de_passe;
    const nomUtilisateur= dataInscrip.nomUtilisateur;

    console.log(neWnom, prenom, genre, email, mot_de_passe, nomUtilisateur);

    // insertion de l'utilisateur dans la base de donnée

    const insertion = 'INSERT INTO userInfo(nom, prenom, genre, email, mot_pass, nom_utilisateur) VALUES(?, ?, ?, ?, ?, ?)';
    const verifExistance = 'SELECT * FROM userInfo WHERE nom_utilisateur= ? OR mot_pass= ? ';

    pool.query(verifExistance,[nomUtilisateur, email], (error, result)=>{
        if(error){
            console.error('erreur de la verification de l existance de l\'utilisateur');
            return rep.status(500).send({ message: 'Erreur lors de la vérification' })
        }
        if(result.length >0){
            console.log('l\'utilisateur existe déja dans la basse de donnée');
            return rep.status(409).send({ message: 'existe' });

        }else{
            pool.query(insertion, [neWnom, prenom, genre, email, mot_de_passe, nomUtilisateur], (error, result, fields) => {
                if (error) {
                    console.error('Erreur lors de l\'inscription :', error); // Affichez l'erreur pour comprendre la cause
                    return rep.status(500).send({message: 'erreur lors de l inscription'});

                }
                console.log('Inscription avec succès');
                return rep.status(201).json({message: 'inserer'});
            });
        }
    });

});


singer.listen(10020,()=>{
    console.log('le serveur  ecoute sur le port 10020 pour l inscription');
});


// ------------------------------SECTION DE CONNECTION--------------------------------------------------------

// paser les information reçu

connectBD.use(express.json());
connectBD.use(cors()); 
// traitement de la donnée de connexion

connectBD.post('/user/connection', (req, rep)=>{


    const Userdata =req.body;
    const name = Userdata.name;
    const password = Userdata.password;

    const verifExistance = 'SELECT * FROM userInfo WHERE nom_utilisateur= ? OR mot_pass= ? ';
    
    pool.query(verifExistance,[name, password], (error, result, feilds)=>{

        if(error){
            // en cas d'erreur envoyer ce message vers le mon js serveur
            console.error('erreur lors de la verification');
            return rep.status(500).send({message: 'Erreur lors de la verification'});
        }else{
            if(result.length > 0){
                // l utilisateur existe donc je vais donnée accès a la page de payement
            
                console.log('connexion accordée');
                return rep.status(200).send({message:'acces accorde', autorisation: true , result: result[0]});
            }else{
                // l utilisateur n'existe pas il faut une inscription
                console.log('connexion refusée');
                return rep.status(404).send({message: 'acces refusée', autorisation: false});
            }
        }
        
    } );
})



connectBD.listen('10010', ()=>{
    console.log('le serveur de connection  ecoute sur le port 10010');
});


