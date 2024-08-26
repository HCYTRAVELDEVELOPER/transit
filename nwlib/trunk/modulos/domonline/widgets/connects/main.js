var timeoutID;
function delayedAlert(func, time) {
    timeoutID = window.setTimeout(func, time);
}
function slowAlert() {
    loadWall();
}
function clearAlert() {
    window.clearTimeout(timeoutID);
}
function publicatIntChat() {
    var url_data = "/nwlib6/modulos/nw_soporte_chat/widgets/connects/connects.php";
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            document.getElementById("connectedChat").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", url_data, true);
    xmlhttp.send();
    delayedAlert(publicatIntChat, 8000);
}
var hash = location.hash;
if (hash != "#chat") {
    document.addEventListener("DOMContentLoaded", publicatIntChat);
}