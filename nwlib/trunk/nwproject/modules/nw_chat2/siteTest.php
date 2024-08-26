<?php
ob_start('comprimir_nwmaker');
$usedOutNwlib = true;
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

$b = Array();
$b["body"] = "Hola Prueba";
$b["title"] = "Enviando";
$b["token"] = "fOKnFwxwb5o:APA91bEf3_yAztiN7qL_h3QsOyApHPvLu7K3KCiKa4Mppqcz9ZTe5Xje6pVMUyJy0t6hichIWe703NPFHY0BDOKdtakO23Jp5QcwJBn6Gpq0IWW3P7fBNb6KfOEUegAPSCeotzTaShAF";
//                $b["token"] = $res[$i]["token"];
echo "prueba";
$s = nwMaker::sendNotificacionPush($b);

return;

$useembed = false;
$useLoading = false;
$displayloading = "display:none;";
if (isset($_GET["ringow_popup"])) {
    if ($_GET["ringow_popup"] === "true") {
        $displayloading = "display:block;";
        $useembed = true;
        $useLoading = true;
    }
}
if (isset($_GET["callingVideo"])) {
    if ($_GET["callingVideo"] === "true") {
        $displayloading = "display:block;";
        $useembed = false;
        $useLoading = true;
    }
}
if (!$useembed) {
//    $p = Array();
    $p = $_GET;
    $p["terminal"] = $_GET["test"];
    $r = soporte::getKeyCode($p);
    echo $r;
} else
if ($useembed) {
    $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $protocolo = nwMaker::protocoloHTTPS();
    $pa = Array();
    $pa["term"] = $_GET["test"];
    $pa["apikey"] = $_GET["key"];
    $pa["domain"] = $protocolo . "://" . $_SERVER["HTTP_HOST"];
    $pa["origin"] = $actual_link;
    if (isset($_GET["mode"])) {
        $pa["registrar_visita"] = "NO";
    }
    $po = nwchat2::startCallUp($pa);

    $ringow_popup = $po["ringow_popup"];
    $status = $po["status"];
    $id = $po["id"];
    $typeCall = $po["typeCall"];
    $online = $po["online"];
    $username = $po["username"];
    $usernameTwo = $po["usernameTwo"];
    if (isset($_GET["code"])) {
        $po["co"]["code"] = $_GET["code"];
    }
    if (isset($_GET["asesor"])) {
        $po["co"]["asesor"] = $_GET["asesor"];
    }
    if (isset($_GET["mode"])) {
        $po["co"]["mode"] = $_GET["mode"];
    }
    if (isset($_GET["kCode"])) {
        $po["co"]["kCode"] = $_GET["kCode"];
    }
    if (isset($_GET["service"])) {
        $po["co"]["service"] = $_GET["service"];
    }
    if (isset($_GET["embed"])) {
        $po["co"]["embed"] = $_GET["embed"];
    }
    if (isset($_GET["edita_asesor"])) {
        if (!isset($_SESSION["usuario"])) {
            echo "Sesión inválida";
            return false;
        }
        if (!isset($_GET["asesor"])) {
            echo "No hay asesor por url";
            return false;
        }
        if ($_GET["asesor"] !== $_SESSION["usuario"]) {
            echo "Usuario incorrecto";
            return false;
        }
        $po["co"]["edita_asesor"] = $_GET["edita_asesor"];
    }
    if (isset($_GET["chatdirect"]) && $_GET["chatdirect"] === "true")
        $po["co"]["usar_bot"] = "false";

    $co = $po["co"];
    $exec = $po["exec"];
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>Ringow</title>
        <style>
<?php
if ($useLoading) {
    ?>
                .containEncBarRingow, .buttonOpenNwChatRingow, .centered{
                    display: none;
                }
                @-webkit-keyframes iECmZH {
                    0% {
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        -ms-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
                @keyframes iECmZH {
                    0% {
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        -ms-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
                .cEftVf {
                    margin-left: auto;
                    margin-right: auto;
                    border: 4px solid #358EFF;
                    border-top: 4px solid transparent;
                    height: 3rem;
                    width: 3rem;
                    box-sizing: border-box;
                    -webkit-animation: iECmZH 1100ms infinite linear;
                    animation: iECmZH 1100ms infinite linear;
                    border-radius: 50%;
                    z-index: 100001;
    <?php echo $displayloading; ?>'
                    }
    <?php
}
?>
                * {
                margin: 0;
                padding: 0;  
                }            
            </style>
        </head>
        <body>
            <?php
            if (!$useembed) {
                ?>
                <style>
                    body {
                    background-image: url(/app/nwchat/img/fondo_pruebas.png);
                    background-position: center top;
                    background-repeat: no-repeat;
                    background-size: contain;
                    }
                </style>
                <?php
            } else {
                ?>
                <div id="loadingNwChat" class="loadingNwChat" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: #fff;">
                    <div class="cEftVf" style="top: 40%;position: relative;"></div>
                </div>
                <?php
            }
            ?>
            <script>
<?php
if ($useembed) {
    ?>
                    (function () {
                        var v = Math.floor((Math.random() * 100) + 1);
                        var js = document.createElement('script');
                        js.type = 'text/javascript';
                        js.charset = 'UTF-8';
                        js.src = "<?php echo $protocolo; ?>://<?php echo $_SERVER["HTTP_HOST"]; ?>/nwlib6/nwproject/modules/webrtc/testing/two/js/apinwrct_load.js?v=" + v;
                        js.id = 'nwRtcMaker';
                        js.async = true;
                        document.body.appendChild(js);
                        js.onload = function () {
                            var r = {};
                            r.tipo = "sendConfigurationRingow";
                            r.ringow_popup = "<?php echo $ringow_popup; ?>";
                            r.typeCall = "<?php echo $typeCall; ?>";
                            r.status = "<?php echo $status; ?>";
                            r.id_enc = "<?php echo $id; ?>";
                            r.online = "<?php echo $online; ?>";
                            r.usuario = <?php echo json_encode($username); ?>;
                            r.usuarioTwo = <?php echo json_encode($usernameTwo); ?>;
                            r.config = <?php echo json_encode($co); ?>;
                            var nwrct = new nwRct();
                            nwrct.start(<?php echo $_GET["test"]; ?>, <?php echo $_GET["key"]; ?>, true, true, r);
                            document.querySelector(".loadingNwChat").remove();
                        };
                    })();
    <?php
}
?>
            </script>
        </body>
    </html>
    <?php
    ob_end_flush();

    function comprimir_nwmaker($buffer) {
        $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
        $reemplaza = array('>', '<', '\\1');
        return preg_replace($busca, $reemplaza, $buffer);
    }
    