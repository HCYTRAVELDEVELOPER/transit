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
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$where__ = " where 1=1 ";
$anio = "";
//$where__ .= " and a.leido='NO' ";
$where__ .= " and b.fecha >= :fecha_consulta ";
//$where__ .= " and (EXTRACT(EPOCH FROM a.fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 10800)) ";
$sqlb = "select a.accion,a.id as id_mov,a.fecha as fecha_mov, b.*,func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text,
    a.leido as mov_leido
    FROM tareas_diarias_movs a
    left join tareas_diarias b on (a.id_tarea=b.id) " . $where__ . " order by a.fecha desc";
$cb->prepare($sqlb);
$cb->bindValue(":user", $_SESSION["id"]);
$cb->bindValue(":usuario_text", $_SESSION["usuario"]);
$hoy = date("Y-m-d");
$hoyExplode = explode("-", $hoy);
$restaHoy = $hoyExplode[2] - 5;
$hacedias = date("Y-m") . "-" . $restaHoy;
$cb->bindValue(":fecha_consulta", $hacedias);
if (!$cb->exec()) {
    echo "no se pudo consultar " . $cb->lastErrorText();
    return;
}
if ($cb->size() == 0) {
    echo "no hay historial.";
    return;
}

?>
<div id="box_notifications">
    <?php
    $nada = "";
    for ($i = 0; $i < $cb->size(); $i++) {
        $cb->next();
        $r = $cb->assoc();
        $fecha_accion = explode("-", $r["fecha_mov"]);
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
        if ($r["mov_leido"] == "NO") {
            $clase = "class='notification_no_leido'";
        } else {
            $clase = "";
        }

        $text_action = "";
        if ($r["accion"] == "Finalizado") {
            $text_action = "ha <strong>finalizado</strong> una tarea";
        } else
        if ($r["accion"] == "Avance") {
            $text_action = "ha realizado un <strong>avance</strong>";
        } else
        if ($r["accion"] == "Tarea Nueva") {
            $text_action = "te asignó una <strong>Tarea nueva</strong>";
        } else
        if ($r["accion"] == "Devolución") {
            $text_action = "ha hecho una devolución";
        } else {
            $text_action = $r["accion"];
        }
        ?>
        <script>
            $("#_notification<?php echo $r["id_mov"] ?>").click(function() {
                seetareaDialog(<?php echo $r["id"]; ?>, 1, '<?php echo $r["fecha_mov"]; ?>', '<?php echo $r["fecha_mov"]; ?>',<?php echo $r["id"]; ?>, <?php echo $r["id"]; ?>,<?php echo $r["id_mov"]; ?>);
            });
        </script>
        <?php
        $fecha_notifica = "<p>" . $dia_hora[0] . " de " . $mes . " $anio a la(s) " . $dia_hora[1] . "</p>";


        if ($r["accion"] == "Tarea Nueva") {
            if ($r["usuario"] != $_SESSION["usuario"] & $r["usuario_asignado"] == $_SESSION["id"]) {
                echo " <div id='_notification" . $r["id_mov"] . "' $clase>
                        <h3>" . $r["usuario"] . "</h3> $text_action <br /> 
                        " . $r["tarea"] . "<br />
                           $fecha_notifica
                       </div>";
            }
        }
        if ($r["accion"] != "Tarea Nueva") {
            if ($r["usuario"] == $_SESSION["usuario"] & $r["usuario_asignado"] != $_SESSION["id"]) {
                echo " <div id='_notification" . $r["id_mov"] . "' $clase>
                         <h3>" . $r["usuario_asignado_text"] . "</h3> $text_action <br /> 
                         " . $r["tarea"] . "<br />
                            $fecha_notifica
                       </div>";
            }
        }
        $cg = new NWDbQuery($db);
        $cg->prepareUpdate("tareas_diarias_movs", "leido", "id=:id");
        $cg->bindValue(":id", $r["id_mov"]);
        $cg->bindValue(":leido", "SI");
        if (!$cg->exec()) {
            echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
            return;
        }
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
//        $('#box_notifications_load').live('mouseleave', function() {
//            $('body').live("click", function() {
//                $('#box_notifications_load').fadeOut('slow');
//            });
//            return false; // Para evitar el efecto de burbujeo
//        });
    });
    function borrar() {
        document.getElementById("box_notifications_load").innerHTML = "";
    }
</script>