<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
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
$fields = "latitud,longitud,direccion,fecha,usuario,empresa, tarea";
$ca->prepareInsert("nwtask_ubications", $fields);
$ca->bindValue(":latitud", $_POST["lat"]);
$ca->bindValue(":longitud", $_POST["lon"]);
$ca->bindValue(":direccion", $_POST["dir"]);
$ca->bindValue(":tarea", $_POST["id"], true, true);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":empresa", $_SESSION["empresa"]);
$ca->bindValue(":leido", 1);
if (!$ca->exec()) {
    echo "errores";
    return;
} else {
    echo "enviado correctamente";
}
?>
