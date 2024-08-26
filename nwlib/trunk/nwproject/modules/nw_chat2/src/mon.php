<?php
include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

$id_sess = $_GET["id"] . $_GET["origin"];

function consulta() {
    if (count($_GET) == 0)
        return;

    $_GET["href"] = str_replace("(nwampersan)", "&", $_GET["href"]);
    $_GET["href"] = str_replace("(nwhashtag)", "#", $_GET["href"]);

    $id_sess = $_GET["id"] . $_GET["origin"];

    $data = Array();
    $data["data"] = Array();
    $data["data"]["GET"] = $_GET;
    $data["data"]["id_sess"] = $id_sess;
    $p = $data["data"];
    $get = $p["GET"];
    nwchat::initConfig($data);
    $config = nwchat::getConfigChat($id_sess);

    if (!isset($_SESSION[$id_sess]["init_call_user"])) {
        $_SESSION[$id_sess]["celular"] = "";
        $_SESSION[$id_sess]["nombre"] = "";
        $_SESSION[$id_sess]["correo"] = "";
        $_SESSION[$id_sess]["init_call_user"] = false;
        if ($config["abrir_chat_automaticamente"] === "SI") {
            $_SESSION[$id_sess]["init_call_user"] = true;
        }
    }

    if ($config["abrir_chat_automaticamente"] == "SI") {
        $_SESSION[$id_sess]["init_call_user"] = true;
        $t = $config;
        $t["launchConfigMaster"] = true;
        ?>
        <script>
            var arrayJS =<?php echo json_encode($t); ?>;
            document.addEventListener("DOMContentLoaded", function (e) {
                launchInit();
                loadMensaje();
                interval = setInterval(function () {
                    loadMensaje();
                }, 5000);
                window.parent.postMessage("loadAllFrameMonRingow", '*');

            });
        </script>
        <?php
    }

    if ($config["visitas_tiempo_real"] == "NO") {
        return false;
    }
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);

    $ip = master::getRealIp();
    $url = $get["href"];
    $device = nwMaker::getDispositivo();
    $nombre = "";
    $correo = "";
    $celular = "";
    if (isset($_SESSION[$id_sess]["nombre"])) {
        $nombre = $_SESSION[$id_sess]["nombre"];
    }
    if (isset($_SESSION[$id_sess]["email"])) {
        $correo = $_SESSION[$id_sess]["email"];
    }
    if (isset($_SESSION[$id_sess]["celular"])) {
        $celular = $_SESSION[$id_sess]["celular"];
    }

    $terminal = $config["terminal_id"];
    $tipo = "chat";
    $sys = nwMaker::getSystem();
    $navegador = $sys["browser"] . " OS:" . $sys["os"] . " V:" . $sys["version"];
    $domain = $get["origin"];
    $id_session = nwchat::set_session_id($domain);
    $re = Array();
    $re["terminal"] = $terminal;
    $re["id_sess"] = $id_sess;
    $operadores_conectados = "SI";
    if (!nwchat::consultaOperadoresConectados($re)) {
//        $operadores_conectados = "NO";
    }

    $sendMessage = false;
    $lastmessage = "";
    if ($operadores_conectados == "SI") {
        $ca->prepareSelect("sop_visitantes", "id,estado,tipo,nombre,celular,correo,mensaje_al_visitante", "id_session=:id_session and host=:host and terminal=:terminal limit 1");
        $ca->bindValue(":id_session", $id_session);
        $ca->bindValue(":host", $domain, true);
        $ca->bindValue(":terminal", $terminal);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            return false;
        }
        $estado = "VISITANDO";
        $fields = "estado,fecha,terminal,ip,fecha_ultima_interaccion_cliente,tipo,id_session,url,device,navegador,host";
        if ($ca->size() == 0) {
            $fields .= ",id";
            $id = master::getNextSequence("sop_visitantes_id_seq");
            $ca->prepareInsert("sop_visitantes", $fields);
            $sendMessage = true;
            if ($config["abrir_chat_automaticamente"] === "SI") {
                $_SESSION[$id_sess]["init_call_user"] = true;
            } else {
                $_SESSION[$id_sess]["init_call_user"] = false;
            }
        } else {
            $r = $ca->flush();
            $lastmessage = $r["mensaje_al_visitante"];
            if ($r["estado"] === "VISITANDO") {
                if ($config["abrir_chat_automaticamente"] === "SI") {
                    $_SESSION[$id_sess]["init_call_user"] = true;
                } else {
                    $_SESSION[$id_sess]["init_call_user"] = false;
                }
            }
            if ($r["estado"] == "LLAMANDO") {
                $estado = "LLAMANDO";
            } else
            if ($r["estado"] == "EN LINEA") {
                $estado = "EN LINEA";
            }
            if ($r["estado"] == "DESCONECTADO" || $r["estado"] == "FINALIZADO_POR_OPERADOR" || $r["estado"] == "FINALIZADO_POR_CLIENTE") {
                nwchat::reinitNwChat();
                nwchat::copyBackup(false, false, $id_session);
                $fields .= ",id,nombre,correo,celular";
                $id = master::getNextSequence("sop_visitantes_id_seq");
                $ca->prepareInsert("sop_visitantes", $fields);
                $sendMessage = true;
            } else {
                $id = $r["id"];
                $ca->prepareUpdate("sop_visitantes", $fields, "id_session=:id_session and terminal=:terminal");
            }
        }
        $m = Array();
        $m["id"] = $id;
        $m["id_sess"] = $id_sess;
        nwchat::setIdCall($m);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":celular", $celular);
        $ca->bindValue(":nombre", $nombre);
        $ca->bindValue(":correo", $correo);
        $ca->bindValue(":host", $get["origin"], true);
        $ca->bindValue(":terminal", $terminal);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":fecha_ultima_interaccion_cliente", date("Y-m-d H:i:s"));
        $ca->bindValue(":ip", $ip, true);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":id_session", $id_session);
        $ca->bindValue(":url", $url);
        $ca->bindValue(":device", $device);
        $ca->bindValue(":navegador", $navegador);
        if (!$ca->exec()) {
            error_log("error: " . $ca->lastErrorText());
            return false;
        }
    }

    $ms = "__automensaje__Bienvenido a nuestro sitio, ¿En qué le puedo colaborar?";
    if ($lastmessage === "" || $lastmessage === null || $lastmessage === false) {
        $sendMessage = true;
    }

    if ($sendMessage === true && $config["usar_bot"] == "SI") {
        sleep(7);
        $x = Array();
        $x["terminal"] = $terminal;
        $x["id"] = $id;
        $x["mensaje_al_visitante"] = $ms;
        $x["foto"] = $config["foto_autorespondedor"];
        $x["usuario"] = "Bot";
        $x["nombre"] = "Bot";
        $x["id_session"] = $id_session;
        nwchat::sendMensajeP($x);
    }
    if ($config["usar_bot"] === "NO") {
        $ca->prepareDelete("sop_chat", "id_session=:id_session and usuario='Bot'");
        $ca->bindValue(":id_session", $id_session, true, true);
        if (!$ca->exec()) {
            error_log("error: " . $ca->lastErrorText());
            return false;
        }
    }

    $hoy = date("Y-m-d");
    if (isset($_SESSION[$id_sess]["fechaVisitNwChat"])) {
        if ($_SESSION[$id_sess]["fechaVisitNwChat"] != $hoy) {
            $_SESSION[$id_sess]["urlNwChatVisit"] = false;
        }
    }
    $_SESSION[$id_sess]["fechaVisitNwChat"] = $hoy;
    $insertV = true;
    if (isset($_SESSION[$id_sess]["urlNwChatVisit"])) {
        if ($_SESSION[$id_sess]["urlNwChatVisit"] == $url) {
            $insertV = false;
        }
    }

    $_SESSION[$id_sess]["urlNwChatVisit"] = $url;
    if ($insertV === true) {
        $ca->prepareInsert("sop_visitas", "url,ip,terminal,fecha,visitas,id_session,domain,device,navegador,os,os_v,mobile,empresa");
        $ca->bindValue(":domain", $get["origin"]);
        $ca->bindValue(":url", $url);
        $ca->bindValue(":ip", $ip);
        $ca->bindValue(":terminal", $terminal);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":visitas", 1);
        $ca->bindValue(":id_session", $id_session);
        $ca->bindValue(":device", $device);
        $ca->bindValue(":navegador", $sys["browser"]);
        $ca->bindValue(":os", $sys["os"]);
        $ca->bindValue(":os_v", $sys["version"], true);
        $ca->bindValue(":mobile", nwMaker::getMobile());
        $ca->bindValue(":empresa", $config["empresa_nwchat"]);
        if (!$ca->exec()) {
            error_log("error: " . $ca->lastErrorText());
            return false;
        }
    }
    if ($operadores_conectados == "NO") {
        return;
    }
    return true;
}
?>
<script>
    var showMensajePush = false;

    document.addEventListener("DOMContentLoaded", function (e) {
        var get = getGET();
        if (location.host != "localhost") {
            if (location.ancestorOrigins.length == 0) {
                //                    top.location.href = "http://www.google.com";
            } else {
                if (location.ancestorOrigins[0] != get.origin) {
                    console.log("No");
                    //                        top.location.href = "http://www.google.com";
                }
            }
        }
//            console.log("Load MON");
//            loadMensaje();
//            interval = setInterval(function () {
//                loadMensaje();
//            }, 5000);
//            window.parent.postMessage("loadAllFrameMonRingow", '*');
    });


    window.addEventListener('message', function (event) {
        if (event.data == "reading") {
            readMensaje("closed");
            return;
        }
        if (event.data == "openClick") {
            readMensaje("click");
            return;
        }
        if (event.data == "conversationOpen") {
            //                clearInterval(interval);
            return;
        }
//            setTimeout(function () {
        loadMensaje();
        interval = setInterval(function () {
            loadMensaje();
        }, 5000);
//            }, 1000);

        if (~event.origin.indexOf('http://yoursite.com')) {
            //            console.log(event.data);
        } else {
            //            console.log("no puede");
        }
    });

    function launchInit() {
        arrayJS.tipo = "initConfiguration";
        window.parent.postMessage(arrayJS, '*');
    }

    function getGET() {
        return <?php echo json_encode($_GET); ?>;
        /*            
         var loc = document.location.href;
         var getString = loc.split('?')[1];
         if (getString == undefined) {
         return false;
         }
         var GET = getString.split('&');
         var get = {};
         for (var i = 0, l = GET.length; i < l; i++) {
         var tmp = GET[i].split('=');
         get[tmp[0]] = unescape(decodeURI(tmp[1]));
         }
         return get;
         */
    }

    function loadMensaje() {
        var get = getGET();
        var send = "";
        send += "origin=" + get.origin;
        send += "&href=" + get.href;
        send += "&protocol=" + get.protocol;
        send += "&host=" + get.host;
        send += "&key=" + get.key;
        send += "&id=" + get.id;
        send += "&llamadavoz=" + get.llamadavoz;
        if (showMensajePush === true) {
            send += "&showMensajePush=SI";
        } else {
            send += "&showMensajePush=NO";
        }
        send = encodeURI(send);
        var li = "/nwlib6/nwproject/modules/nw_chat2/src/monMens.php";
        var request = new XMLHttpRequest();
        request.open("POST", li, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(send);
        request.onload = function (e) {
            //                console.log(request.responseText);
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var ra = request.responseText;
                    if (ra == "iniciado") {
                        window.parent.postMessage(ra, '*');
                    }
                    if (ra == "NO_visitas_tiempo_real") {
                        clearInterval(interval);
                        return false;
                    } else
                    if (ra != "false" && ra != "nomessages" && ra != "iniciado") {
                        var pr = JSON.parse(ra);
                        if (typeof pr.new_message != "undefined") {
                            window.parent.postMessage(ra, '*');
                            return;
                        } else
                        if (showMensajePush === false) {
                            window.parent.postMessage(ra, '*');
                            if (typeof pr.launchConfigMaster == "undefined") {
                                readMensaje();
                            }
                        }
                        if (typeof pr.launchConfigMaster == "undefined") {
                            showMensajePush = true;
                        }
                    }
                } else {
                    console.error(request.statusText);
                }
            }
        };
        request.onerror = function (e) {
            console.error(request.statusText);
        };
    }

    function readMensaje(click) {
        var get = getGET();
        var send = "";
        send += "origin=" + get.origin;
        send += "&href=" + get.href;
        send += "&protocol=" + get.protocol;
        send += "&host=" + get.host;
        send += "&key=" + get.key;
        send += "&id=" + get.id;
        send += "&llamadavoz=" + get.llamadavoz;
        var li = "/nwlib6/nwproject/modules/nw_chat2/src/monMensUp.php";
        var request = new XMLHttpRequest();
        request.open("POST", li, true);
        if (click == "click") {
            clearInterval(interval);
            send += "&click=true";
        } else
        if (click == "closed") {
            send += "&closed=true";
        }
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(send);
        request.onload = function (e) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                } else {
                    console.error(request.statusText);
                }
            }
        };
        request.onerror = function (e) {
            console.error(request.statusText);
        };
    }
</script>
<?php
if (!isset($_SESSION[$id_sess]["usuario_id"])) {
    consulta();
}