<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
} else {
//NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwplay_ruleta_codigos", "id", "id_enc=:id and code=:code and estado<>:estado limit 1");
$ca->bindValue(":id", $_POST["id"], true);
$ca->bindValue(":code", $_POST["code"], true);
//$ca->bindValue(":estado", "activo");
$ca->bindValue(":estado", "usado");
if (!$ca->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
if ($ca->size() == 0) {
    echo 0;
    return;
}
if ($ca->size() > 0) {
    echo 1;
    return;
}
?>