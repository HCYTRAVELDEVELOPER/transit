<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
ob_start('comprimir_nwmaker');
$p = $_GET;

function validateApiKey($terminal) {
    $p = $_GET;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    if (!isset($p["apikey"])) {
        echo "Missing apikey";
        return false;
    }
    $apikey = $p["apikey"];
    $ca->prepareSelect("terminales", "clave", "id=:id");
    $ca->bindValue(":id", $terminal);
    if (!$ca->exec()) {
        $a = Array();
        $a["error_text"] = "Webrtc index.php ERROR: " . $ca->lastErrorText();
        $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        return "Error. " . $ca->lastErrorText();
    }
    if ($ca->size() == 0) {
        return false;
    }
    $t = $ca->flush();
    if ($apikey !== $t["clave"]) {
        echo "Api key incorrect {$terminal} {$apikey} {$t["clave"]} ";
        return false;
    }
    return $t["clave"];
}

function startCall($op, $cli, $ter) {
    $p = $_GET;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $db->transaction();
    $userone = $op;
    $usertwo = $cli;
    $namegroupgeneral = false;

    $k = validateApiKey($ter);
    if (!$k) {
        return;
    }
    $whereusers = " and (userscallintern=:usuario and userscallintern_d=:usuario_recibe or userscallintern=:usuario_recibe and userscallintern_d=:usuario) ";
    if (isset($p["namegroupgeneral"])) {
        if ($p["namegroupgeneral"] === "true") {
            $namegroupgeneral = $cli;
            $whereusers = " and userscallintern_d=:namegroupgeneral ";
        }
    }
    $where = " terminal=:terminal ";
    $where .= $whereusers;
    $where .= " order by id desc limit 1 ";
    $tipo = "chat";
    if (isset($p["useinapp"])) {
        $tipo = "CHAT_INTERNO";
    }

    $ca->prepareSelect("sop_visitantes", "id", $where);
    $ca->bindValue(":usuario", $userone);
    $ca->bindValue(":usuario_recibe", $usertwo);
    $ca->bindValue(":namegroupgeneral", $namegroupgeneral);
    $ca->bindValue(":terminal", $ter);
    if (!$ca->exec()) {
        $a = Array();
        $a["error_text"] = "Webrtc index.php ERROR: " . $ca->lastErrorText();
        $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        echo "Error. " . $ca->lastErrorText();
        return;
    }

    $fields = "fecha_ultima_interaccion_cliente";

    $total = $ca->size();
    if ($total == 0) {
        $fields .= ",id,userscallintern,userscallintern_d,terminal,estado,fecha,tipo";
        $fields .= ",nombre,id_session,url,host,ip,device,navegador,is_webrtc,pais,ciudad,fecha_inicio_llamada";
        $id = nwchat2::validateIDCall($db);
        $cb->prepareInsert("sop_visitantes", $fields);
    } else {
        $cb->prepareUpdate("sop_visitantes", $fields, "id=:id");
        $id = $ca->flush()["id"];
    }
    $cb->bindValue(":id", $id);
    $cb->bindValue(":terminal", $ter);
    $cb->bindValue(":userscallintern", $userone);
    $cb->bindValue(":userscallintern_d", $usertwo);
    $cb->bindValue(":fecha", date("Y-m-d H_i:s"));
    $cb->bindValue(":fecha_ultima_interaccion_cliente", date("Y-m-d H_i:s"));
    $cb->bindValue(":tipo", $tipo);
    $cb->bindValue(":estado", "VISITANDO");
    $dom = "";
    if (isset($p["domain"])) {
        $dom = $p["domain"];
    }
    $origin = "";
    if (isset($p["href"])) {
        $origin = $p["href"];
    }
    $id_session = session_id() . $dom;
    $ip = "";
    if (isset($p["ip"])) {
        $ip = $p["ip"];
    } else {
        $ip = master::getRealIp();
    }
    $device = nwMaker::getDispositivo();
    $sys = nwMaker::getSystem();
    $navegador = $sys["browser"] . " OS:" . $sys["os"] . " V:" . $sys["version"];
    $country = "N/A";
    if (isset($p["country"])) {
        $country = $p["country"];
    }
    $city = "N/A";
    if (isset($p["city"])) {
        $city = $p["city"];
    }
    $languaje = "N/A";
    if (isset($p["lang"])) {
        $languaje = $p["lang"];
    }
    $ref = $ter . $dom;
    $nombre_visitor = "Visitor-" . $country . "-" . $city . "-" . $languaje;
    if (isset($_SESSION["nombre_{$ref}"])) {
        $nombre_visitor = $_SESSION["nombre_{$ref}"];
    }
    $cb->bindValue(":nombre", $nombre_visitor);
    $cb->bindValue(":id_session", $id_session);
    $cb->bindValue(":url", $origin);
    $cb->bindValue(":host", $dom);
    $cb->bindValue(":ip", $ip);
    $cb->bindValue(":device", $device);
    $cb->bindValue(":navegador", $navegador);
    $cb->bindValue(":is_webrtc", "SI");
    $cb->bindValue(":pais", $country);
    $cb->bindValue(":ciudad", $city);
    $cb->bindValue(":fecha_inicio_llamada", date("Y-m-d H:i:s"));
    if (!$cb->exec()) {
        $a = Array();
        $a["error_text"] = "Webrtc index.php ERROR: " . $cb->lastErrorText();
        $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        echo "Error. " . $cb->lastErrorText();
        return;
    }
    if ($total == 0 && $origin !== "" && !isset($p["useinapp"])) {
        $ca->prepareSelect("sop_config a left join terminales b ON(a.terminal=b.id)", "a.*,b.plan", "a.terminal = :terminal");
        $ca->bindValue(":terminal", $ter);
        if (!$ca->exec()) {
            $db->rollback();
            $a = Array();
            $a["error_text"] = "Ringow up.php ERROR:" . $ca->lastErrorText();
            $a["program_name"] = "Ringow up.php {$_SERVER["HTTP_HOST"]}";
            nwMaker::sendError($a);
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() === 0) {
            echo "NO config";
            return false;
        }
        $co = $ca->flush();
        $userbot = "Bot";
        if ($co["bot_nombre"] !== null && $co["bot_nombre"] !== false && $co["bot_nombre"] !== "") {
            $userbot = $co["bot_nombre"];
        }
        $x = Array();
        $x["terminal"] = $ter;
        $x["usuario"] = $userbot;
        $x["myuser"] = $userone;
        $x["usuario_recibe"] = $userone;
        $x["id_enc"] = $id;
        $x["mensaje"] = $co["bot_saludo"];
        $x["fecha"] = date("Y-m-d H_i:s");
        nwchat2::saveMessage($x);
    }

    $db->commit();

    $url = "index.php?idCall={$id}&apikey={$k}";
    $url .= "&term=" . $ter;
    if (isset($p["video"])) {
        $url .= "&video=" . $p["video"];
    }
    if (isset($p["audio"])) {
        $url .= "&audio=" . $p["audio"];
    }
    if (isset($p["chat"])) {
        $url .= "&chat=" . $p["chat"];
    }
    $url .= "&iam=" . $op . "&received=" . $cli;
    if (!isset($_SESSION["user_{$op}_{$ter}"])) {
        $_SESSION["user_{$op}_{$ter}"] = $op;
    }
    if (isset($p["username_show"])) {
        $url .= "&username_show=" . $p["username_show"];
    }
    if (isset($p["usernametwo_show"])) {
        $url .= "&usernametwo_show=" . $p["usernametwo_show"];
    }
    if (isset($p["userphoto"])) {
        $url .= "&userphoto=" . $p["userphoto"];
    }
    if (isset($p["userphotorecibe"])) {
        $url .= "&userphotorecibe=" . $p["userphotorecibe"];
    }
    if (isset($p["classt"])) {
        $url .= "&classt=" . $p["classt"];
    }
    if (isset($p["domain"])) {
        $url .= "&domain=" . $p["domain"];
    }
    if (isset($p["href"])) {
        $url .= "&href=" . $p["href"];
    }
    if (isset($p["useinapp"])) {
        $url .= "&useinapp=" . $p["useinapp"];
    }
    if (isset($p["usarPlantillas"])) {
        $url .= "&usarPlantillas=true";
    }
    if (isset($p["modeRingow"])) {
        $url .= "&modeRingow={$p["modeRingow"]}";
    }
    if ($namegroupgeneral !== false) {
        $url .= "&namegroupgeneral=" . $namegroupgeneral;
    }
    header("Location: {$url}");
}

$llamadacon = "";
$btnPrivate = "";
$myUser = "";
if (isset($p["t"])) {
    $ta = explode(",", $p["t"]);
    $ter = $ta["0"];
    $op = $ta["1"];
    $cli = $ta["2"];
    $op = str_replace("op=", "", $op);
    $cli = str_replace("cli=", "", $cli);
    startCall($op, $cli, $ter);
    return;
} else
if (isset($p["usuario"]) && isset($p["calling"])) {
    if (!isset($_SESSION["usuario"]) || !isset($_SESSION["terminal"])) {
        echo "Debe iniciar sesion <a href=''>Reintentar</a>";
        return;
    }
    $k = validateApiKey($_SESSION["terminal"]);
    if (!$k) {
        return;
    }
    $si = session::info();
    $db = NWDatabase::database();
    $db->transaction();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("sop_visitantes", "id", "terminal=:terminal and (userscallintern=:usuario and userscallintern_d=:usuario_recibe or userscallintern=:usuario_recibe and userscallintern_d=:usuario) order by id desc limit 1");
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":usuario_recibe", $p["usuario"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        $tip = "privado";
        if (isset($p["tip"])) {
            $tip = $p["tip"];
        }
        $id = nwchat2::validateIDCall($db);
        $ca->prepareInsert("sop_visitantes", "id,userscallintern,userscallintern_d,fecha,tipo,terminal,fecha_inicio_llamada");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":userscallintern", $si["usuario"]);
        $ca->bindValue(":userscallintern_d", $p["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H_i:s"));
        $ca->bindValue(":fecha_inicio_llamada", date("Y-m-d H_i:s"));
        $ca->bindValue(":tipo", $tip);
        $ca->bindValue(":terminal", $_SESSION["terminal"]);
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return;
        }
    } else {
        $id = $ca->flush()["id"];
    }
    $ca->prepareUpdate("nwmaker_notificaciones", "leido", "usuario_recibe=:usuario and usuario_envia=:usuario_envia and tipo='call' and leido='NO' ");
    $ca->bindValue(":usuario", $p["usuario"]);
    $ca->bindValue(":usuario_envia", $si["usuario"]);
    $ca->bindValue(":leido", "SI");
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return;
    }
    $title = "{$si["usuario"]} te está llamando";
    $userDestino = $p["usuario"];
    $link = "https://{$_SERVER["HTTP_HOST"]}/nwlib6/nwproject/modules/webrtc/testing/two/index.php?idCall={$id}";
    $mensaje = "<h1>Tienes una llamada entrante!</h1><p>Contesta dando OK!</p>";
    $mensaje .= "<p><strong>Correo </strong>{$userDestino}</p>";
    nwMaker::crearNotificacion($userDestino, $mensaje, "call", $link, "popup", false, false, false, "1", $title);

    $p["idc"] = $id;
    master::creaMensajeVideoCall($p, "uno");

    $db->commit();

    $url = "index.php?idCall={$id}";
    $url .= "&term=" . $_SESSION["terminal"];
    if (isset($p["video"])) {
        $url .= "&video=" . $p["video"];
    }
    if (isset($p["audio"])) {
        $url .= "&audio=" . $p["audio"];
    }
    if (isset($p["chat"])) {
        $url .= "&chat=" . $p["chat"];
    }
    $url .= "&iam=" . $si["usuario"] . "&received=" . $p["usuario"];
    header("Location: {$url}");
    return;
}

if (isset($p["idCall"])) {
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("sop_visitantes", "terminal,tipo,userscallintern,userscallintern_d,num_llamadas_videocall,tiempo,estado", "id=:id");
    $ca->bindValue(":id", $p["idCall"]);
    if (!$ca->exec()) {
        $a = Array();
        $a["error_text"] = "Webrtc index.php ERROR: " . $ca->lastErrorText();
        $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        echo "Error. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
//        $a = Array();
//        $a["error_text"] = "No existe la llamada";
//        $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
//        nwMaker::sendError($a);
        echo "No existe la llamada. <a href=''>Reintentar</a>";
        if (isset($p["modeRingow"]) && $p["modeRingow"] == "form") {
            ?>
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    var r = {};
                    r.idCall = "<?php echo $p["idCall"]; ?>";
                    r.tipo = "restarCallRingow";
                    r.classt = "<?php echo $p["classt"]; ?>";
                    window.parent.postMessage(r, '*');
                });
            </script>   
            <?php
        } else {
            $ter = $p["term"];
            $op = $p["received"];
            $cli = $p["iam"];
            startCall($op, $cli, $ter);
        }
        return;
    }
    $r = $ca->flush();

    $k = validateApiKey($r["terminal"]);
    if (!$k) {
        return;
    }

    if (!isset($p["chat"])) {
        $num_llamadas_videocall = 1;
        if ($r["num_llamadas_videocall"] !== null) {
            $num_llamadas_videocall = $r["num_llamadas_videocall"] + 1;
        }
        $ca->prepareUpdate("sop_visitantes", "num_llamadas_videocall", "id=:id");
        $ca->bindValue(":id", $p["idCall"]);
        $ca->bindValue(":num_llamadas_videocall", $num_llamadas_videocall);
        if (!$ca->exec()) {
            $a = Array();
            $a["error_text"] = "Webrtc index.php ERROR: " . $ca->lastErrorText();
            $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
            nwMaker::sendError($a);
            echo "Error. " . $ca->lastErrorText();
            return;
        }
    }

    if ($r["tipo"] == "privado") {
        if (!isset($_SESSION["usuario"])) {
            echo "Debe iniciar sesion";
            return;
        }
        if ($r["userscallintern"] == $si["usuario"]) {
            //soy el que llamó
            $llamadacon = "Llamada con " . $r["userscallintern_d"];
            $myUser = $r["usuario"];
        } else
        if ($r["userscallintern_d"] == $si["usuario"]) {
            //estoy recibiendo la llamada
            $llamadacon = "Llamada con " . $r["userscallintern"];
            $myUser = $r["userscallintern_d"];
        } else {
            echo "Lo sentimos, no tiene permisos para ingresar a esta llamada <a href=''>Reintentar</a>";
            return;
        }
        $btnPrivate = "<button class='cambiarStatus' data='publico' type='button' >Volver público</button>";
    } else {
        if (isset($si["usuario"]) && isset($r["usuario"])) {
            if ($r["usuario"] == $si["usuario"]) {
                $myUser = $r["userscallintern"];
            } else
            if ($r["userscallintern_d"] == $si["usuario"]) {
                $myUser = $r["userscallintern_d"];
            }
        }
        $btnPrivate = "<button class='cambiarStatus' data='privado' type='button' >Volver privado</button>";
    }
}

$actual_link = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

if (isset($p["iam"])) {
    $myUser = $p["iam"];
}
if (isset($p["t"])) {
    $ta = explode(",", $p["t"]);
    $cli = $ta["2"];
    $myUser = $ta["1"];
}

$clvi = "btnEncVideoCall_normal";
$claudi = "btnEncAudioCall_normal";

$useinapp = false;
if (isset($p["useinapp"])) {
    $useinapp = $p["useinapp"];
    $clvi = "btnEncVideoCall_in";
    $claudi = "btnEncAudioCall_in";
}

$tiempo = 0;
if ($r["tiempo"] !== null) {
    $tiempo = $r["tiempo"];
}

$conf = nwprojectOut::nwpMakerConfig();
if (isset($conf["version"])) {
    $v = $conf["version"];
} else {
    $v = rand(5, 100000);
}

$execChat = true;
//print_r($p);
//return;
if (isset($p["href"])) {
    $ro = explode("onlyVideo=", $p["href"]);
    if (isset($ro[1])) {
        if ($ro[1] == "true" || $ro[1] == "true&callingVideo=true" || $ro[1] == "true(nwampersan)callingVideo=true") {
            $execChat = false;
        }
    }
    $ro = explode("callingVideo=", $p["href"]);
    if (isset($ro[1]) && isset($r["estado"])) {
        if ($ro[1] == "true" && $r["estado"] != "EN LINEA") {
            $ca->prepareUpdate("sop_visitantes", "estado", "id=:id");
            $ca->bindValue(":id", $p["idCall"]);
            $ca->bindValue(":estado", "LLAMANDO");
            if (!$ca->exec()) {
                $a = Array();
                $a["error_text"] = "Webrtc index.php ERROR: " . $ca->lastErrorText();
                $a["program_name"] = "Webrtc index.php {$_SERVER["HTTP_HOST"]}";
                nwMaker::sendError($a);
                echo "Error. " . $ca->lastErrorText();
                return;
            }
        }
    }
}

$conf["config"]["getcompressringow"] = "true";
$conf["config"]["datepicker"] = "false";
$conf["config"]["loadcenter"] = "false";
$conf["config"]["lists"] = "false";
$conf["config"]["nwrtc"] = "true";
if (isset($p["chat"])) {
    if ($p["chat"] === "true") {
        if ($execChat) {
            $conf["config"]["nwrtc_chat"] = "true";
        }
    }
}

print nwMaker::includeCssNwMaker($conf["config"], $v);
//print nwMaker::includeJsNwMaker($conf["config"], $v);
$isOnlyChat = false;
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://www.facebook.com/2008/fbml"
      xmlns:og="http://ogp.me/ns#"
      xml:lang="es-ES" >
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>Nwrtc</title>
<!--        <link rel="stylesheet" href="css/main.css?v=<?php echo $v; ?>" />-->
        <script>
            var getVideo = false;
            var getAudio = true;
            var getChat = false;
<?php
if (isset($p["video"])) {
    if ($p["video"] === "false") {
        ?>
                    /*
                     getVideo = false;
                     */
        <?php
    }
}
if (isset($p["audio"])) {
    if ($p["audio"] === "false") {
        ?>
                    getAudio = false;
        <?php
    }
}
if (isset($p["chat"])) {
    if ($p["chat"] === "true" && $execChat) {
        $isOnlyChat = true;
        ?>
                    getVideo = false;
                    getAudio = false;
                    getChat = true;
        <?php
    }
}
?>
            var offerReceiveVideo = 1;
            var offerReceiveAudio = 1;
            if (getVideo === false) {
                /*        
                 offerReceiveVideo = 0;
                 */
            }
            if (getAudio === false) {
                /*        
                 offerReceiveAudio = 1;
                 */
            }
        </script>
        <?php
//        if (isset($p["chat"])) {
//            if ($p["chat"] === "true") {
//                
        ?>
                <!--<link rel="stylesheet" href="css/chat.css?v=//<?php echo $v; ?>" />-->
        //<?php
//            }
//        }
        ?>
    </head>
    <body>
        <div class="conectando">
            <div class="conectandoInt">
                <h2 class="conectandow" style="text-align: center;">Conectando...</h2>
                <h2 class="onlineaudio" style="text-align: center; display: none;">En línea</h2>
                <div id="loadingNwChat" class="loadingNwChat" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: #fff;">
                    <div class="cEftVf" style="top: 40%;position: relative;"></div>
                </div>

                <?php
                if (!isset($_SESSION["usuario"])) {
                    ?>
                    <div class="invite" style="display: none;">
                        <p>
                            Tu sala de conferencias ha sido creada. Puedes enviar este link a otros participantes para permitir que se unan:
                        </p>
                        <input class="boxInvite" value="<?php echo $actual_link; ?>" />
                        <br />
                        <h3>
                            Enviar invitación por e-mail
                        </h3>
                        <div class="boxBlo">
                            <p>
                                Tu nombre
                            </p>
                            <input type="text" class="nombreCorreo" />
                        </div>
                        <div class="boxBlo">
                            <p>
                                Tu e-mail
                            </p>
                            <input type="text" class="micorreoCorreo" />
                        </div>
                        <div class="boxBlo">
                            <p>
                                Correo destinatario
                            </p>
                            <input type="text" class="boxCorreo" />
                            <input type="button" class="sendCorreo" value="Enviar" />
                        </div> 
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
        <div class="containBtns">
            <input id="miuserid" type="hidden" value="<?php echo $myUser; ?>" />
            <?php echo $btnPrivate; ?>
            <button id="screenShareButton"></button>
            <form id="createRoom">
                <input id="sessionInput" placeholder="Nombre de la sala" />
                <button type='submit' >Crear sala</button>
            </form>
            <p id="subTitle"></p>
            <div class="usersConected"><?php echo $llamadacon; ?> <span>Usuarios conectados:</span> <span class="usersNumConecc">0</span></div>
        </div>
        <div class="videoContainerLocal">
            <video id="localVideo"  oncontextmenu="return false;"></video>
            <div id="localVolume" class="volume_bar"></div>
        </div>
        <div id="remotes"></div>
        <div id="messages">
            <div class="closeChat" onclick="javascript: closeChat();">x</div>
            <div class="encOptionsNwRtc">
                <div class="btnEnc useforothers"></div>
                <?php
                if (!$useinapp) {
                    
                } else {
                    ?>
                    <style>
                        .contain_input_name_end_call {
                            display: none!important;
                        }
                    </style>
                    <?php
                }
                ?>
                <div class="btnEncCredits" onclick="javascript: openPageCredits()">
                    <span>
                        Powered by
                    </span>
                </div>
            </div>
            <div class="showMessagesChat">
                <div class="escribiendoNwRtc"></div>
            </div>
            <div class="boxSendChat">
                <div class="btnAttachment">
                    <div class="btnAttachmentInt"></div>
                </div>
            </div>
        </div>
        <div class="containerButtons">
            <div  class="button chat" onclick="javascript: showMessages();" ></div>
            <div class="button muteOff" style="display: none;" onclick="javascript: soundOn();" ></div>
            <div class="button muteOn" onclick="javascript: soundOff();" ></div>
            <div class="button onCam" onclick="OffVideo()" ></div>
            <div class="button offCam"  style="display: none;" onclick="OnVideo()" ></div>
            <div class="button endCall" onclick="javascript: endCall();" style="display:none;" ></div>
            <div class="button seeRecordingAudio" onclick="javascript: stopRecordingAudio();" style="display: none;"  ></div>
            <div class="button seeRecording" onclick="javascript: seeRecording();"  style="display: none;">Ver grabación video</div>
            <!--<div class="button" id="btn-start-recording" >Grabar</div>-->
            <div class="containAudioRecord">
                <audio style="display:none;" controls autoplay muted class="audioone"></audio>
                <audio style="display:none;" controls autoplay muted class="audiotwo"></audio>
                <div class="timetrans"><?php echo $tiempo; ?></div>
            </div>
        </div>
        <audio class='operador_sound' src='/nwlib6/audio/ping.mp3' ></audio>
        <audio class='usuario_sound' src='/nwlib6/audio/blop.mp3' ></audio>
            <?php
            if ($isOnlyChat !== true) {
                ?>
            <!--RECORDING-->
            <script src="/nwlib6/nwproject/modules/webrtc/testing/two/js/RecordRTC.js"></script>
            <script src="/nwlib6/nwproject/modules/webrtc/testing/two/js/adapter-latest.js"></script>
            <!--END RECORDING-->
            <?php
        }

        print nwMaker::includeJsNwMaker($conf["config"], $v);
        ?>
<!--        <script src="js/utils.js?v=<?php echo $v; ?>"></script>
<script src="js/simplewebrtc.bundle.js?v=<?php echo $v; ?>"></script>
<script src="js/main.js?v=<?php echo $v; ?>"></script>-->
    </body>
</html>
<?php
ob_end_flush();

function comprimir_nwmaker($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}
