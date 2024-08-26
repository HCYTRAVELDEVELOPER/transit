<style>
    .open_moduleNWLIVE{
        position: absolute;
        right: 5px;
        background: #ec534d;
        color: #fff;
        padding: 5px;
        margin-top: -30px;
        cursor: pointer;
    }
</style>
<!--<script src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/widgets/connects/main.js" type="text/javascript"></script>-->

<script>
    var timeoutID;
    function delayedAlert(func, time) {
        timeoutID = window.setTimeout(func, time);
    }
    function clearAlert() {
        window.clearTimeout(timeoutID);
    }
    function publicatIntChatSupport() {
        var url_data = "/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/widgets/connects/connects.php";
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
        delayedAlert(publicatIntChatSupport, 8000);
    }
    document.addEventListener("DOMContentLoaded", publicatIntChatSupport);
    publicatIntChatSupport();
</script>
<!--<div class="open_moduleNWLIVE" onclick="parent.main.slotNWSoporte();">Abrir Módulo</div>-->
<div id="connectedChat"></div>