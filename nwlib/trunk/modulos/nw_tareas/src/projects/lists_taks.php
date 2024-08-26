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
$id = $_POST["id"];
$id_enc = $_POST["id_enc"];

$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$where__ = " where proyecto=:id_enc order by fecha asc";
$sqlb = "select *,
    func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text from tareas_diarias" . $where__;
$cb->prepare($sqlb);
$cb->bindValue(":user", $_SESSION["id"]);
$cb->bindValue(":usuario_text", $_SESSION["usuario"]);
$cb->bindValue(":hoy", date("Y-m-d"));
$cb->bindValue(":id", $id);
$cb->bindValue(":id_enc", $id_enc);
if (!$cb->exec()) {
    echo "no se pudo consultar";
    return;
}
if ($cb->size() == 0) {
    echo "No se han encontrado datos";
}
?>
<div id="box_notifications">
    <?php
    for ($i = 0; $i < $cb->size(); $i++) {
        $cb->next();
        $r = $cb->assoc();
        ?>
        <script>
            $("#_notification<?php echo $r["id"] ?>").click(function() {
                listTaskPr(<?php echo $r["id"]; ?>);
            });
        </script>
        <?php
        echo " <div id='_notification" . $r["id"] . "' ><b>" . $r["tarea"] . "</b><br />" . $r["usuario_asignado_text"] . " " . $r["fecha"] . " - " . $r["fecha_final"];
        echo "</div>";
    }
    ?>
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