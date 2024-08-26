<?php

include($_SERVER['DOCUMENT_ROOT'] . "/nwproject/conectar/conectar.php");
conectar();
@mysql_query("SET NAMES 'utf8'");
/* +++++++++++++++++ funcion para evitar inyección de código ++++++++++++++++++++++ */
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

$sql = sprintf("select * from usuarios_general where usuario=%s ", GetSQLValueString($_POST["usuario"], "text"));
$query = mysql_query($sql);
$num_rows = mysql_num_rows($query);

if ($num_rows != 0) {
    echo "Ya existe un usuario con ese nick. Intente nuevamente. ";
    return;
} else {
    echo "Puede usar ese usuario";
}

?>
