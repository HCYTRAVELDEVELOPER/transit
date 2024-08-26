<?php

//NWUtils::start_compression();

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//error_reporting(-1);
$user = "export";
if (isset($_SESSION["usuario"])) {
    $user = $_SESSION["usuario"];
}
//if (!isset($_SESSION["usuario"])) {
//    $msg = "Debe ingresar correctamente al programa para ver esta impresi&oacute;n. Intente refrescando el navegador.";
//    echo $msg;
//    return;
//}
$id_file = "";
if (isset($_GET["file_id"])) {
    $id_file = NWUtils::cleanString($_GET["file_id"]);
} else {
    return;
}

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nw_files_admin", "*", "id=:id");
$ca->bindValue(":id", $id_file);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "No se encontró la descarga solicitada";
    return;
}
$ca->next();
$r = $ca->assoc();
if ($r["salvar_al_guardar"] == true || $r["salvar_al_guardar"] == "true" || $r["salvar_al_guardar"] == "t") {
    $ca->prepareInsert("nw_files_downloads", "archivo,usuario,fecha,hora");
    $ca->bindValue(":archivo", $id_file);
    $ca->bindValue(":usuario", $user);
    $ca->bindValue(":fecha", date("Y-m-d"));
    $ca->bindValue(":hora", date("H:i:s"));
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
}

//$fullpath = dirname(__FILE__) . "/../" . $r["ubicacion"];
$fullpath = $_SERVER["DOCUMENT_ROOT"] . "/" . $r["ubicacion"];
header("Cache-Control: public, must-revalidate");
header("Pragma: hack");
header("Content-Type: application/octet-stream");
//header("Content-Length: " . (string) (filesize($fullpath)));
header('Content-Disposition: attachment; filename="' . basename($r["ubicacion"]) . '"');
//header("Content-Transfer-Encoding: binary\n");

readfile($fullpath);
?>