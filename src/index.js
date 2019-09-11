import flvparse from './flvparse.js'

var dropbox = document.querySelector('body div');

dropbox.addEventListener('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

dropbox.addEventListener("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var reader = new FileReader();
    reader.addEventListener('load', processflv, false);
    reader.readAsArrayBuffer(e.dataTransfer.files[0]);
}, false);

function processflv(e) {
    var buffer = e.target.result;
    var unit8 = new Uint8Array(buffer);
    flvparse.setFlv(unit8);
    console.log(flvparse.toString());
}

