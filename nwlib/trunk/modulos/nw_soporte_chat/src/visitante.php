<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == "") {
    session_start();
}
if (isset($_POST["nombre"])) {
    $_SESSION["nombre"] = $_POST["nombre"];
} else
if (isset($_GET["nombre"])) {
    $_SESSION["nombre"] = $_GET["nombre"];
} else {
    $_SESSION["nombre"] = "";
}

if (isset($_GET["correo"])) {
    $_SESSION["email"] = $_GET["correo"];
} else
if (isset($_POST["correo"])) {
    $_SESSION["email"] = $_POST["correo"];
} else {
    $_SESSION["email"] = "";
}

if (isset($_GET["celular"])) {
    $_SESSION["celular"] = $_GET["celular"];
} else
if (isset($_POST["celular"])) {
    $_SESSION["celular"] = $_POST["celular"];
} else {
    $_SESSION["celular"] = "";
}

if (isset($_POST["enviar_carpet"])) {
    $_SESSION["enviar_carpet"] = $_POST["enviar_carpet"];
}
if (isset($_GET["enviar_carpet"])) {
    $_SESSION["enviar_carpet"] = $_GET["enviar_carpet"];
}

$usuario = $_SESSION["nombre"];
$correo = $_SESSION["email"];
$celular = $_SESSION["celular"];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link href="/nwlib6/modulos/nw_soporte_chat/css/visitante.css" rel="stylesheet" type="text/css" />
    </head>
    <body onunload="unload();">
        <script type="text/javascript" src="/nwlib6/includes/jquery/jquery-1.4.2.min.js" ></script>
        <?php
        $id_terminal = "";
        $key = "";
        $keyFrame = "";
        if (isset($_POST["id_t"])) {
            if ($_POST["id_t"] != "") {
                $id_terminal = $_POST["id_t"];
            }
        }
        if (isset($_GET["id_t"])) {
            if ($_GET["id_t"] != "") {
                $id_terminal = $_GET["id_t"];
            }
        }
        if (isset($_POST["key"])) {
            if ($_POST["key"] != "") {
                $key = $_POST["key"];
            }
        }
        if (isset($_GET["key"])) {
            if ($_GET["key"] != "") {
                $key = $_GET["key"];
            }
        }
        if (isset($_POST["host"])) {
            if ($_POST["host"] != "") {
                $host_get = $_POST["host"];
            }
        }
        if (isset($_GET["host"])) {
            if ($_GET["host"] != "") {
                $host_get = $_GET["host"];
            }
        }
        if (isset($_POST["iframe"])) {
            if ($_POST["iframe"] == "iframeNWfrtdv2154rdvgtf6yr54redTYrewew") {
                $keyFrame = $_POST["iframe"];
            }
        } else
        if (isset($_GET["iframe"])) {
            if ($_GET["iframe"] == "iframeNWfrtdv2154rdvgtf6yr54redTYrewew") {
                $keyFrame = $_GET["iframe"];
            }
        }
        if ($id_terminal == "") {
            return;
        }
        if ($key == "") {
            return;
        }
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
        } else
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        } else {
            $id = 0;
        }

        $db = NWDatabase::database();
        $c_init = new NWDbQuery($db);
        $_SERVER["HTTP_HOST"] = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
        $where = "id=:id and clave=:key";
        if ($_SERVER["HTTP_HOST"] != $host_get) {
            $where .= " and host=:host ";
        }
        $c_init->prepareSelect("terminales", "id", $where);
        $c_init->bindValue(":id", $id_terminal);
        if ($keyFrame == "iframeNWfrtdv2154rdvgtf6yr54redTYrewew") {
            $c_init->bindValue(":host", "netwoods.net");
        } else {
            $c_init->bindValue(":host", $host_get);
        }
        $c_init->bindValue(":key", $key, true, true);

        if (!$c_init->exec()) {
            echo "No se pudo realizar la consulta... " . $c_init->lastErrorText();
            return;
        }

        if ($c_init->size() == 0) {
            return;
        }
        $estado = "LLAMANDO";
        $atiende = "";
        $caNw = new NWDbQuery($db);
        $cf = new NWDbQuery($db);
//        $cf = new NWDbQuery($db);
        //ENVÍO NOTIFICACIÓN A QXNW A TODOS LOS USUARIOS CONECTADOS
//        $ck = new NWDbQuery($db);
//        $cj = new NWDbQuery($db);
//        $ch = new NWDbQuery($db);
//        $ci = new NWDbQuery($db);
//        $ck->prepareSelect("usuarios", "usuario", "conectado='SI' and estado='activo' and cliente='0'");
//        if (!$ck->exec()) {
//            echo "No se pudo realizar la consulta. ";
//            return;
//        }
//        if ($ck->size() == 0) {
//            echo "No se han encontrado datos";
//        }
//        for ($i = 0; $i < $ck->size(); $i++) {
//            $ck->next();
//            $r_user = $ck->assoc();
//            $cj->prepareSelect("nw_notifications", "max(id) as id");
//            $cj->exec();
//            $cj->next();
//            $r_notifi = $cj->assoc();
//            $id_new_notify = $r_notifi["id"] + 1;
//            $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
//                                            values ($id_new_notify, 'NWCHAT_SOPORTE', :asunto, :usuario, :fecha, :empresa)";
//            $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
//            $ch->bindValue(":usuario", $r_user["usuario"]);
//            $ch->bindValue(":empresa", 1);
//            $ch->bindValue(":asunto", "¡NUEVA LLAMADA DE CHAT SOPORTE! Llamando " . $_POST["nombre"]);
//            $ch->prepare($sqlMovNot);
//            if (!$ch->exec()) {
//                echo "errores";
//                return;
//            }
//            $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
//                                                   values ($id_new_notify, false,  :usuario, :fecha)";
//            $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
//            $ci->bindValue(":usuario", $r_user["usuario"]);
//            $ci->prepare($sqlMovNotDet);
//            if (!$ci->exec()) {
//                echo "errores";
//                return;
//            }
//        }
        //FIN ENVÍO NOTIFICACIÓN A QXNW
//        if ($id != 0) {
        if (isset($_COOKIE["$id_terminal"])) {
            $id_visita = $_COOKIE["$id_terminal"];
        } else {
            $id_new_ = master::getNextSequence("sop_visitantes_id_seq");
            $id_visita = $id_new_;
            if (headers_sent()) {
                // las cabeceras ya se han enviado, no intentar añadir una nueva
            } else {
                setcookie("$id_terminal", $id_visita, time() + (86400 * 1), "/");
            }
//            setcookie("$id_terminal", $id_visita, time() + (86400 * 1), "/");
        }
        if (!isset($_COOKIE["real_ip"])) {
            $real_ip = master::getRealIp();
            if (headers_sent()) {
                // las cabeceras ya se han enviado, no intentar añadir una nueva
            } else {
                setcookie("real_ip", $real_ip);
            }
//            setcookie("real_ip", $real_ip);
        } else {
            $real_ip = $_COOKIE["real_ip"];
        }
//        $h = "";
//        if ($_SERVER["HTTP_HOST"] != "nwadmin.gruponw.com") {
        $h = "and host=:host";
//        }
        $cf->prepareSelect("sop_visitantes", "id, estado,atiende", "id=:id $h and terminal=:terminal");
        $cf->bindValue(":host", $host_get);
        $cf->bindValue(":id", $id_visita);
        $cf->bindValue(":ip", $real_ip, true);
        $cf->bindValue(":terminal", $id_terminal);
        if (!$cf->exec()) {
            echo "errores: " . $cf->lastErrorText();
            return;
        }
        if ($cf->size() > 0) {
            $ra = $cf->size();
            if ($ra["estado"] != "ATENDIDO") {
                $caNw->prepareUpdate("sop_visitantes", "nombre, correo, estado, fecha, celular", "id=:id $h and terminal=:terminal");
            }
        } else {
            $caNw->prepareInsert("sop_visitantes", "id,nombre, correo, estado, fecha, host, terminal, celular");
        }
        $caNw->bindValue(":id", $id_visita);
        $caNw->bindValue(":celular", $celular);
        $caNw->bindValue(":nombre", $usuario);
        $caNw->bindValue(":correo", $correo);
        $caNw->bindValue(":host", $host_get);
        $caNw->bindValue(":terminal", $id_terminal);
        $caNw->bindValue(":estado", "LLAMANDO");
//        $caNw->bindValue(":url", $host_get);
        $caNw->bindValue(":fecha", date("Y-m-d H:i:s"));

        if ($cf->size() == 0) {
            if (!$caNw->exec()) {
                echo "errores line 173. $id_terminal " . $caNw->lastErrorText();
                return;
            }
        }

        $id_new = $id_visita;

        $mensaje_buscando_op = "Un momento por favor, estamos consultando un operador para atender su llamada. Gracias.";

        $cconf = new NWDbQuery($db);
        $cconf->prepareSelect("sop_config", "mensaje_buscando_op", "terminal=:terminal");
        $cconf->bindValue(":terminal", $id_terminal);
        if (!$cconf->exec()) {
            echo "Error al consultar la configuración. " . $cconf->lastErrorText();
            return;
        }
        if ($cconf->size() > 0) {
            $r_cconf = $cconf->flush();
            $mensaje_buscando_op = $r_cconf["mensaje_buscando_op"];
        }
        ?>
        <div class="conversaciones" id="conversaciones">
            <div class="text_bienvenido">
                <h1>
                    Bienvenido <?php echo $_SESSION["nombre"]; ?>
                </h1>
                <p>
                    Llamada N° <?php echo $id_new; ?>
                </p>
            </div>

            <script>

        $(window).load(function() {
            initChat();
        });

        $(document).ready(function() {
            vista();
        });

        $(window).resize(function() {
            vista();
        });

        function vista() {

            var altoTotal = $(window).height();
            var altoBox = $(".box_text_envia").height();
            var altoCenter = altoTotal - altoBox;
            $(".conversaciones").height(altoCenter);

        }

        function initChat() {
            $(".calificando").click(function() {
                var c = $(this).attr("data");
                calificar(c);
                $(".calificando").removeClass("califica_selected");
                $(this).addClass("califica_selected");
            });
            $(".silenciar").click(function() {
                sonido();
            });
            sonido();
            var data_form = {};
            data_form["tipo_user"] = "Autocontestador";
            data_form["nombre"] = "Autocontestador";
            data_form["texto"] = "<?php echo $mensaje_buscando_op; ?>";
            data_form["id_t"] = <?php echo $id_terminal; ?>;
            $.ajax({
                type: "POST",
                url: "/nwlib6/modulos/nw_soporte_chat/src/int_chat.php",
                data: data_form,
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert(data);
                    }
                    chats();
                    setTimeout(function() {
                        scroll();
                    }, 1000);
                    timer = setInterval("chats()", 5000);
                    scroll();
                }
            });
        }
        function sonido() {
            if (localStorage["play_timbre"] != "NO") {
                localStorage["play_timbre"] = "NO";
                $(".silenciar").html("Poner Timbre");
            } else {
                localStorage["play_timbre"] = "SI";
                $(".silenciar").html("Silenciar");
            }
        }
        function chats() {
            $.ajax({
                type: "POST",
                url: "/nwlib6/modulos/nw_soporte_chat/src/load_chats.php",
                data: {id_t:<?php echo $id_terminal; ?>},
                error: function() {
                    console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
                },
                success: function(data) {
                    $("#conversations").html(" ");
                    $("#conversations").html(data);
                }
            });
        }
        function inactivity(p) {
            clearTimeout(timer);
            clearTimeout(usuario_inactivo);
            $(".contain_cajas").remove();
            var finaliza = "NO";
            if (p == "SI") {
                finaliza = "SI";
            }
            $("#inactive").load('/nwlib6/modulos/nw_soporte_chat/src/inactive.php', {
                id_t: <?php echo $id_terminal; ?>,
                nombre: '<?php echo $usuario; ?>',
                param: finaliza
            });
        }
        function scroll() {
            var he = $("#conversations").height() * 2;
            $(".conversaciones").animate({scrollTop: he + 'px'}, 1000);
            if (localStorage["play_timbre"] != "NO") {
                document.getElementById('player').play();
            }
            playing = true;
        }
        function unload() {
            var url_data = "/nwlib6/modulos/nw_soporte_chat/src/cerrar.php";
            $.ajax({
                type: "POST",
                url: url_data,
                data: {},
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    console.log("sale");
                }
            });
        }
        function update() {
            var url_data = "/nwlib6/modulos/nw_soporte_chat/src/int_chat.php";
            var data_form = $("#form_chat").serialize();
            $('#texto').val('');
            $.ajax({
                type: "POST",
                url: url_data,
                data: data_form,
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert(data);
                    }
                    chats();
                }
            });
        }
        function calificar(c) {
            var url_data = "/nwlib6/modulos/nw_soporte_chat/src/calificar.php";
            var data_form = $("#form_chat").serialize();
            data_form += "&calificacion=" + c;
            $.ajax({
                type: "POST",
                url: url_data,
                data: data_form,
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert(data);
                    }
                }
            });
        }

        ini();

        document.body.onclick = function() {
            parar();
        };
        document.body.onmousemove = function() {
            parar();
        };
        var usuario_inactivo;
        function ini() {
            usuario_inactivo = setTimeout('inactivity()', 900000); // 100 segundos
        }
        function parar() {
            clearTimeout(usuario_inactivo);
            usuario_inactivo = setTimeout('inactivity()', 900000); // 100 segundos
        }
            </script>
            <audio id="player" src="/nwlib6/modulos/nw_soporte_chat/src/ring.mp3"> </audio>
            <div id="conversations"></div>
            <div id="inactive"></div>
        </div>
        <div class="box_text_envia">
            <form action="javascript: update();" method="post" name="form_chat" id="form_chat">
                <input type="hidden" name="id" value="<?php echo $id; ?>" />
                <input type="hidden" name="nombre" value="<?php echo $usuario; ?>" />
                <input type="hidden" value="<?php echo $id_terminal; ?>" name="id_t" class="id_t" id="id_t" />
                <input type="hidden" value="<?php echo $host_get; ?>" name="host" class="host" id="host" />
                <input type="hidden" value="<?php echo $key; ?>" name="key" class="key" id="key" />
                <div class="contain_button">
                    <p class="silenciar">
                        Silenciar
                    </p>
                    <div class="calificar">
                        <p>Califica el servicio</p>
                        <div data='1' class="calificando calificar1">
                            Malo
                        </div>
                        <div data='2' class="calificando calificar2">
                            Regular
                        </div>
                        <div data='3' class="calificando calificar3">
                            Aceptable
                        </div>
                        <div data='4' class="calificando calificar4">
                            Bueno
                        </div>
                        <div data='5' class="calificando calificar5">
                            Excelente
                        </div>
                    </div>
                </div>
                <div class="contain_cajas">
                    <input type="text" name="texto" id="texto" class="required" value="" />
                    <input id="envia_message" type="submit" value="Enviar" />
                </div>
            </form>
        </div>
    </body>
</html>