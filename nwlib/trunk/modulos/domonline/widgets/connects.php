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
<link rel="stylesheet" type="text/css" href="/nwlib6/modulos/domonline/widgets/connects/style.css" />
<script>
    var timeoutID;
    var pedidos = "";
    function delayedAlert(func, time) {
        timeoutID = window.setTimeout(func, time);
    }
    function clearAlert() {
        window.clearTimeout(timeoutID);
    }
    function publicatIntDoms() {
        var url_data = "/nwlib6/modulos/domonline/widgets/connects/connects.php";
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            //data que trae el php connects
                var data = xmlhttp.responseText;

                if (xmlhttp.responseText == "0") {
                    data = "<h4 style='background: #e6e6e6; color: #333; '>Hay <span class='num_dom'>0</span> pedidos nuevos</h4>";
                } else {
                    var pide = 0;
                    var si = data.split("0pedidos");
                    if (si[1] != undefined) {
                        pide = 1;
                    }
                    
                    parent.nwproject5.main.slotPopUpPedido("" + xmlhttp.responseText + "", pide);
                }

                document.getElementById("div_doms").innerHTML = data;

            }
        };
        xmlhttp.open("GET", url_data, true);
        xmlhttp.send();
        delayedAlert(publicatIntDoms, 8000);
    }
    document.addEventListener("DOMContentLoaded", publicatIntDoms);
    publicatIntDoms();
</script>
<!--<div class="open_moduleNWLIVE" onclick="parent.main.slotNWSoporte();">Abrir Módulo</div>-->
<div id="div_doms"></div>