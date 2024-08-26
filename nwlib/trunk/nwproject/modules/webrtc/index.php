<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
if (!isset($_SESSION)) {
    session_start();
}
if (session_id() == "") {
    session_start();
}
$_SESSION["nwproject"] = true;
print nwprojectOut::getNwMakerLib();
if (isset($_SESSION["load_nwmaker"])) {
//    print_r($_SESSION["load_nwmaker"]);
}
$init = false;
if (isset($_SESSION["usuario"])) {
    $init = true;
}
if (!isset($_SESSION["usuario"])) {
    if (isset($_SESSION["email"])) {
        $init = true;
        $_SESSION["usuario"] = $_SESSION["email"];
    }
}
if (isset($_GET["u"])) {
    $init = true;
    $_SESSION["usuario"] = $_GET["u"];
}
if ($init == false) {
    echo "Debe iniciar sesion";
    return;
}
if (!isset($_GET["usuario"])) {
    echo "Debe tener un usuario por get al que quiere comunicarse";
    return;
}

$si = session::info();
if (!isset($_GET["id_call"])) {
    if (isset($_GET["calling"])) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = master::getNextSequence("nwmaker_videollamadas_id_seq", $db);
        $ca->prepareInsert("nwmaker_videollamadas", "id,usuario,usuario_recibe,fecha");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":usuario_recibe", $_GET["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H_i:s"));
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        $url = nwMaker::full_url($_SERVER);
        $url .= "&id_call={$id}";
        header("Location: {$url}");
        return;
    } else
    if (isset($_GET["answer"])) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_videollamadas", "id", "usuario=:usuario and usuario_recibe=:usuario_recibe order by id desc limit 1");
        $ca->bindValue(":usuario", $_GET["usuario"]);
        $ca->bindValue(":usuario_recibe", $si["usuario"]);
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() == 0) {
            echo "La llamada no existe o al url caducó.";
            return;
        }
        $r = $ca->flush();
        $id = $r["id"];
        $url = nwMaker::full_url($_SERVER);
        $url .= "&id_call={$id}";
        header("Location: {$url}");
        return;
    }
}

////////////////////////////////////////////////////////////////// INSTRUCCIONES ////////////////////////////////////////
//variables posibles por get
//usuario: usuario que desea contactar
//calling=true: llamar al usuario
//answer=true: responder la llamada
//callingIn=true: 
//nota: calling y answer no pueden estar al mismo tiempo
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://www.facebook.com/2008/fbml"
      xmlns:og="http://ogp.me/ns#"
      xml:lang="es-ES" >
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <link rel='stylesheet' href='/nwlib6/nwproject/modules/webrtc/css/css.css' />
        <script type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/js/js.js'></script>
        <script type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/js/audio.js'></script>
        <script type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/js/videoOptions.js'></script>
        <script>
            video = true;
<?php
$isVideoCall = true;
$cssVideoCall = "";
if (isset($_GET["video"])) {
    if ($_GET["video"] == "false") {
        $isVideoCall = false;
        $cssVideoCall = "display: none;";
        ?>
                    video = false;
        <?php
    }
}
?>
            $(document).ready(function () {
<?php
if (isset($_GET["calling"])) {
    if ($_GET["calling"] == "true") {
        ?>
                        inicia("startCall");
        <?php
    }
}
if (isset($_GET["answer"])) {
    if ($_GET["answer"] == "true") {
        ?>
                        inicia("answerCall");
        <?php
    }
}
?>
            });
        </script>
    </head>
    <body>
        <div class="statusCall">Status: <span class="textStatusCall">N/A</span></div>
        <video id="video"  autoplay muted style="<?php echo $cssVideoCall; ?>" ></video>
        <video id="video2" autoplay style="<?php echo $cssVideoCall; ?>"  ></video>
        <div class="containerVoice">
            <div class="bloqVoice callingVoice">Conectando</div>
            <div class="bloqVoice inLineVoice">En línea</div>
            <div class="bloqVoice callEndVoice">Llamada Finalizada</div>
            <div class="button endCall" onclick="javascript: endCall();"  ></div>
        </div>
        <div class="containerButtons">
            <?php
            if ($isVideoCall == true) {
                ?>
                <div class="button onCam" onclick="offOnVideo()" ></div>
                <?php
            }
            ?>
            <div class="button muteOn" onclick="javascript: soundOnOff();" ></div>
            <div class="button endCall" onclick="javascript: compruebaLlamadaStatus();" style="display: none;">
                Testing red
            </div>
            <div  class="button chat" onclick="javascript: windowNwChatPes('<?php echo $_GET["usuario"]; ?>', '<?php echo $_GET["usuario"]; ?>', '.footchat');">
            </div>
        </div>
        <div class="footchat"></div>

        <audio id='soundCalling' src='/nwlib6/audio/misc027.mp3' ></audio>
        <audio id='soundIntroCalling' autoplay src='/nwlib6/audio/misc101.mp3' ></audio>
        <audio id='soundLostCalling' src='/nwlib6/audio/misc312.mp3' ></audio>
    </body>
</html>