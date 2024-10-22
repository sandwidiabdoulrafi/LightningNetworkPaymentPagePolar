const { jsPDF } = window.jspdf;


// document.addEventListener("DOMContentLoaded", function () {

//     let Data = {};
//     const urlParams = new URLSearchParams(window.location.search);
//     const invoiceId = urlParams.get('invoiceId');

//     fetch('http://localhost:10040/invoiceData',{
//         method: 'POST',
//         headers: {'Content-type' : 'application/json',},
//         body: JSON.stringify({invoiceId})
//     })
//     .then(async reponse =>{
//         if(reponse.ok){
//             Data = await reponse.json();
//             console.log('---------------------------------------------------la facture:',Data );
//             console.log('la facture data.user:',Data.user );
//         }else{
//             console.log('la facture:',Data );
//         }
//     })
    
    
//     .catch(error =>(console.log("Erreur lors de la demande par l'interface  facture Erreur:  ", error)))

//     // Données à passer à la facture
    

//     // Génération du reçu sous format PDF
//     function generationPDF(Data){
//         const doc = new jsPDF({
//             orientation: 'portrait', 
//             unit: 'mm',          
//             format: 'a3' 
//         });

        
//         //recuperation de la largeur de la page 
//         let title = 'FACTURE DE LA TRANSACTION';
//         let widthPage = doc.internal.pageSize.getWidth();
//         let heightPage = doc.internal.pageSize.getHeight();
        
//         //determintion de  la largeur du texte
//         let titleSize = doc.getTextWidth(title);
//         let xPos = (widthPage - titleSize ) / 2 ;
//         console.log('la facture data.user:',Data.user );
//         let user= Data.user;
//         console.log('user  ',user)

//         doc.setFont("helvetica", "bold");
//         doc.text(title, xPos, 20);
//         doc.setFontSize(18);
//         doc.setFont("courier","bolditalic");
//         doc.text('Date : '+Data.date, 190 ,30);
//         doc.text('Nom du client(e) : ', 10 ,40);
//         doc.text(user.nom, 100 ,40);
//         doc.text('Prenom du client(e) : ', 10 ,50);
//         doc.text(user.prenom, 100 ,50);
//         doc.text('Moyen de payement : ', 10 ,60);
//         doc.text(Data.moyenPayment, 100 ,60);
//         doc.text('Montant : ', 10 ,70);
//         doc.text(Data.amount+' Satoshi', 100 ,70);

//         let wrapAdressPayment = doc.splitTextToSize(Data.payment_request.r_hash, widthPage - 20);
//         doc.text('Adresse de paiement : ', 10 ,100);
//         doc.text(wrapAdressPayment, 100 ,100);

//         let wrapHash = doc.splitTextToSize(Data.payment_request.payment_addr, widthPage - 20);
//         doc.text('Hash : ', 10 ,120);
//         doc.text(wrapHash, 100 ,120);

//         let motif = doc.splitTextToSize(Data.motif, widthPage - 20);
//         doc.text('Motif : ', 10 ,140);
//         doc.text(motif, 100 ,140);


//         let wrapAdressCli = doc.splitTextToSize(Data.adressCli, widthPage - 20);
//         doc.text('Adresse du client : ', 10 ,170);
//         doc.text(wrapAdressCli, 100 ,170);

        









        
//         let yPos= heightPage - 10;
//         doc.setFontSize(15);
//         doc.text('Identifiant  '+Data.invoiceId, 100 ,yPos);

//         doc.setFont("courier","bolditalic");
//         doc.setFontSize(20);
//         doc.text('Merci beaucoup pour votre fidélité.', 100 ,300);

//         const docUrl = doc.output('dataurlstring'); // Convertir en Data URL pour affichage
//         return { doc, docUrl };
//     }

//     // Générer et afficher le PDF
//     const { doc, docUrl } = generationPDF(Data);

//     const showInvoice = document.querySelector('.showInvoice');
//     const enregistre = document.querySelector('.btnEnreg');
    
//     // Fonction pour afficher la facture dans un iframe
//     function getShowInvoice() {
//         showInvoice.src = docUrl;
//     }

//     // Fonction pour sauvegarder le reçu en local
//     function saveInvoiceLocal() {
//         doc.save('Reçu du payement de satoshi.pdf');
//     }
//     getShowInvoice()
//     enregistre.addEventListener("click", saveInvoiceLocal);
// });

document.addEventListener("DOMContentLoaded", function () {
    let Data = {};
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('invoiceId');

    fetch('http://localhost:10040/invoiceData', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({invoiceId})
    })
    .then(async response => {
        if (response.ok) {
            Data = await response.json();
            console.log('---------------------------------------------------la facture:', Data);
            console.log('la facture data.user:', Data.user);
            generationPDF(Data);  // Appeler la fonction après la réception des données
        } else {
            console.log('Erreur lors de la récupération des données:', Data);
        }
    })
    .catch(error => {
        console.log("Erreur lors de la demande par l'interface facture. Erreur: ", error);
    });

    // Génération du reçu sous format PDF
    function generationPDF(Data) {
        const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'mm',          
            format: 'a3'
        });

        let title = 'FACTURE DE LA TRANSACTION';
        let widthPage = doc.internal.pageSize.getWidth();
        let heightPage = doc.internal.pageSize.getHeight();
        let titleSize = doc.getTextWidth(title);
        let xPos = (widthPage - titleSize) / 2;

        let user = Data.user;  // Utilisation des données utilisateur après leur récupération
        console.log('user:', user);

        doc.setFont("helvetica", "bold");
        doc.text(title, xPos, 20);
        doc.setFontSize(18);
        doc.setFont("courier", "bolditalic");
        doc.text('Date : ' + Data.date, 190, 30);
        doc.text('Nom du client(e) : ', 10, 40);
        doc.text(user.nom, 100, 40);
        doc.text('Prenom du client(e) : ', 10, 50);
        doc.text(user.prenom, 100, 50);
        doc.text('Moyen de payement : ', 10, 60);
        doc.text(Data.moyenPayment, 100, 60);
        doc.text('Montant : ', 10, 70);
        doc.text(Data.amount + ' Satoshi', 100, 70);

        

        let converHash =converStringhexadecimal(Data.payment_request.r_hash.data)

        let wrapHash = doc.splitTextToSize(converHash, widthPage - 20);
        console.log('converHash. ::: ',converHash)
        doc.text('Hash : ', 10, 120);
        doc.text(wrapHash, 100, 120);

        let motif = doc.splitTextToSize(Data.motif, widthPage - 20);
        doc.text('Motif : ', 10, 140);
        doc.text(motif, 100, 140);

        let wrapAdressCli = doc.splitTextToSize(Data.adressCli, widthPage - 20);
        doc.text('Adresse de paiement : ', 10, 170);
        doc.text(wrapAdressCli, 100, 170);

        let yPos = heightPage - 10;
        doc.setFontSize(15);
        doc.text('Identifiant  ' + Data.invoiceId, 100, yPos);

        doc.setFont("courier", "bolditalic");
        doc.setFontSize(20);
        doc.text('Merci beaucoup pour votre fidélité.', 100, 300);

        const docUrl = doc.output('dataurlstring'); // Convertir en Data URL pour affichage
        displayPDF(docUrl);  // Afficher le PDF dans un iframe
    }

    // Fonction pour afficher le PDF dans un iframe
    function displayPDF(docUrl) {
        const showInvoice = document.querySelector('.showInvoice');
        showInvoice.src = docUrl;
    }

    // Fonction pour sauvegarder le reçu en local
    const enregistre = document.querySelector('.btnEnreg');
    enregistre.addEventListener("click", () => {
        const doc = new jsPDF();  // Créer un nouveau document jsPDF pour sauvegarde
        doc.save('Reçu du payement de satoshi.pdf');
    });
});









function converStringhexadecimal(tableHexadecimal) {
    return tableHexadecimal.map(byte => byte.toString(16).padStart(2, '0')).join('');
}