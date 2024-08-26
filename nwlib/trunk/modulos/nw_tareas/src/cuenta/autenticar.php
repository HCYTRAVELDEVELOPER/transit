<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_config.php';

include_once $_SERVER['DOCUMENT_ROOT'] . "/nwproject/conectar/conectar.php";
include_once $_SERVER['DOCUMENT_ROOT'] . "/nwproject/php/utiles.php";

conectar();

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


if (isset($_POST['usuario'])) {
    $sql = sprintf("SELECT * FROM usuarios_general WHERE usuario=%s", GetSQLValueString($_POST['usuario'], "text"));
    $result = mysql_query($sql);
    if (mysql_num_rows($result) == 0) {
        alert("Usuario o clave incorrecta");
        php_location($_SERVER["HTTP_REFERER"]);
    } else {
        $array = mysql_fetch_array($result);
        if ($array['clave'] == $_POST['clave']) {
            session_name('login');
            session_start();
            $_SESSION['usuario'] = $array['usuario'];
            $_SESSION['ciudad'] = $array['ciudad'];
            $_SESSION['autenticado'] = 'si';
            alert("Autenticado correctamente");
            $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
            $sql = "select * from login";
            $query = mysql_query($sql);
            $result = mysql_fetch_array($query);
            if ($result["direccion"] == 0) {
                if ($_POST["id_form"] == 1) {
                    php_location($_SERVER["HTTP_REFERER"] . "?form");
                } else {
                    php_location($_SERVER["HTTP_REFERER"]);
                }
            } else {
                $sql = "select * from paginas where id=" . $result["direccion"] . " ";
                $query = mysql_query($sql);
                $redir = mysql_fetch_array($query);

                $sql = "select * from carpeta";
                $query = mysql_query($sql);
                $carpeta = mysql_fetch_array($query);

                php_location('http://' . $_SERVER["HTTP_HOST"] . '/' . $carpeta["nombre"] . '/' . $redir["nombre"] . "-" . $redir["id"]);
            }
        } else {
            alert("Usuario o clave incorrecta");
            php_location($_SERVER["HTTP_REFERER"]);
        }
    }
    Desconectar();
}
?>