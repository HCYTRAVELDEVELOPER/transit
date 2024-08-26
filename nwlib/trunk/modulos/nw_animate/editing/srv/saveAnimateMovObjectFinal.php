<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animate/_mod.php';
}
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$tabla = "nwanimate_objetos";
if (!isset($p["id"])) {
    echo "No hay objeto válido";
    return;
}
$id_ob = $p["id"];
echo $p;
$fields = "pos_x, pos_y, pos_x_inicial, pos_y_inicial,pos_x_final, pos_y_final, movimiento, velocidad, reproducir, opacidad_inicial, opacidad_final";
$ca->prepareUpdate($tabla, $fields, "id=:id");
$ca->bindValue(":id", $id_ob);
$ca->bindValue(":pos_x", $p["pos_x"]);
$ca->bindValue(":pos_y", $p["pos_y"]);
$ca->bindValue(":pos_x_inicial", 0);
$ca->bindValue(":pos_y_inicial", 0);
$ca->bindValue(":pos_x_final", $p["pos_x_final"]);
$ca->bindValue(":pos_y_final", $p["pos_y_final"]);
$ca->bindValue(":movimiento", "si");
//    $ca->bindValue(":width", $p["width"]);
//    $ca->bindValue(":height", $p["height"]);
$ca->bindValue(":velocidad", $p["velocidad"]);
$ca->bindValue(":reproducir", $p["reproducir"]);
$ca->bindValue(":opacidad_inicial", $p["opacidad_inicial"]);
$ca->bindValue(":opacidad_final", $p["opacidad"]);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
} else {
    echo $id_ob;
}
?>