<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <script src="/nwlib6/nwproject/modules/webrtc/js/getIP.js"></script>
    </head>
    <body>
        <p>
            Esta demostración realiza solicitudes secretas a los servidores STUN que pueden registrar su solicitud. Estas solicitudes no aparecen en las consolas de desarrollador y no pueden ser bloqueadas por los complementos del navegador (AdBlock, Ghostery, etc.).
        </p>
        <h4>Tu IP local:</h4>
        <span class="ip"></span>
        <ul></ul>
        <h4>ID Red:</h4>
        <ul><span class="idred"></span></ul>
        <h4>Tu IP pública:</h4>
        <span class="ipublica"></span>
        <ul></ul>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                //insert IP addresses into the page
                getIPs(function (d) {
                    var ip = d.ip;
                    document.querySelector(".idred").innerHTML = d.id_red;
                    if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
                        document.querySelector(".ip").innerHTML = d.ip;
                    else
                        document.querySelector(".ipublica").innerHTML = d.ip;
                });
            });
        </script>
    </body>
</html>