<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';

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

error_reporting(1); //E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT

ini_set("display_errors", 1);

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$sql = "select * from nc_config";

$ca->prepare($sql);

if (!$ca->exec()) {
    echo "No se pudo consultar la configuración de NWCommerce. ";
    return;
}

if ($ca->size() == 0) {
    echo "No hay configuración creada para el proyecto. Por favor ingrese a NWCommerce y créela. ";
    return;
}

$ca->next();

$nc_cfg = $ca->assoc();

$sql = "select * from carpeta";
$ca->prepare($sql);

if (!$ca->exec()) {
    echo "No se pudo consultar la carpeta. ";
    return;
}

if ($ca->size() == 0) {
    echo "No a creado la carpeta. Ingrese a nwproject y créela. ";
    return;
}

$ca->next();

$r = $ca->assoc();

$nc_cfg["carpeta"] = $r["nombre"];

if ($nc_cfg["marca_agua"] != "") {
    $nc_cfg["marca_agua"] = "&amp;fltr[]=wmi|" . str_replace("http://" . $_SERVER["HTTP_HOST"], "", $nc_cfg["marca_agua"]) . "|30x30|20|75|0|45";
}

?>
