import flvparse from './flvparse.js'
import tagdemux from './tagdemux.js'

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
    if (flvparse.arrTag[0].type != 18) {
        if (this.error) this.error(new Error('without metadata tag'));
    }
    if (flvparse.arrTag.length > 0) {
        tagdemux.hasAudio = this.hasAudio = flvparse._hasAudio;
        tagdemux.hasVideo = this.hasVideo = flvparse._hasVideo;
        tagdemux.moof(flvparse.arrTag)
    }

}

