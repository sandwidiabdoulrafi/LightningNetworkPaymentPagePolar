// const { jsPDF } = window.jspdf;




// document.addEventListener("DOMContentLoaded", function () {
//     // Données à passer à la facture
//     const facture = "Données de la facture";

//     // Génération du reçu sous format PDF
//     function generationPDF(facture){
//         const doc = new jsPDF();
//         doc.text(facture, 10, 10);
//         const docUrl = doc.output('dataurlstring'); // Convertir en Data URL pour affichage
//         return docUrl;
//     }

//     // Générer et afficher le PDF
//     const facturePDF = generationPDF(facture);
//     console.log(facturePDF);

//     const afficher = document.querySelector('.btnShow');
//     const showInvoice = document.querySelector('.showInvoice');
//     const enregistre = document.querySelector('.btnEnreg');

//     // afficher la facture 

//     function getShowInvoice(section){
//         alert('afficher avec succè');
//         section.src = facturePDF;
//     }
//     // afficher.addEventListener('click', getShowInvoice(showInvoice));



//     // sauvegarder le reçu en local
//     function saveIvoceLocal(document){
//         document.save('a4.pdf');
//         alert('sauvegarder avec succè');
//     }
//     // enregistre.addEventListener("click", saveIvoceLocal(facturePDF));














//     // Génération du code QR
//     function generationQRCode(facturePDF){
//         const codeQr = document.querySelector('.codeQr');
//         if (codeQr) {
//             new QRCode(codeQr, {
//                 text: facturePDF,
//                 width: 450,
//                 height: 310
//             });
//         }
//     }

//     const facturePDF2 = 'VOUS AVEZ SCANNÉ AVEC SUCCÈS';
//     var scanQR = generationQRCode(facturePDF2);





// });




const { jsPDF } = window.jspdf;

document.addEventListener("DOMContentLoaded", function () {
    // Données à passer à la facture
    const facture = "Données de la facture";

    // Génération du reçu sous format PDF
    function generationPDF(facture){
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text(facture, 50, 30);
        const docUrl = doc.output('dataurlstring'); // Convertir en Data URL pour affichage
        return { doc, docUrl };
    }

    // Générer et afficher le PDF
    const { doc, docUrl } = generationPDF(facture);

    const afficher = document.querySelector('.btnShow');
    const showInvoice = document.querySelector('.showInvoice');
    const enregistre = document.querySelector('.btnEnreg');
    alert(docUrl);
    // Fonction pour afficher la facture dans un iframe
    function getShowInvoice() {
        showInvoice.style.display='flex';
        showInvoice.src = docUrl;
        alert('Affiché avec succès');
    }
    afficher.addEventListener('click', getShowInvoice);

    // Fonction pour sauvegarder le reçu en local
    function saveInvoiceLocal() {
        doc.save('a4.pdf');
    }
    enregistre.addEventListener("click", saveInvoiceLocal);

    // Génération du code QR


// envoyer au backend pour generer une page qui affiche le le pdf et recuperer le lien pour le remettre dans le 
// qr code pour le scannage
    fetch('http://localhost:8860/linkOfPdf',{
        method: 'POST',
        headers:{
            'Titre':'facture',
        },
        body: JSON.stringify(docUrl),
    })
    .then(reponse=>reponse.json())

    // ici on change le lien du pdf par le lien generer en backend
    
    .then(data=>{docUrl=data.reply})
    .catch(error=>{
        console.log("l'erreur est : ", error);
    })



    function generationQRCode(data){
        const codeQr = document.querySelector('.codeQr');
        if (codeQr) {
            new QRCode(codeQr, {
                // text: data,
                text: `http://127.0.0.1:5601?pdf=${encodeURIComponent(data)}`,
                width: 450,
                height: 310
            });
        }
    }
    console.log('docUrl:', docUrl);
    
    // Générer un code QR avec l'URL du PDF
    const lepdf ="le contenue du qr c'est moi";
    generationQRCode(lepdf);
});









// git commit -m "ajout de la generation du pdf "

// cd mon-projet
// git add .
// git commit -m "Correction de bugs dans le formulaire de contact"
// git push origin main






// const { jsPDF } = window.jspdf;

// document.addEventListener("DOMContentLoaded", function () {
//     // Données à passer à la facture
//     const facture = "Données de la facture";

//     // Génération du reçu sous format PDF
//     function generationPDF(facture){
//         const doc = new jsPDF();
//         doc.setFont("helvetica", "bold");
//         doc.text(facture, 50, 30);
//         const docUrl = doc.output('dataurlstring'); // Convertir en Data URL pour affichage
//         return { doc, docUrl };
//     }

//     // Générer et afficher le PDF
//     const { doc, docUrl } = generationPDF(facture);

//     const afficher = document.querySelector('.btnShow');
//     const showInvoice = document.querySelector('.showInvoice');
//     const enregistre = document.querySelector('.btnEnreg');

//     // Fonction pour afficher la facture dans un iframe
//     function getShowInvoice() {
//         showInvoice.style.display = 'flex';
//         showInvoice.src = docUrl;
//         alert('Affiché avec succès');
//     }
//     afficher.addEventListener('click', getShowInvoice);

//     // Fonction pour sauvegarder le reçu en local
//     function saveInvoiceLocal() {
//         doc.save('a4.pdf');
//     }
//     enregistre.addEventListener("click", saveInvoiceLocal);

//     // Génération du code QR avec l'URL simulée
//     function generationQRCode(data){
//         const codeQr = document.querySelector('.codeQr');
//         if (codeQr) {
//             new QRCode(codeQr, {
//                 text: `http://127.0.0.1:5601?pdf=${encodeURIComponent(data)}`,
//                 width: 450,
//                 height: 310
//             });
//         }
//     }

//     console.log('docUrl:', docUrl);
    
//     // Générer un code QR avec l'URL du PDF
//     generationQRCode(docUrl);
// });
