<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$fields = "pos_x,pos_y,fecha,usuario,empresa, width, height, rotacion";
if ($p["id"] != "false") {
    $ca->prepareUpdate("nwanimate_objetos", $fields, "id=:id");
    $ca->bindValue(":id", $p["id"]);
}
//$ca->prepareInsert("man_otros_objetos", $fields);
$ca->bindValue(":pos_x", $p["pos_x"], true);
$ca->bindValue(":pos_y", $p["pos_y"], true);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":width", $p["width"]);
$ca->bindValue(":height", $p["height"]);
$ca->bindValue(":rotacion", $p["rotacion"]);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}
?>