
document.addEventListener('DOMContentLoaded', function() {
    const amount = document.querySelector('.amountInput');
    const description = document.querySelector('.motifInput');
    const destiWallet = document.querySelector('.adrWalletInput');
    const sendInfo = document.querySelector('.sendInfo');
    const valueSend = document.querySelector('.valueSend');
    const equalSatoshis = document.querySelector('.equalSatoshis');
    const moyenPayement = document.querySelectorAll('.payementLine');

    

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
            msgAmount.textContent= 'Vide';
        }else{
            if (convertChiffre <= minTransac) {
                amount.style.borderColor = 'red';
                msgAmount.textContent= 'valeur inférieur';
            } else {
                amount.style.borderColor = 'green';
                valueSend.textContent = convertChiffre;
                equalSatoshis.textContent = (costs * convertChiffre) / 100;
                msgAmount.textContent= '';
                const transResultat = paymentMobile(item,amount);
                return transResultat;
            }
        }
    };

    function verifiWallet(destiWallet){
        const validWallet = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;
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
        console.log('isValidInput:', isValidInput);
        
        
        function validInput(isValidInput){
            for(let i=0; i<isValidInput.length;i++){
                if(isValidInput[i]=== 'false'){
                    return 'false';
                }
            }
            return 'true';
        }
        const found = validInput(isValidInput);
        
        console.log('fount:', found);

        
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
        function verificationOperation(isSucce,nameOperation,amountSend,verifDescription,validWallet){
            if(isSucce === 'true'){
                // alert('toute les verification on ete effectuer');
                    
                fetch('/submit',{
                    method: 'POST',
                    headers: {'type du contenu': 'data'},
                    body: JSON.stringify({nameOperation, amountSend, verifDescription, validWallet})
                })
                .then(reponse => reponse.json)
                .then(data => {
                    Window.location.href = `invoice/index.html?invoiceInfo=${encodeURIComponent(data.invoiceInfo)}`;
                })
                .catch(error => console.log('Erreur :', error));
                
            }else{
                alert('echec de l´Opteration ');
                console.log(isSucce);
            }
        }
        verificationOperation(isSucce,nameOperation,amountSend,verifDescription,validWallet);
        
    });

});
        // initialisation
        
        function initialiseAll(){
            function intialise(input, msgText){
                input.style.borderColor='#4f24e7aa';
                input.value=''
                msgText.textContent='';
            };
                const msgWallet = document.querySelector('.msgWallet');
                intialise(description,msgMotif);
                intialise(amount,msgAmount);
                intialise(destiWallet,msgWallet);
        }


// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
