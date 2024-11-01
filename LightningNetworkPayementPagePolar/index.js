const btnSubmit = document.querySelector(".btn");
//------------------------------------------CREATION D'UNE CLASS USER----------------------------------------

const passWord = document.querySelector('.password');
const showPassword = document.getElementById('showPassword');

showPassword.addEventListener('click', function () {
    if (passWord.getAttribute("type") === "password") {
        passWord.setAttribute("type", "text");
        showPassword.classList.remove('bxs-lock');
        showPassword.classList.add('bxs-lock-open');
    } else {
        passWord.setAttribute("type", "password");
        showPassword.classList.remove('bxs-lock-open');
        showPassword.classList.add('bxs-lock');
    }
});



btnSubmit.addEventListener('click', (event)=>{

    event.preventDefault();


    const nomUtilisateur = document.querySelector(".userName");
    const mot_de_passe = document.querySelector('.password');
    const msgText = document.querySelector('.msgText');
    
    // verifion si le champ est vide 
    function estVide(text){
        if(text.value !==''){
            text.style.borderColor='green';
            return [true,text.value];
        }else{
            text.style.borderColor='red';
            return [false];
        }
    }

    const verifNomUtilisateur = estVide(nomUtilisateur);
    const verifMot_de_passe = estVide(mot_de_passe);

    function envoyeBackend(verifMot_de_passe,verifNomUtilisateur){
        if(verifMot_de_passe[0] && verifNomUtilisateur[0]){
            try{
                const requeteConnect ={
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: verifNomUtilisateur[1],
                        password: verifMot_de_passe[1]
                    })
                };
                fetch('http://localhost:10010/user/connection',requeteConnect)

                // fetch('http://projet-joker-uvbf.42web.io:10010/user/connection',requeteConnect)

                // verification s'il ya une erreur  ou confirmation 


                .then(reponse => {
                    return reponse.json().then(data =>{
                        if(!reponse.ok){
                            // autorisation non accordé 
                            alert('autorisation non accordé');
                            msgText.style.display = 'block';
                            msgText.style.color = 'green';
                            msgText.innerHTML = 'Vous avez pas de compte créez-en un';

                            mot_de_passe.value='';
                            nomUtilisateur.value='';
                        }
                        return data;
                    })
                })

                .then(data=>{
                    if(data.autorisation){

                        // autorisation accordé a l'utilisateur

                        //console.log('les donnes des utilisateur : ', data.result.nom );
                        
                        

                        alert('autorisation accordé a l utilisateur');
                        
                        
                        msgText.style.display = 'block';
                        msgText.style.color = 'green';
                        msgText.innerHTML = 'connexion réussie';

                        const User =  {} ;

                        // allons sur la page de payement apres 3s
                        setTimeout(()=>{
                            window.location.href = `./payment/index.html?nom=${data.result.nom}&prenom=${data.result.prenom}&email=${data.result.email}`;
                        }, 2500);
                        //  initialisation des input
                        mot_de_passe.value='';
                        nomUtilisateur.value='';
                    }

                })
                
            }
            catch(error){

                console.log('l erreur de la requete est : ' , error);
                msgText.style.display = 'block';
                msgText.style.color = 'red';
                msgText.innerHTML = 'Erreur de connextion';
            } 
        }else{
            
            // erreur des saisie
            msgText.style.color = 'red';
            msgText.style.display = 'block';
            msgText.innerHTML = 'Veuillez vérifier les champs marqués en rouge';
        }
        
    };
    envoyeBackend(verifMot_de_passe,verifNomUtilisateur);
    
})
