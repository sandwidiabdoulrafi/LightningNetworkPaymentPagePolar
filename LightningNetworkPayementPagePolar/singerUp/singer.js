const inscrire = document.querySelector('.inscrire');

inscrire.addEventListener('click',async (event)=>{

    event.preventDefault();

    // recuperation des donnee du formulaire

    const nom = document.querySelector('.nom');
    const prenom = document.querySelector('.prenom');
    const genre = document.querySelector('.genre');
    const email = document.querySelector('.email');
    const mot_de_passe = document.querySelector('.mot_de_passe');
    const msgError = document.querySelector('#msg');
    const nomUtilisateur = document.querySelector('.nomUtilisateur');

    // je verifie si le contenue n' est pas vide

    function estVide(text){
        if(text.value ===''){
            text.style.borderColor ='red';
            return [false];
        }else{
            text.style.borderColor ='green';
            
            return [true ,text.value];
        }
    };
    function MotPassEstVide(text){
    if(text.value !== '' && text.value.length >= 8){
        text.style.borderColor ='green';
        return [true ,text.value];
    }else{
        text.style.borderColor ='red';
        return [false];
    }}

    function estVideEmail(text){
        if(text.value ===''){
            text.style.borderColor ='red';
            return [false];
        }else{
                const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if(!text.value.match(validEmail)){
                    text.style.borderColor ='red';
                    return [false];
                }else{
                    text.style.borderColor ='green';
                    return [true,text.value];
                }
            }
    };


    async function transfert(dataFormat) {

        try {
            const reponse = await fetch('http://localhost:10010/user/inscription',{
                method: 'POST',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify(dataFormat)
            });

            const responseData = await reponse.json();

            if(reponse.ok){
                console.log('donne soumise avec succee');
                return responseData ;
                
            }else{
                return responseData ;
                
            }
        }
        
        catch(error){
            console.log('l erreur est al suivante', error.status);
        };
    };
    




    const VerifNom = estVide(nom);
    const VerifPrenom = estVide(prenom);
    const VerifEmail = estVideEmail(email);
    const VerifiMot_de_passe = MotPassEstVide(mot_de_passe);
    const VerifnomUtilisateur = estVide(nomUtilisateur);



    async function envoyeBackend(VerifNom , VerifPrenom, VerifEmail, VerifiMot_de_passe){
        
        

        if(VerifNom[0] && VerifPrenom[0] && VerifEmail[0] && VerifiMot_de_passe[0] && VerifnomUtilisateur[0]){

                // encapsoulation pour envoyer au backend
                const dataFormat = {nom: VerifNom[1], prenom: VerifPrenom[1], genre: genre.value, email: VerifEmail[1] , mot_de_passe: VerifiMot_de_passe[1], nomUtilisateur: VerifnomUtilisateur[1] };
            
            
            
            const ReponseRequete = await transfert(dataFormat);
            console.log('le contenu de la reponde du back-end: ', ReponseRequete);
            if(ReponseRequete && ReponseRequete.message){
                if(ReponseRequete.message === 'existe'){
                    // utilisateur existe
                    

                    msgError.style.display = "block";
                    msgError.style.color = "green";
                    msgError.innerHTML = "L'utilisateur existe vous      vous connecter";
    
                    setTimeout(()=>{
                        window.location.href = '../login/login.html';
                    }, 3000);
    
    
                    // initialisation des input
                    nom.value='';
                    prenom.value='';
                    genre.value='';
                    email.value=''; 
                    mot_de_passe.value='';
                    nomUtilisateur.value='';

                }else if(ReponseRequete.message === 'inserer'){
                    // utilisateur est inserer

                    msgError.style.display = "block";
                    msgError.style.color = "green";
                    msgError.innerHTML = "Inscription réussi";
        
                    setTimeout(()=>{
                        window.location.href = '../index.html';
                    }, 3000);
        
        
                    // initialisation des input
                    nom.value='';
                    prenom.value='';
                    genre.value='';
                    email.value=''; 
                    mot_de_passe.value='';
                    nomUtilisateur.value='';
                }else{
                    // erreur lors de L'operation

                    msgError.style.display = "block";
                    msgError.style.color = "red";
                    msgError.innerHTML = "Erreur lors de la creation du compte";
            }
            }


        }else{
            // Gérer l'erreur lorsque certains champs ne sont pas valides
            msgError.style.display = "block";
            msgError.style.color = "red";
            msgError.innerHTML = "Veuillez vérifier les champs marqués en rouge";
        }


    };

    envoyeBackend(VerifNom , VerifPrenom, VerifEmail, VerifiMot_de_passe);
    
})