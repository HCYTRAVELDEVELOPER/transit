//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
function soundOnOff() {
    var d = myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
    if (d === false) {
        $(".muteOn").addClass("muteOff");
    } else {
        $(".muteOn").removeClass("muteOff");
    }
}