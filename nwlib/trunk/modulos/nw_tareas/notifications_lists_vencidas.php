<?php
//require_once dirname(__FILE__) . '/../../rpcsrv/_mod.inc.php';
if (session_id() == "") {
    ini_set('session.cookie_domain', '.gruponw.com');
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
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$anio = "";
$where__ = "";
$where__ .= " where 1=1 and usuario_asignado=:user and estado<>3 and estado<>7 and estado<>4 and estado<>5 and estado<>8 and fecha_final < :hoy order by fecha_final desc";
$sqlb = "select * from tareas_diarias " . $where__;
$cb->prepare($sqlb);
$cb->bindValue(":user", $_SESSION["id"]);
$cb->bindValue(":usuario_text", $_SESSION["usuario"]);
$cb->bindValue(":hoy", date("Y-m-d"));
if (!$cb->exec()) {
    echo "no se pudo consultar";
    return;
}
if ($cb->size() == 0) {
    echo "no hay historial.";
    return;
}

?>
<div id="box_notifications">
    <?php
    for ($i = 0; $i < $cb->size(); $i++) {
        $cb->next();
        $r = $cb->assoc();
        $fecha_accion = explode("-", $r["fecha_final"]);
        $dia_hora = explode(" ", $fecha_accion[2]);
        if ($fecha_accion[1] == 1) {
            $mes = "Enero";
        }
        if ($fecha_accion[1] == 2) {
            $mes = "Febrero";
        }
        if ($fecha_accion[1] == 3) {
            $mes = "Marzo";
        }
        if ($fecha_accion[1] == 4) {
            $mes = "Abril";
        }
        if ($fecha_accion[1] == 5) {
            $mes = "Mayo";
        }
        if ($fecha_accion[1] == 6) {
            $mes = "Junio";
        }
        if ($fecha_accion[1] == 7) {
            $mes = "Julio";
        }
        if ($fecha_accion[1] == 8) {
            $mes = "Agosto";
        }
        if ($fecha_accion[1] == 9) {
            $mes = "Septiembre";
        }
        if ($fecha_accion[1] == 10) {
            $mes = "Octubre";
        }
        if ($fecha_accion[1] == 11) {
            $mes = "Noviembre";
        }
        if ($fecha_accion[1] == 12) {
            $mes = "Diciembre";
        }
        if ($fecha_accion[0] != date("Y")) {
            $anio = " del " . $fecha_accion[0];
        }
        ?>
        <script>
            $("#_notification__<?php echo $r["id"] ?>").click(function() {
                seetareaDialog(<?php echo $r["id"]; ?>, 1, '<?php echo $r["fecha_final"]; ?>', '<?php echo $r["fecha_final"]; ?>',<?php echo $r["id"]; ?>, <?php echo $r["id"]; ?>);
            });
        </script>
        <?php
        $fecha_notifica = "<p>" . $dia_hora[0] . " de " . $mes . " $anio a la(s) " . $r["hora_final"] . "</p>";
        echo " <div id='_notification__" . $r["id"] . "' >
                        " . strip_tags($r["tarea"]) . "<br />
                           $fecha_notifica
                       </div>";
    }
    ?>
</div>
<div class="notifications_button_all">
    ver todas
</div>
<script>
    $(document).ready(function() {
        var actua = "";
        $('#box_notifications_load').mouseenter(function() {
            clearTimeout(actua);
            return;
        });
        $('#box_notifications_load').mouseleave(function() {
            actua = setTimeout('borrar()', 3000);
            $('#enc_main_user_dats').live("click", function() {
                $('#box_notifications_load').fadeOut(0);
            });
            $('#main_main').live("click", function() {
                $('#box_notifications_load').fadeOut(0);
            });
            $('#calendar_nw').live("click", function() {
                $('#box_notifications_load').fadeOut(0);
            });
        });
    });
    function borrar() {
        document.getElementById("box_notifications_load").innerHTML = "";
    }
</script>