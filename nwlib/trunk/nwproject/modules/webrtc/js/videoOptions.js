//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
function offOnVideo() {
    var d = myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
    if (d === false) {
        $(".onCam").addClass("offCam");
    } else {
        $(".onCam").removeClass("offCam");
    }
}