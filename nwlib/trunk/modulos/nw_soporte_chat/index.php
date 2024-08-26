<?php
if (!isset($chatNwInsert)) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
}
require_once "scripts.php";
$soft = "";
if (!isset($chatNwInsert)) {
    if (isset($_GET["device"])) {
        $soft = $_GET["device"];
    }
    if (!isset($_GET["id"])) {
        return;
    }
    if ($_GET["id"] == "") {
        return;
    }
    if (!isset($_GET["key"])) {
        return;
    }
    if ($_GET["key"] == "") {
        return;
    }
    if (!isset($_GET["host"])) {
        return;
    }
    if ($_GET["host"] == "") {
        return;
    }
}
if (!isset($chatNwInsert)) {
    $id_terminal = $_GET["id"];
    $key = $_GET["key"];
    $host_get = $_GET["host"];
    $domain_referrer = $_SERVER['HTTP_REFERER'];
} else {
    $id_terminal = 1;
    $key = 1741992;
    $_SERVER["HTTP_HOST"] = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
    $host_get = $_SERVER["HTTP_HOST"];
    $domain_referrer_dos = $_SERVER["HTTP_HOST"];
    $domain_referrer = $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
}
global $url_stay;
$url_stay = "";
//print_r($_SERVER);
if (isset($_SERVER["HTTP_REFERER"])) {
    $url_stay = $_SERVER["HTTP_REFERER"];
} else {
//    $url_stay = "http://{$_SERVER["HTTP_HOST"]}/{$url_sites}";
    $url_stay = $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
}
$dominio = saca_dominio($domain_referrer_dos);
//$domain_principal = $domain_referrer;
//print_r($url_stay);
$domain_principal = saca_dominio($domain_referrer_dos);
if ($soft == "") {
//    if ($host_get != $domain_principal) {
    if ($host_get != $dominio) {
        return;
    }
} else
if ($soft == "qxnw") {
    $id_terminal = "2";
} else
if ($soft == "qxnwIntoEmbed") {
    $id_terminal = "2";
} else
if ($soft == "qxnwIntoEmbedOthers") {
    $id_terminal = "2";
} else {
    if ($host_get != $dominio) {
        return;
    }
}

$nave = getNav();
$user = "";
$mail = "";
$dispositivo = $_SERVER["HTTP_USER_AGENT"];
//ES PROBABLE QUE EL USUARIO SEA DE QXNW
if (isset($_GET["user"])) {
    $user = $_GET["user"];
}
if (isset($_GET["mail"])) {
    $mail = $_GET["mail"];
}
//SACO LA IP DEL USUARIO
//include("geoiploc.php");
if (empty($_POST['checkip'])) {
    $ip = $_SERVER["REMOTE_ADDR"];
} else {
    $ip = $_POST['checkip'];
}
$real_ip = master::getRealIp();
//$real_ip = $ip;
//setcookie("real_ip", $real_ip);
if (headers_sent()) {
    // las cabeceras ya se han enviado, no intentar añadir una nueva
} else {
    setcookie("real_ip", $real_ip);
}
$id_visita = "";
//CONSULTO LA CIUDAD O PAÍS
//$country = "";
//$country = getCountryFromIP($ip, " NamE");
$country = "";
//$country_code = getCountryFromIP($ip, "code");
$country_code = "";
//    if (function_exists('geoip_country_name_by_name')) {
//        $country = @geoip_country_name_by_name($real_ip);
//    }
$img_offline = "/nwlib" .  master::getNwlibVersion() . "/modulos/nw_soporte_chat/img/offline.png";
$img_online = "/nwlib" .master::getNwlibVersion() . "/modulos/nw_soporte_chat/img/offline.png";
if (!isset($chatNwInsert)) {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
    <html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
            <meta name="apple-touch-fullscreen" content="YES" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/includes/jquery/jquery-1.4.2.min.js" ></script>
            <script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/js/nw.js"></script> 
            <link href="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/css/css.css" rel="stylesheet" type="text/css" charset="utf-8"/>
        </head>
        <body onunload="unload();"> 
            <?php
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//SI EL CHAT NO ESTÁ EN QXNW VERIFICA QUE LA TERMINAL EXISTA
//LA TERMINAL SE DECLARA POR GET ID
        if ($soft == "") {
            $c_init = new NWDbQuery($db);
            $_SERVER["HTTP_HOST"] = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
            $where = "id=:id and clave=:key";
            if ($_SERVER["HTTP_HOST"] != $domain_principal) {
//                $where .= " and host=:host ";
            }
            $where .= " order by id asc limit 1  ";
            $c_init->prepareSelect("terminales", "id", $where);
            $c_init->bindValue(":id", $id_terminal);
            $c_init->bindValue(":host", $domain_principal);
            $c_init->bindValue(":key", $key, true, true);
            if (!$c_init->exec()) {
                echo "No se pudo realizar la consulta  $id_terminal $domain_principal $key " . $c_init->lastErrorText();
                return;
            }
            if ($c_init->size() == 0) {
//                echo "alexf $id_terminal ";
//                return;
//                return;
            }
        }
//CONSULTO LA CONFIGURACIÓN DEL CHAT POR LA TERMINAL
        $cconf = new NWDbQuery($db);
        $cconf->prepareSelect("sop_config", "*", "terminal=:terminal");
        $cconf->bindValue(":terminal", $id_terminal);
        if (!$cconf->exec()) {
            echo "Error al consultar la configuración. " . $ca->lastErrorText();
            return;
        }
        if ($cconf->size() > 0) {
            $cconf->next();
            $r_cconf = $cconf->assoc();
            $img_offline = $r_cconf["img_offline"];
            $img_online = $r_cconf["img_online"];
        }
//CONSULTO LOS OPERADORES EN LÍNEA
        $oper = new NWDbQuery($db);
//        $oper->prepareSelect("sop_operadores", "*", "terminal=:terminal and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') and (EXTRACT(EPOCH FROM fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 1800))");
        $oper->prepareSelect("sop_operadores", "*", "terminal=:terminal and estado<>'NO_CONECTADO' and estado<>'DESCONECTADO' ");
        $oper->bindValue(":terminal", $id_terminal);
        if (!$oper->exec()) {
            echo "No se pudo realizar la consulta" . $ca->lastErrorText();
            return;
        }
        if (isset($_COOKIE["$id_terminal"])) {
            $id_visita = $_COOKIE["$id_terminal"];
        } else {
            $id_new = master::getNextSequence("sop_visitantes_id_seq");
            $id_visita = $id_new;
            if (headers_sent()) {
                // las cabeceras ya se han enviado, no intentar añadir una nueva
            } else {
                setcookie("$id_terminal", $id_visita, time() + (86400 * 1), "/");
            }
        }
        $conectados = $oper->size();
//        ESTO REVISA SI EL USUARIO YA HABÍA ENTRADO POR LA IP // LO INSERTA O LO ACTUALIZA PARA SABER DONDE ESTÁ Y EL TIEMPO
        $cb = new NWDbQuery($db);
        $cb->prepareSelect("sop_visitantes", "id,estado,nombre,correo", "id=:id and host=:host and terminal=:terminal");
        $cb->bindValue(":id", $id_visita);
        $cb->bindValue(":host", $domain_principal);
        $cb->bindValue(":terminal", $id_terminal);
        if (!$cb->exec()) {
            echo "No se pudo realizar la consulta" . $cb->lastErrorText();
            return;
        }
        $fields = "nombre,correo,host,ip,estado,fecha,url,navegador,terminal,pais,ciudad,latitud,longitud,device";
        if ($cb->size() == 0) {
            $fields .= ",id";
            $id_new = master::getNextSequence("sop_visitantes_id_seq");
            $id_visita = $id_new;
            if (headers_sent()) {
                // las cabeceras ya se han enviado, no intentar añadir una nueva
            } else {
                setcookie("$id_terminal", $id_visita, time() + (86400 * 1), "/");
            }
            $ca->prepareInsert("sop_visitantes", $fields);
            if (isset($_COOKIE["nombre"])) {
                $user = $_COOKIE["nombre"];
            }
            if (isset($_COOKIE["correo"])) {
                $mail = $_COOKIE["correo"];
            }
        } else {
            $cb->next();
            $rb = $cb->assoc();
            if ($rb["estado"] != "LLAMANDO" || $rb["estado"] != "CONECTADO" || $rb["estado"] != "ATENDIDO") {
                $ca->prepareUpdate("sop_visitantes", $fields, "id=:id");
                $id_new = $rb["id"];
                $user = $rb["nombre"];
                $mail = $rb["correo"];
            }
        }
        $ca->bindValue(":id", $id_new);
        $ca->bindValue(":nombre", $user);
        $ca->bindValue(":correo", $mail);
        $ca->bindValue(":host", $domain_principal);
        $ca->bindValue(":ip", $real_ip, true);
        $ca->bindValue(":estado", "VISITANDO");
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":fecha_sola", date("Y-m-d H:i:s"));
        $ca->bindValue(":url", $url_stay);
        $ca->bindValue(":navegador", $nave);
        $ca->bindValue(":terminal", $id_terminal);
        $ca->bindValue(":device", $dispositivo);
        $ca->bindValue(":pais", $country);
        $city = "";
        $lat = "";
        $lon = "";
        if (function_exists('geoip_record_by_name')) {
            $rab = @geoip_record_by_name($real_ip);
            if (isset($rab["city"])) {
                $city = utf8_encode($rab["city"]);
            }
            if (isset($rab["latitude"])) {
                $lat = $rab["latitude"];
            }
            if (isset($rab["longitude"])) {
                $lon = $rab["longitude"];
            }
        }
        $ca->bindValue(":ciudad", $city, true, true);
        $ca->bindValue(":latitud", $lat, true, true);
        $ca->bindValue(":longitud", $lon, true, true);
        if ($soft != "qxnwIntoEmbed") {
            if (isset($rb["estado"])) {
                if ($rb["estado"] != "LLAMANDO" || $rb["estado"] != "CONECTADO" || $rb["estado"] != "ATENDIDO") {
                    if (!$ca->exec()) {
                        echo "errores line 233. " . $ca->lastErrorText();
                        return;
                    }
                }
            } else
            if ($soft == "qxnw") {
                if (!$ca->exec()) {
                    echo "errores line 240. " . $ca->lastErrorText();
                    return;
                }
            } else
            if (!$ca->exec()) {
                echo "errores  line 245. " . $ca->lastErrorText() . " Query: " . $ca->preparedQuery();
                return;
            }
        }
        insertVisita($id_visita, $real_ip, $id_terminal);
        if (!isset($chatNwInsert)) {
            ?>
            <script type="text/javascript">
            var idUser = <?php echo $id_new; ?>;
            function unload() {
                var url_data = "/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/src/cerrar.php";
                $.ajax({
                    type: "POST",
                    url: url_data,
                    data: {id: idUser},
                    error: function() {
                        alert("unload!");
                    },
                    success: function(data) {
                    }
                });
                return false;
            }
            </script>
            <?php
        }
//SI EL USUARIO NO ESTÁ EN QXNW
        if ($soft == "") {
            if (!isset($chatNwInsert)) {
                ?>
                <script>
                    $(window).load(function() {
                        $("#nw_button_chat").click(function() {
                            $('#myform').submit();
                        });
                    });
                    $(document).ready(function() {
                        $('#myform').submit(function() {
                            window.open('', 'formpopup', 'width=600,height=550,resizeable,scrollbars');
                            this.target = 'formpopup';
                        });
                    });
                </script>
                <?php
            }
            ?>
            <form id="myform" action="/nwchating" method="post" style="display: none;">
                <input type="hidden" value="<?php echo $id_new; ?>" name="id" class="id" id="id" />
                <input type="hidden" value="<?php echo $id_terminal; ?>" name="id_t" class="id_t" id="id_t" />
                <input type="hidden" value="<?php echo $host_get; ?>" name="host" class="host" id="host" />
                <input type="hidden" value="<?php echo $key; ?>" name="key" class="key" id="key" />
                <input type="hidden" value="<?php echo $user; ?>" name="user" class="user" id="user" />
                <input type="hidden" value="<?php echo $mail; ?>" name="mail" class="mail" id="mail" />
            </form>
            <div class="nw_button_chat buttonNwChat" id="nw_button_chat">
                <?php
                if ($conectados == 0) {
                    echo "<img alt='chat' src=" . $img_offline . " />";
                } else {
                    echo "<img alt='chat' src=" . $img_online . " />";
                }
                ?>
            </div>
            <?php
        } else
        if ($soft == "qxnw") {
            ?>
            <script>
                function open_nwchatdevice(id, user, mail) {
                    $(".device_nw").load('/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_soporte_chat/src/chat.php', {
                        id: id,
                        user: user,
                        mail: mail,
                        id_t: "2",
                        key: "frtdv2154rdvgtf6yr54redTYrewew",
                        host: "netwoods.net"
                    });
                }
                $(window).load(function() {
                    open_nwchatdevice(<?php echo $id_new; ?>, '<?php echo $user; ?>', '<?php echo $mail; ?>');
                });
            </script>
            <div class="device_nw" id="device_nw"></div>
            <?php
        } else
        if ($soft == "qxnwIntoEmbed") {
            $userr = "Invitado";
            $maill = "";
            if (isset($_GET["user"]) && $_GET["user"] != "") {
                $userr = $_GET["user"];
            }
            if (isset($_GET["mail"]) && $_GET["mail"] != "") {
                $maill = $_GET["mail"];
            }
            ?>
            <script>
                $(window).load(function() {
                    $("#nw_button_chat").click(function() {
                        $('#myform').submit();
                    });
                });
                $(document).ready(function() {
                    $('#myform').submit(function() {
                        window.open('', 'formpopup', 'width=600,height=550,resizeable,scrollbars');
                        this.target = 'formpopup';
                    });
                });
            </script>
            <form id="myform" action="/nwchatLive" method="post" style="display: none;">
                <input type="hidden" value="<?php echo $id_new; ?>" name="id" class="id" id="id" />
                <input type="hidden" value="<?php echo $id_terminal; ?>" name="id_t" class="id_t" id="id_t" />
                <input type="hidden" value="<?php echo $host_get; ?>" name="host" class="host" id="host" />
                <input type="hidden" value="<?php echo $_SERVER['HTTP_REFERER']; ?>" name="host" class="host" id="host" />
                <input type="hidden" value="iframeNWfrtdv2154rdvgtf6yr54redTYrewew" name="iframe" class="iframe" id="iframe" />
                <input type="hidden" value="<?php echo $key; ?>" name="key" class="key" id="key" />
                <input type="hidden" value="<?php echo $userr; ?>" name="nombre" class="nombre" id="nombre" />
                <input type="hidden" value="<?php echo $maill; ?>" name="correo" class="correo" id="correo" />
            </form>
            <div class="nw_button_chat" id="nw_button_chat">
                <?php
                if ($conectados == 0) {
                    echo "<img alt='nwchat' src=" . $img_offline . " />";
                } else {
                    ?>
                    <div style='position: relative;
                         position: relative;
                         background: rgb(83, 160, 167);
                         color: #fff;
                         height: 100px;
                         padding: 10px;
                         border-radius: 10px;
                         font-family: arial;
                         font-size: 14px;
                         '>
                        <h3 style='
                            padding: 0;
                            margin: 0;'
                            >Soporte</h3>
                        <p style='padding: 0;
                           margin: 0;
                           '
                           > en Línea</p><img  alt='nwchat' src='http://www.netwoods.net/imagenes/imagenes_2012/logo_menu_kid.png' style='
                           float: right;
                           width: 80px;
                           margin-top: -35px;
                           left: 10px;
                           position: relative;
                           '/></div>
                        <?php
                    }
                    ?>
                Inicia chat
            </div>
            <?php
        } else
        if ($soft == "qxnwIntoEmbedOthers") {
            $userr = "Invitado";
            $maill = "";
            if (isset($_GET["user"]) && $_GET["user"] != "") {
                $userr = $_GET["user"];
            }
            if (isset($_GET["mail"]) && $_GET["mail"] != "") {
                $maill = $_GET["mail"];
            }
            ?>
            <script>
                $(window).load(function() {
                    $("#nw_button_chat").click(function() {
                        $('#myform').submit();
                    });
                });
                $(document).ready(function() {
                    $('#myform').submit(function() {
                        window.open('', 'formpopup', 'width=600,height=550,resizeable,scrollbars');
                        this.target = 'formpopup';
                    });
                });
            </script>
            <form id="myform" action="/nwchating" method="post" style="display: none;">
                <input type="hidden" value="<?php echo $id_new; ?>" name="id" class="id" id="id" />
                <input type="hidden" value="<?php echo $id_terminal; ?>" name="id_t" class="id_t" id="id_t" />
                <input type="hidden" value="<?php echo $host_get; ?>" name="host" class="host" id="host" />
                <input type="hidden" value="iframeNWfrtdv2154rdvgtf6yr54redTYrewew" name="iframe" class="iframe" id="iframe" />
                <input type="hidden" value="<?php echo $key; ?>" name="key" class="key" id="key" />
                <input type="hidden" value="<?php echo $userr; ?>" name="nombre" class="nombre" id="nombre" />
                <input type="hidden" value="<?php echo $maill; ?>" name="correo" class="correo" id="correo" />
            </form>
            <div class="nw_button_chat" id="nw_button_chat">
                <?php
                if ($conectados == 0) {
                    echo "<img  alt='nwchat' src=" . $img_offline . " />";
                } else {
                    echo "<div style='position: relative;
position: relative;
background: rgb(83, 160, 167);
color: #fff;
height: 100px;
padding: 10px;
border-radius: 10px;
font-family: arial;
font-size: 14px;
'>
<h3 style='
padding: 0;
margin: 0;'
>Soporte</h3>
<p style='padding: 0;
margin: 0;
'
> en Línea</p><img  alt='nwchat' src='http://www.netwoods.net/imagenes/imagenes_2012/logo_menu_kid.png' style='
float: right;
width: 80px;
margin-top: -35px;
left: 10px;
position: relative;
'/></div>";
                }
                ?>
                Inicia chat
            </div>
            <?php
        }
        if (!isset($chatNwInsert)) {
            ?>
        </body>
    </html>
    <?php
}
?>