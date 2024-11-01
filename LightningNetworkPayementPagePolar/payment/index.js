const urlParams = new URLSearchParams(window.location.search);
    const user = {
        nom :urlParams.get('nom'),
        prenom: urlParams.get('prenom'),
        email: urlParams.get('email')
    };

   





document.addEventListener('DOMContentLoaded', function() {
    const amount = document.querySelector('.amountInput');
    const description = document.querySelector('.motifInput');
    const destiWallet = document.querySelector('.adrWalletInput');
    const sendInfo = document.querySelector('.sendInfo');
    

    function paymentMobile(item,amount){
        if(item==='Orange money'){
            // on lanncer une fonction async pour verifier la transcation
            // mais les api sont obtenir sous des contrats
            return ['true',item,amount.value]

        }else if(item==='Moov money'){
            
            // on lanncer une fonction async pour verifier la transcation
            // mais les api sont obtenir sous des contrats
            return ['true',item,amount]

        }else if(item==='Coris money'){
            // on lanncer une fonction async pour verifier la transcation
            // mais les api sont obtenir sous des contrats
            return ['true',item,amount.value]

        }else{
            
            return ['false',item,amount.value];
        }
    }



    // Verification des infos
    // Montant
    
    function verificationMontant(item,amount,msgAmount) {
        const minTransac = 999;
        const costs = 1;
        const convertChiffre = parseFloat(amount.value);
        if(isNaN(convertChiffre)){
            amount.style.borderColor = 'red';
        }else{
            if (convertChiffre <= minTransac) {
                amount.style.borderColor = 'red';
                msgAmount.textContent= 'Valeur inférieur';
            } else {
                amount.style.borderColor = 'green';
                
                msgAmount.textContent= '';
                const transResultat = paymentMobile(item,amount);
                return transResultat;
            }
        }
    };

    function verifiWallet(destiWallet){
        const validWallet = /^(lnbcrt)[a-zA-Z0-9]{1,}$/; 
        const msgWallet = document.querySelector('.msgWallet');
        
        if(destiWallet.value===''){
            msgWallet.textContent = 'Vide';
            destiWallet.style.borderColor = 'red';
        }else{ 
                if (!destiWallet.value.match(validWallet)) {
                destiWallet.style.borderColor = 'red';
                msgWallet.textContent = 'Invalide';
                msgWallet.style.color='red';
            } else {
                destiWallet.style.borderColor = 'green';
                msgWallet.textContent = 'Valide';
                msgWallet.style.color='green';
                return ['true',destiWallet.value];
            }
       
        }
    };
    
    function  verificationInput(content,msg){
        
        if(content.value===''){
            msg.textContent = 'Vide';
            msg.style.color= 'red';
            content.style.borderColor = 'red';
            return ['false',content.value] 
        }else{
            msg.textContent = 'Correct !';
            msg.style.color= 'green';
            content.style.borderColor = 'green';
            return ['true',content.value] ;
        }
    }


    // Envoi des informations
    sendInfo.addEventListener('click', function() {
        
        // Saisie du motif
        const msgMotif = document.querySelector('.msgMotif');
        const [IsValidDescription, verifDescription] = verificationInput(description,msgMotif);
        
        // Adresse Wallet
        const [IsValidWallet, validWallet] = verifiWallet(destiWallet);
        
        // Verification du choix de payement
        const isValidInput =[IsValidWallet,IsValidDescription]

        
        
        function validInput(isValidInput){
            for(let i=0; i<isValidInput.length;i++){
                if(isValidInput[i]=== 'false'){
                    return 'false';
                }
            }
            return 'true';
        }
        const found = validInput(isValidInput);
        

        
        // montant
        const msgAmount = document.querySelector('.msgAmount');
        const modePayement = document.querySelector('.modePayement');
        const modePayementSelect = modePayement.value;


        function verifAllInput (found){
            if(found === 'true'){
                const [isSucce, nameOperation, amountSend] = verificationMontant(modePayementSelect, amount, msgAmount);
                return [isSucce, nameOperation, amountSend];
            }
        }
        const [isSucce, nameOperation, amountSend] = verifAllInput (found);
        
        // transfert des informations vers la page de dédie a la facture
        async function verificationOperation(isSucce,nameOperation,amountSend,verifDescription,validWallet){


            // initialisation
            function initialiseAll(){
                
                
                
                return true;
            }

            if(isSucce === 'true'){
                // alert('toute les verification on ete effectuer');
                const msgOperation = document.querySelector('.msgOperation');
                msgOperation.style.display= 'block'; 
                
                fetch('http://localhost:10030/application/operation',{
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        moyenPayment: nameOperation,
                        montant: amountSend, 
                        motif: verifDescription, 
                        adressCli: validWallet,
                        user: user
                    })
                })
                .then(async reponse =>{
                    if(reponse.ok){
                        const data = await reponse.json();
                        const IdPayement = data.invoiceId;
                        
                        //initialisation

                        function intialise(input, msgText){
                            input.style.borderColor='#4f24e7aa';
                            input.value=''
                            msgText.textContent='';
                        };
                        setTimeout(()=>{
                            const msgWallet = document.querySelector('.msgWallet');
                            intialise(description,msgMotif);
                            intialise(amount,msgAmount);
                            intialise(destiWallet,msgWallet);
                            msgOperation.style.display= 'none';
                        }, 4000);
                        window.location.href = `../invoice/index.html?invoiceId=${IdPayement}`;

                        
                    }
                })
                
                .catch(error => console.log('Erreur :', error));
                
            }else{
                alert('echec de l´Opteration ');
            }
        }
        verificationOperation(isSucce,nameOperation,amountSend,verifDescription,validWallet);
        
    });

});
