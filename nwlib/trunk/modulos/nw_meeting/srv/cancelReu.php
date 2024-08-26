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
$ca->prepareUpdate("nwreu_enc", "cancelada", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":cancelada", "SI");
if (!$ca->exec()) {
    echo "No se pudo realizar la operación.";
    return;
} else {
    echo "Reunión cancelada correctamente.";
}
?>
