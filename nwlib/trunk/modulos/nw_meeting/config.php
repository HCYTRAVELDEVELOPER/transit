<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib6/modulos/nw_animate/";
    $ruta_js = "http://" . $_SERVER["HTTP_HOST"] . $ruta_enlaces;
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animation/_mod.php';
}
?>
