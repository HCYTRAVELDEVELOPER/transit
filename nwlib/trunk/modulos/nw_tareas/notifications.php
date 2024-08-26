<?php
//require_once dirname(__FILE__) . '/../../rpcsrv/_mod.inc.php';
if (session_id() == "") {
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    if (!function_exists("GetSQLValueString")) {

        function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
            $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

            $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

            switch ($theType) {
                case "text":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "long":
                case "int":
                    $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                    break;
                case "double":
                    $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                    break;
                case "date":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "defined":
                    $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                    break;
            }
            return $theValue;
        }

    }
}

if (!isset($_SESSION["id"])) {
    return;
}

function movimientos() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $cc = new NWDbQuery($db);
//    $wherec = "";
//    $where = "";
//    $where .= " where 1=1 and a.accion='Tarea Nueva' and b.usuario_asignado=:user and b.usuario<>:usuario_text and a.leido='NO' or NULL ";
//    $sqla = "select a.accion
//    FROM tareas_diarias_movs a
//    left join tareas_diarias b on (a.id_tarea=b.id) " . $where;

    $where1 = " where 1=1 and a.accion='Tarea Nueva' and b.usuario_asignado=:user and b.usuario<>:usuario_text and a.leido='NO' or NULL ";
    $where2 = " where 1=1 and c.accion!='Tarea Nueva' and d.usuario_asignado<>:user and d.usuario=:usuario_text and c.leido='NO' or NULL ";
    $where2 .= " order by id desc";
    $sqla = "select a.id,a.accion, b.usuario as user,b.tarea
    FROM tareas_diarias_movs a
    left join tareas_diarias b on (a.id_tarea=b.id) 
    $where1 
    UNION 
    select c.id,c.accion,func_concepto(d.usuario_asignado, 'usuarios') as user,d.tarea
    FROM tareas_diarias_movs c
    left join tareas_diarias d on (c.id_tarea=d.id) 
    $where2 ";
    $ca->prepare($sqla);
    $ca->bindValue(":user", $_SESSION["id"]);
    $ca->bindValue(":usuario_text", $_SESSION["usuario"]);
    if (!$ca->exec()) {
        echo "no se pudo consultar";
        return;
    }
//    $wherec .= " where 1=1 and a.accion!='Tarea Nueva' and b.usuario_asignado<>:user and b.usuario=:usuario_text and a.leido='NO' or NULL ";
//    $sqlc = "select a.accion
//    FROM tareas_diarias_movs a
//    left join tareas_diarias b on (a.id_tarea=b.id) " . $wherec;
//    $cc->prepare($sqlc);
//    $cc->bindValue(":user", $_SESSION["id"]);
//    $cc->bindValue(":usuario_text", $_SESSION["usuario"]);
//    if (!$cc->exec()) {
//        echo "no se pudo consultar";
//        return;
//    }
//    $tareas_nuevas = $ca->size();
//    $tareas_estados = $cc->size();
    global $tareas_total;
//    $tareas_total = $tareas_nuevas + $tareas_estados;
    $tareas_total = $ca->size();
    if ($tareas_total == 0) {
        $tareas_total = "0";
        echo "<style type='text/css'>.icons_notificas{background-position: -40px -182px;}</style>";
        $back_color = "#313131";
    } else {
        echo "<style type='text/css'>.icons_notificas{background-position: 17px -155px;background-size: 85px;}</style>";
        $back_color = "green";

        $ca->next();
        $r = $ca->assoc();
        $respuesta = "";
        $text_action = "";
        if ($r["accion"] == "Finalizado") {
            $text_action = " ha finalizado una tarea";
        } else
        if ($r["accion"] == "Avance") {
            $text_action = "ha realizado un avance";
        } else
        if ($r["accion"] == "Tarea Nueva") {
            $text_action = "te asignó una Tarea nueva";
        } else
        if ($r["accion"] == "Devolución") {
            $text_action = "ha hecho una devolución";
        } else {
            $text_action = $r["accion"];
        }
        ?>
        <script>

            function setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            }

            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++)
                {
                    var c = ca[i].trim();
                    if (c.indexOf(name) == 0)
                        return c.substring(name.length, c.length);
                }
                return "";
            }

            function checkCookie() {
                var user = getCookie("username");
                if (user != "") {
                    alert("Welcome again " + user);
                }
                else {
                    user = prompt("Please enter your name:", "");
                    if (user != "" && user != null)
                    {
                        setCookie("username", user, 30);
                    }
                }
            }

            //  checkCookie();
        </script>
        <script>

            function Notifier() {
            }

            // Returns "true" if this browser supports notifications.
            Notifier.prototype.HasSupport = function() {
                if (window.webkitNotifications) {
                    return true;
                } else {
                    return false;
                }
            }

            // Request permission for this page to send notifications. If allowed,
            // calls function "cb" with true.
            Notifier.prototype.RequestPermission = function(cb) {
                window.webkitNotifications.requestPermission(function() {
                    if (cb) {
                        cb(window.webkitNotifications.checkPermission() == 0);
                    }
                });
            }

            // Popup a notification with icon, title, and body. Returns false if
            // permission was not granted.
            Notifier.prototype.Notify = function(icon, title, body) {
                if (window.webkitNotifications.checkPermission() == 0) {
                    var popup = window.webkitNotifications.createNotification(
                            icon, title, body);
                    popup.show();

                    return true;
                }

                return false;
            }
            var cook = <?php echo $tareas_total; ?>;
            setTimeout("ckeckCook(" + cook + ")", 10500); // 5 segundos
            document.cookie = "cookie=" + cook;

            uno = 0;
            if (xxx == undefined) {
                xxx = 0;
            }
            var cookie = getCookie("cookie");
            //            console.log("cook: " + cook);
            //            console.log("xx: " + xxx);

            function newNotification(title, content, img_uri) {
                //                if (window.webkitNotifications && checkPermission()) {
                if (window.webkitNotifications.checkPermission() == 0) {
                    var notification = window.webkitNotifications.createNotification(img_uri, title, content);
                    notification.show();
                    return true;
                } else
                if (Notification && checkPermission()) {
                    return {
                        show: function() {
                            alert("moziila");
                            new Notification(title,
                                    {
                                        body: content,
                                        iconUrl: img_uri
                                    });
                        }
                    }
                }
            }
            if (cook > xxx) {
//                newNotification("<?php echo $_SESSION["usuario"] . "! " . $r["user"] . " " . $text_action; ?>",
//                        "<?php echo "Tarea: " . $r["tarea"] . $respuesta; ?>",
//                        "http://www.netwoods.net/imagenes/imagenes_2012/logo_menu_kid.png");
                xxx = cook;
            }
            function ckeckCook(c) {
                xxx = c;
            }

        </script>
        <?php
    }
    echo $tareas_total;
}

function vencidas() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "";
    $where .= " where 1=1 and usuario_asignado=:usuario_id and estado<>3 and estado<>7 and estado<>4 and estado<>5 and estado<>8 and fecha_final < :hoy";
    $sql = "select id from tareas_diarias " . $where;
    $ca->prepare($sql);
    $ca->bindValue(":usuario_id", $_SESSION["id"]);
    $ca->bindValue(":hoy", date("Y-m-d"));
    if (!$ca->exec()) {
        echo "no se pudo consultar";
        return;
    }
    $vencidas = $ca->size();
    if ($vencidas == 0) {
        $vencidas = "0";
    } else {
        $vencidas = $ca->size() . "<span class='Vencida_admiracion'>!</span>";
    }
    echo "<span class='vencidas_span'>" . $vencidas . "</span>";
}
?>
<div id="refresh" class="refresh icons icons_refresh"></div>
<div id="icons_task_venc" class="icons_task_venc">
    <?php
    vencidas();
    ?>
</div>
<div class="icons icons_notificas" id="loadNotifications">
    <?php
    movimientos();
    ?>
</div>

<script>

    document.getElementById("refresh").onclick = function() {
        loadCalendar(1, 0, 0, 0, 0);
        notifications();
    };
    document.getElementById("loadNotifications").onclick = function() {
        loadNotifications();
        $('#box_notifications_load').fadeIn(10);
    };
    document.getElementById("icons_task_venc").onclick = function() {
        loadNotificationsVencidas();
        $('#box_notifications_load').fadeIn(10);
    };
</script>