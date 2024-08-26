<?php

//error_reporting(-1);
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == null) {
    session_start();
}
//if (!isset($_SESSION["usuario"])) {
//    $msg = "Debe ingresar correctamente al programa para ver esta impresi&oacute;n. Intente refrescando el navegador.";
//    echo $msg;
//    return;
//}
$id = "";
if (isset($_GET["id"])) {
    $id = clean($_GET["id"]);
} else {
    return;
}
$key = "";
if (isset($_GET["key"])) {
    $key = clean($_GET["key"]);
} else {
    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nw_downloads", "*", "id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$r = $ca->flush();
if ($r == false) {
    echo "No se encontró el archivo a descargar. Inténtelo de nuevo";
    return;
}
if ($key != $r["clave"]) {
    echo "Las llaves de acceso no coinciden. Intentelo de nuevo";
    return;
}

function clean($value) {
    $text = html_entity_decode(strip_tags($value));
    $text = str_replace("&rsquo;", "'", $text);
    $content = preg_replace("/&#?[a-z0-9]{2,8};/i", "", $text);
    $invalid_characters = array("$", "%", "#", "<", ">", "|");
    $str = str_replace($invalid_characters, "", $content);
    $output = preg_replace('/[^(\x20-\x7F)]*/', '', $str);
    return $output;
}

$name = basename($r["path"]);
$fullpath = $_SERVER["DOCUMENT_ROOT"] . "/" . "tmp/" . $name;
$prefix = "http://";
if (isset($_SERVER['HTTPS'])) {
    if ($_SERVER['HTTPS'] == "on") {
        $prefix = "https://";
    }
}

$name = $name . "?r=" . rand();

//ob_start();

header("Location: " . $prefix . $_SERVER["HTTP_HOST"] . "/tmp/" . $name);

//ob_end_flush();
//@ob_flush();
//flush();
//sleep(20);
//unlink($fullpath);

exit;

$type = "application/octet-stream";
if ($r["file_name"] == "nw_export_xls") {
    $type = "application/vnd.ms-excel";
}
header('Content-Description: File Transfer');
header("Cache-Control: public, must-revalidate");
header("Pragma: no-cache");
header("Content-Type: " . $type);
//header("Content-type:   application/x-msexcel; charset=utf-8");
//header("Content-Length: " . (string) (filesize($fullpath)));
header("Content-Disposition: attachment; filename=\"" . basename($fullpath) . "\"");
header("Expires: 0");
readfile($fullpath);
exit;
?>