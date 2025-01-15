let qrImage= document.getElementById("qrImage");
let urlInput=document.getElementById("url-input");

function generateQRCode(){
    qrImage.src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+urlInput.value;

}