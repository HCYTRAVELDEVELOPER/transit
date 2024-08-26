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
$ca->prepareSelect("nwplay_ruleta_codigos", "premio", "id_enc=:id and code=:code limit 1");
$ca->bindValue(":id", $_POST["id"], true);
$ca->bindValue(":code", $_POST["code"], true);
if (!$ca->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
$ca->next();
$r = $ca->assoc();
echo $r["premio"];
?>