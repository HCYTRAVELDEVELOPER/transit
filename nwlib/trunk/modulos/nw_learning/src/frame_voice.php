<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
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
}
require "../cryp.php";

encript::decode($_POST["id"], $cl_v);
$id = encript::$string; // valor desencriptado

$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$sql = "select texto_audio from man_objetos where id=:id";
$cb->bindValue(":id", $id);
$cb->prepare($sql);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. ";
    //  return;
}
if ($cb->size() == 0) {
    //return;
}
$cb->next();
$array = $cb->assoc();
?>

<iframe id="frame_pr" class='frame_pr' src='http://translate.google.com/translate_tts?tl=es&q=<?php echo $array["texto_audio"]; ?>' ></iframe>